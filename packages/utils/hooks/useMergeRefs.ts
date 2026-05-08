import type { LegacyRef, MutableRefObject } from 'react';

import useSafeCallback from './useSafeCallback';

type RefType<T> = MutableRefObject<T | null> | LegacyRef<T> | undefined | null;

export function mergeRefs<T>(...refs: Array<RefType<T> | RefType<T>[]>) {
    return (value: T | null) => {
        refs.flat().forEach(ref => {
            if (!ref) return;
            if (typeof ref === 'function') {
                ref(value);
            } else {
                (ref as MutableRefObject<T | null>).current = value;
            }
        });
    };
}

export const useMergedRefs = <T>(...refs: Array<RefType<T> | RefType<T>[]>) => {
    return useSafeCallback((value: T | null) => {
        mergeRefs<T>(...refs)(value);
    });
};

export default useMergedRefs;
