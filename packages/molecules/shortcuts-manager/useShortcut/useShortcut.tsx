import { useCallback, useEffect } from 'react';

import useLatest from '../../hooks/useLatest';
import { useShortcutsManagerStoreRef } from '../ShortcutsManager';
import type { ShortcutEventDetail } from '../types';
import { calculateShortcutEventName } from '../utils';
import type { ShortcutCallbackArgs } from './types';

const useShortcut = (
    name: string,
    callback: (args: ShortcutCallbackArgs) => void,
    disabled: boolean = false,
    capture: boolean = false,
) => {
    const { store } = useShortcutsManagerStoreRef();

    const nameRef = useLatest(name);
    const callbackRef = useLatest(callback);

    const onCallback = useCallback(
        (e: CustomEvent<ShortcutEventDetail>) => {
            const shortcut = store.current.shortcuts[nameRef.current];

            if (!shortcut) {
                throw new Error(`Shortcut with name: ${nameRef.current} does not exist`);
            }

            const scope = store.current.scopes[shortcut.scope || ''];

            if (shortcut.scope && !scope) return;

            // if there is node, we check if one of the elements instead it is focused
            if (
                scope?.node &&
                !(
                    scope.node === document.activeElement ||
                    scope.node.contains(document.activeElement)
                )
            )
                return;

            callbackRef.current({ ...e.detail, shortcut: shortcut, event: e });
        },
        [callbackRef, nameRef, store],
    );

    useEffect(() => {
        if (disabled) return;

        const eventName = calculateShortcutEventName(nameRef.current);

        document.addEventListener(eventName, onCallback as (e: Event) => void, capture);

        return () => {
            document.removeEventListener(eventName, onCallback as (e: Event) => void, capture);
        };
        // eslint-disable-next-line
    }, [onCallback, nameRef, disabled]);
};

export default useShortcut;
