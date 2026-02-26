import type { ReactElement, ReactNode } from 'react';
import { Children, type FC, isValidElement } from 'react';

export type ExtractSubcomponentsArgs<T extends string> = {
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

export type ExtractSubcomponentsResult<T extends string, IncludeRest extends boolean = false> = {
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
export function extractSubcomponents<
    T extends string = string,
    IncludeRest extends boolean = false,
>({
    children,
    allowedChildren,
    includeRest,
}: ExtractSubcomponentsArgs<T> & { includeRest?: IncludeRest }): ExtractSubcomponentsResult<
    T,
    IncludeRest
> {
    // Single map: name → allowMultiple
    const allowedMap = new Map<T, boolean>();
    for (const entry of allowedChildren) {
        if (typeof entry === 'string') {
            allowedMap.set(entry as T, true);
        } else {
            allowedMap.set(entry.name, entry.allowMultiple ?? true);
        }
    }

    const result = (includeRest ? { rest: [] } : {}) as ExtractSubcomponentsResult<T, IncludeRest>;
    for (const name of allowedMap.keys()) {
        (result as any)[name] = [];
    }

    Children.forEach(children, child => {
        if (!isValidElement(child)) {
            if (includeRest) (result as any).rest.push(child);
            return;
        }

        const displayName = (child.type as FC)?.displayName as T | undefined;
        if (!displayName) {
            if (includeRest) (result as any).rest.push(child);
            return;
        }

        const allowMultiple = allowedMap.get(displayName);
        if (allowMultiple !== undefined) {
            if (allowMultiple) {
                (result as any)[displayName].push(child);
            } else {
                (result as any)[displayName] = [child];
            }
        } else if (includeRest) {
            (result as any).rest.push(child);
        }
    });

    return result;
}
