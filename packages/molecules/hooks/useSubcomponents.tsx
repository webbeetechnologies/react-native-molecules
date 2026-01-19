import type { ReactElement, ReactNode } from 'react';
import { Children, type FC, isValidElement, useMemo } from 'react';

export type UseSubcomponentsProps<T extends string> = {
    children: ReactNode;
    /**
     * array of displayName as string
     * */
    allowedChildren: T[];
    /**
     * If true, also returns the remaining children that don't match any of the allowedChildren
     * in a `rest` property
     */
    includeRest?: boolean;
};

export type UseSubcomponentsResult<T extends string, IncludeRest extends boolean = false> = {
    [key in T]: ReactElement[];
} & (IncludeRest extends true ? { rest: ReactNode[] } : {});

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
 *
 *  If includeRest is true, also returns:
 *  {
 *    ...above,
 *    rest: [remaining children that don't match allowedChildren]
 *  }
 *  */
function useSubcomponents<T extends string = string, IncludeRest extends boolean = false>({
    children,
    allowedChildren,
    includeRest,
}: UseSubcomponentsProps<T> & { includeRest?: IncludeRest }): UseSubcomponentsResult<
    T,
    IncludeRest
> {
    return useMemo(() => {
        // this will create properties with default empty array values even if they don't exist in the children
        const defaultContext = allowedChildren.reduce(
            (context, childName) => {
                return {
                    ...context,
                    [childName]: [],
                };
            },
            includeRest ? { rest: [] as ReactNode[] } : {},
        ) as UseSubcomponentsResult<T, IncludeRest>;

        const childArray = Children.toArray(children);

        return childArray.reduce((context, child) => {
            if (!isValidElement(child)) {
                // Non-element children go to rest if includeRest is enabled
                if (includeRest) {
                    return {
                        ...context,
                        rest: [...(context as any).rest, child],
                    };
                }
                return context;
            }

            const displayName = (child.type as FC)?.displayName as string | undefined;

            if (!displayName || !allowedChildren.includes(displayName as T)) {
                // Unmatched elements go to rest if includeRest is enabled
                if (includeRest) {
                    return {
                        ...context,
                        rest: [...(context as any).rest, child],
                    };
                }
                return context;
            }

            return {
                ...context,
                [displayName]: [...(context as any)[displayName], child],
            };
        }, defaultContext);
    }, [allowedChildren, children, includeRest]);
}

export default useSubcomponents;
