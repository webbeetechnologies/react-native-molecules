import {
    createContext,
    forwardRef,
    memo,
    type ReactElement,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
} from 'react';

export type Props = {
    initialRouteName?: string;
    children: ReactElement | ReactElement[];
};

export type NavigationStackHandle = {
    currentRoute: string;
    push: (route: string) => void;
    pop: () => void;
    navigate: (route: string) => void;
    goBack: () => void;
};

const NavigationStack = ({ initialRouteName, children }: Props, ref: any) => {
    const [currentStack, setCurrentStack] = useState<string[]>(() => [
        initialRouteName ||
            (
                (Array.isArray(children)
                    ? children.find(child => (!!child?.props as any)?.name)
                    : children
                )?.props as any
            )?.name ||
            '',
    ]);
    const currentRoute = currentStack[currentStack.length - 1] || '';

    const push = useCallback((item: string) => {
        setCurrentStack(prev => [...prev, item]);
    }, []);

    const pop = useCallback(() => {
        setCurrentStack(prev => {
            // we don't want to remove the last item in the stack
            if (prev.length <= 1) return prev;

            const newStack = [...prev];

            newStack.pop();
            return newStack;
        });
    }, []);

    const contextValue = useMemo(
        () => ({
            currentRoute,
            push,
            pop,
            navigate: push,
            goBack: pop,
        }),
        [currentRoute, pop, push],
    );

    // the ref will get the same methods as the context
    useImperativeHandle(ref, () => contextValue);

    return (
        <NavigationStackContext.Provider value={contextValue}>
            {children}
        </NavigationStackContext.Provider>
    );
};

type NavigationStackContextType = NavigationStackHandle & {};

export const NavigationStackContext = createContext<NavigationStackContextType>({
    currentRoute: '',
    push: () => {},
    pop: () => {},
    navigate: () => {},
    goBack: () => {},
});

export default memo(forwardRef(NavigationStack));
