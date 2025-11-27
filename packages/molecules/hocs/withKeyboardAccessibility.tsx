import {
    type ComponentType,
    forwardRef,
    Fragment,
    memo,
    type ReactNode,
    type RefObject,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import type { FlatList } from 'react-native';
import type { SectionList } from 'react-native';
import { Platform } from 'react-native';

import { createFastContext } from '../fast-context';
import useLatest from '../hooks/useLatest';

export type Store = {
    currentIndex: number | null;
};

const defaultValue = { currentIndex: null };

const {
    useStoreRef,
    Provider,
    useContext: useFastContext,
    useContextValue,
} = createFastContext<Store>();

const withKeyboardAccessibility = <P extends Record<string, any>>(
    Component: ComponentType<P>,
    key: string = 'records',
    isFlat: boolean = false,
) =>
    // @ts-expect-error // TODO - fix ts issues
    forwardRef(({ enableKeyboardNavigation, onCancel, ...props }: P, ref: any) => {
        const componentRef = useRef<FlatList | SectionList>(null);
        const records = props[key] as any[];

        const recordsIndexMap = useMemo(() => {
            if (!records) return {};

            const flattenRecords = isFlat
                ? records
                : records.reduce((acc, item, sectionIndex) => {
                      return acc.concat(
                          (item.data || []).map((t: any) => ({ ...t, sectionIndex })),
                      );
                  }, [] as any[]);

            return flattenRecords.reduce((acc: Record<number, any>, item: any, i: number) => {
                acc[i] = item;

                return acc;
            }, {} as Record<number, any>);
        }, [records]);

        const length = useMemo(() => {
            if (!isFlat) {
                return records.reduce((acc, item) => {
                    acc += item.data.length;
                    return acc;
                }, 0);
            }

            return records.length;
        }, [records]);

        const onSelectItem = useCallback(
            (index: number) => {
                const selectItem = recordsIndexMap[index];

                if (!selectItem) return props.onSelectionChange?.(props.selection);

                props.onSelectionChange?.(
                    props.multiple ? [...props.selection, selectItem] : selectItem,
                );
            },
            [props, recordsIndexMap],
        );

        useImperativeHandle(ref, () => componentRef.current);

        const Wrapper =
            enableKeyboardNavigation && Platform.OS === 'web' ? AccessibilityWrapper : Fragment;

        const accessibilityWrapperProps =
            enableKeyboardNavigation && Platform.OS === 'web'
                ? {
                      listRef: componentRef as any,
                      listLength: length,
                      onSelectItem: onSelectItem,
                      isFlat,
                      onCancel,
                  }
                : {};

        return (
            <Provider value={defaultValue}>
                <Wrapper
                    {...(accessibilityWrapperProps as Omit<AccessibilityWrapperProps, 'children'>)}>
                    <Component {...(props as P)} ref={componentRef} />
                </Wrapper>
            </Provider>
        );
    });

type AccessibilityWrapperProps = {
    children: ReactNode;
    listRef: RefObject<FlatList> | RefObject<SectionList>;
    listLength: number;
    onSelectItem: (index: number) => void;
    isFlat: boolean;
    onCancel?: () => void;
};

const withPreventDefault =
    (func: (e: KeyboardEvent) => void, preventDefault = true) =>
    (e: KeyboardEvent) => {
        if (preventDefault) e.preventDefault();
        func(e);
    };

const AccessibilityWrapper = memo(
    ({
        children,
        listRef,
        listLength,
        onSelectItem,
        isFlat,
        onCancel,
    }: AccessibilityWrapperProps) => {
        const [currentIndex, setStore] = useFastContext(state => state.currentIndex);

        // use the ref here to avoid recreation of the keyToFunctionMap function
        const { store: currentIndexRef } = useStoreRef();

        const keyToFunctionMap = useMemo(
            () => ({
                ArrowUp: withPreventDefault(() =>
                    setStore(prev => ({
                        currentIndex:
                            prev.currentIndex === null || prev.currentIndex === 0
                                ? listLength - 1
                                : prev.currentIndex - 1,
                    })),
                ),
                ArrowDown: withPreventDefault(() =>
                    setStore(prev => ({
                        currentIndex:
                            prev.currentIndex === null || prev.currentIndex === listLength - 1
                                ? 0
                                : prev.currentIndex + 1,
                    })),
                ),
                Enter: withPreventDefault(e => {
                    if (currentIndexRef.current.currentIndex === null) return;
                    e.preventDefault();
                    onSelectItem(currentIndexRef.current.currentIndex);
                }, false),
                Escape: withPreventDefault(e => {
                    if (currentIndexRef.current.currentIndex === null) onCancel?.();
                    e.preventDefault();
                    setStore(() => ({
                        currentIndex: null,
                    }));
                }, false),
            }),
            [currentIndexRef, listLength, onCancel, onSelectItem, setStore],
        );

        const onKeyPress = useCallback(
            (e: KeyboardEvent) => {
                const keyFunction = keyToFunctionMap[e.key as keyof typeof keyToFunctionMap];

                if (!keyFunction) return;

                keyFunction(e);
            },
            [keyToFunctionMap],
        );

        const listLengthLatest = useLatest(listLength);
        useEffect(() => {
            if (listRef && !!listRef.current) {
                if (
                    currentIndex === null ||
                    currentIndex < 0 ||
                    currentIndex > listLengthLatest.current - 1
                )
                    return;

                if (isFlat) {
                    (listRef as RefObject<FlatList>).current?.scrollToIndex?.({
                        index: currentIndex || 0,
                        animated: false,
                    });
                } else {
                    (listRef as RefObject<SectionList>).current?.scrollToLocation({
                        animated: false,
                        sectionIndex: 0,
                        itemIndex: currentIndex,
                    });
                }
            }
        }, [currentIndex, isFlat, listRef, listLengthLatest]);

        useEffect(() => {
            const controller = new AbortController();
            window.addEventListener('keydown', onKeyPress, {
                capture: true,
                signal: controller.signal,
            } as AddEventListenerOptions);

            return () => {
                controller.abort();
            };
        }, [onKeyPress]);

        return <>{children}</>;
    },
);

export const useCurrentIndexStore = useFastContext;
export const useCurrentIndexStoreValue = useContextValue;

export default withKeyboardAccessibility;
