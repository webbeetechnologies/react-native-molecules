import { useEffect, useMemo } from 'react';

import useLatest from './useLatest';

const map = new Map();

export const whatHasUpdatedFactory = <T extends Record<string, unknown>>(
    name: string,
    prevObject: T,
    { debug = false, useCached = false } = {},
) => {
    const getPrev = () => {
        if (!map.has(name)) map.set(name, prevObject);
        return useCached ? map.get(name) : prevObject;
    };

    const setPrev = (value: T) => {
        if (useCached) map.set(name, value);
        else prevObject = value;
    };

    return (nextObject: T) => {
        const old = getPrev();
        const changes = Object.keys({ ...nextObject, ...old }).reduce((all, key) => {
            const newValue = nextObject?.[key];
            const oldValue = old[key];
            if (oldValue === newValue) return all;
            return { ...all, [key]: { newValue, oldValue } };
        }, {});

        setPrev(nextObject);

        if (!debug && !Object.keys(changes).length) return;
        // eslint-disable-next-line no-console
        console.log('🚨🕵️ UPDATED', name, changes);
    };
};

export const useWhatHasUpdated = (name: string, props: Record<string, any>) => {
    const argRef = useLatest({ name, props });
    const checkFunc = useMemo(
        () => whatHasUpdatedFactory(argRef.current.name, argRef.current.props),
        [argRef],
    );
    useEffect(() => {
        checkFunc(props);
    });
};
