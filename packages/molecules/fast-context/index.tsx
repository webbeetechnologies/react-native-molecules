import {
    type Context,
    createContext,
    type ReactNode,
    type RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import typedMemo from '../hocs/typedMemo';
import { usePrevious } from '../hooks';
import { shallowCompare } from '../utils';

type StoreDataType = Record<string, any>;

type SelectorOutputType<IStore, SelectorOutput> = (store: IStore) => SelectorOutput;

type UseStoreDataReturnType<T> = {
    get: () => T;
    set: (value: (prev: T) => Partial<T>) => void;
    store: RefObject<T>;
    subscribe: (callback: () => void) => () => void;
};

const useStoreData = <IStore extends StoreDataType>(
    value: IStore,
    defaultValue: IStore | null,
    watch: boolean = false,
): UseStoreDataReturnType<IStore> => {
    const store = useRef<IStore>({ ...defaultValue, ...(value as IStore) });
    const watchRef = useRef(watch);

    const get = useCallback(() => store.current, [store]);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback(
        (callback: (prev: IStore) => Partial<IStore>) => {
            store.current = { ...store.current, ...callback(store.current) };
            subscribers.current.forEach(subscriber => subscriber());
        },
        [store],
    );

    const subscribe = useCallback((callback: () => void) => {
        subscribers.current.add(callback);

        return () => subscribers.current.delete(callback);
    }, []);

    /** The effect is required to trigger the updates on the consumers */
    useEffect(() => {
        if (!watchRef.current) return;
        set(prev => ({ ...prev, ...value }));
    }, [set, value]);

    /**
     * Cases:
     * 1. when the value updates, we want the data to be updated immediately
     * 2. the data stored in store.current may not be current with regards to the parent and the parent must have dropped the references related to the data.
     * 3. because store.current is a ref, on watch and change, if we update store.current, no side-effect introduced.
     */
    if (usePrevious(value).current !== value && watchRef.current) {
        store.current = { ...store.current, ...value };
    }

    return useMemo(
        () => ({
            get,
            set,
            subscribe,
            store,
        }),
        [get, set, subscribe],
    );
};

export const createFastContext = <T extends StoreDataType = {}>(
    defaultValue: T | null = null,
    watch: boolean = false,
) => {
    const context = createContext<UseStoreDataReturnType<T> | null>(null);

    return {
        /**
         * using the value from here will never cause a rerender as context is based on refs.
         */
        useStoreRef: createUseRefContext(context),

        /**
         *
         * the value is memoized and thus changing the value will have no effect.
         * use key prop to unmount and remount if necessary. alternatively use set from the context to update the value.
         *
         */
        Provider: createProvider<T>(
            context as Context<UseStoreDataReturnType<T>>,
            defaultValue,
            watch,
        ),

        /**
         *
         * @param selector
         * @param equalityCheck
         * @returns tuple, first item is return value of the selector and the second item is setter
         *
         */
        useContext: <SelectorOutput,>(
            selector: SelectorOutputType<T, SelectorOutput>,
            equalityCheck = shallowCompare,
        ) => useStore(context as Context<UseStoreDataReturnType<T>>, selector, equalityCheck),

        /**
         *
         * @param selector
         * @param equalityCheck
         * @returns return value of the selector
         *
         */
        useContextValue: <SelectorOutput,>(
            selector: SelectorOutputType<T, SelectorOutput>,
            equalityCheck = shallowCompare,
        ) => useStoreValue(context as Context<UseStoreDataReturnType<T>>, selector, equalityCheck),
        /**
         * context of the store. Useful for ContextBridge
         */
        Context: context,
    };
};

export const createProvider = <T extends Record<string, any> = {}>(
    StoreContext: Context<UseStoreDataReturnType<T>>,
    defaultValue: T | null,
    watch: boolean,
) =>
    typedMemo(({ value, children }: { value: T; children: ReactNode }) => {
        return (
            <StoreContext.Provider value={useStoreData<T>(value, defaultValue, watch) as any}>
                {children}
            </StoreContext.Provider>
        );
    });

export const createUseRefContext = <T,>(_Context: Context<UseStoreDataReturnType<T> | null>) => {
    return () => {
        const value = useContext<UseStoreDataReturnType<T> | null>(_Context);
        if (value === null)
            throw 'Fast Context requires the value to be wrapped in a Provider with a value.';

        return value;
    };
};

export const useStore = <IStore extends StoreDataType, SelectorOutput>(
    _Context: Context<UseStoreDataReturnType<IStore>>,
    selector: SelectorOutputType<IStore, SelectorOutput>,
    equalityFn = Object.is,
): [SelectorOutput, (value: (prev: IStore) => Partial<IStore>) => void] => {
    const store = useContext(_Context);
    if (!store) {
        throw new Error('Store not found');
    }

    const state = useSyncExternalStoreWithSelector(
        store.subscribe,
        () => {
            return store.get();
        },
        undefined,
        snapshot => {
            return selector(snapshot);
        },
        equalityFn,
    );

    return [state, store.set];
};

export const useStoreValue = <IStore extends StoreDataType, SelectorOutput>(
    _Context: Context<UseStoreDataReturnType<IStore>>,
    selector: SelectorOutputType<IStore, SelectorOutput>,
    equalityFn = Object.is,
) => {
    return useStore(_Context, selector, equalityFn)[0];
};
