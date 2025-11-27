import type { ReactElement } from 'react';
import { Children, type FC, isValidElement, useMemo } from 'react';

export type UseSubcomponentsProps<T extends string> = {
    children: ReactElement | ReactElement[];
    /**
     * array of displayName as string
     * */
    allowedChildren: T[];
};

/**
 *  This will return an object with the displayNames as the property names
 *  eg. allowedChildren: ['Drawer_Header', 'Drawer_Content', 'Drawer_Footer', 'DrawerItem'];
 *
 *  return value -> {
 *    Drawer_Header: [],
 *    Drawer_Content: [],
 *    Drawer_Footer: [],
 *    DrawerItem: [],
 *  }
 *  */
const useSubcomponents = <T extends string = string>({
    children,
    allowedChildren,
}: UseSubcomponentsProps<T>) => {
    return useMemo(() => {
        // this will create properties with default empty array values even if they don't exist in the children
        const defaultContext = allowedChildren.reduce((context, childName) => {
            return {
                ...context,
                [childName]: [],
            };
        }, {}) as {
            [key in T]: ReactElement[];
        };

        return Children.map(children, child => child).reduce((context, child) => {
            if (!isValidElement(child)) return context;

            if (
                !allowedChildren.find(name => name === ((child.type as FC).displayName as string))
            ) {
                return context;
            }

            const name = (child.type as FC).displayName as T;

            if (!name) return context;

            return {
                ...context,
                [name]: [...context[name], child],
            };
        }, defaultContext);
    }, [allowedChildren, children]);
};

export default useSubcomponents;
