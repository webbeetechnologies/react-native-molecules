import type { ReactElement, ReactNode } from 'react';
import { Children, type FC, isValidElement, useMemo } from 'react';

export type UseSubcomponentsProps<T extends string> = {
    children: ReactNode;
    /**
     * array of displayName as string
     * */
    allowedChildren: (T | { name: T; allowMultiple?: boolean })[];
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
        const configs = allowedChildren.map(entry =>
            typeof entry === 'string'
                ? { name: entry, allowMultiple: true as boolean }
                : { name: entry.name, allowMultiple: entry.allowMultiple ?? true },
        );

        const nameSet = new Set(configs.map(c => c.name));
        const allowMultipleMap = new Map(configs.map(c => [c.name, c.allowMultiple]));

        const result = configs.reduce((acc, { name }) => {
            (acc as any)[name] = [];
            return acc;
        }, (includeRest ? { rest: [] } : {}) as UseSubcomponentsResult<T, IncludeRest>);

        Children.forEach(children, child => {
            if (!isValidElement(child)) {
                if (includeRest) {
                    (result as any).rest.push(child);
                }
                return;
            }

            const displayName = (child.type as FC)?.displayName as T | undefined;

            if (displayName && nameSet.has(displayName)) {
                if (allowMultipleMap.get(displayName)) {
                    (result as any)[displayName].push(child);
                } else {
                    // Only keep the last matching child
                    (result as any)[displayName] = [child];
                }

                return;
            }

            if (includeRest) {
                (result as any).rest.push(child);
            }
        });

        return result;
    }, [allowedChildren, children, includeRest]);
}

export default useSubcomponents;
