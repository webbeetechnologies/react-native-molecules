import { useCallback } from 'react';

import useLatest from './useLatest';

type AnyFn = (...args: any[]) => any;

export const useSafeCallback = <T extends AnyFn>(func: T) => {
    const latestFunc = useLatest(func);
    if (typeof func !== 'function') {
        throw new Error('useSafeCallback accepts exactly one argument of type function');
    }

    return useCallback(
        (...args: Parameters<T>): ReturnType<T> => {
            // there is a posibility that the latest function has been called AFTER unmount.
            return latestFunc.current(...args);
        },
        [latestFunc],
    );
};

export default useSafeCallback;
