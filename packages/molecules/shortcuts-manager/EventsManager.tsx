import { memo, useCallback, useEffect } from 'react';

import {
    useShortcutsManagerContextValueSelector,
    useShortcutsManagerStoreRef,
} from './ShortcutsManager/utils';
import type { ShortcutEventDetail } from './types';
import { calculateShortcutEventName, getPressedModifierKeys, normalizeKeys } from './utils';

const defaultMatcher = (_e: KeyboardEvent, key: string | string[], details: ShortcutEventDetail) =>
    normalizeKeys(key) === details.normalizedKey;

const EventsManager = () => {
    const { store, set: setShortcutsManagerStore } = useShortcutsManagerStoreRef();

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            const modifierKeys = getPressedModifierKeys(e);
            const normalizedKeys = normalizeKeys([e.key].concat(modifierKeys));

            setShortcutsManagerStore(prev => ({
                pressedKeys: [...prev.pressedKeys, e.key],
            }));

            let shouldPrevent = false;

            Object.values(store.current.shortcuts).forEach(shortcut => {
                if (shortcut.scope) {
                    const shortcutScope = store.current.scopes[shortcut.scope];

                    if (!shortcutScope) return;

                    if (
                        !(
                            shortcutScope?.node === document.activeElement ||
                            shortcutScope?.node?.contains(document.activeElement)
                        )
                    )
                        return;
                }

                const matcher = shortcut.matcher || defaultMatcher;

                const foundMatchedKeys = shortcut.keys.find(keyGroup =>
                    matcher(e, keyGroup, {
                        pressedKeys: [e.key].concat(modifierKeys),
                        normalizedKey: normalizedKeys,
                        modifiers: modifierKeys,
                        key: e.key,
                    }),
                );

                if (!foundMatchedKeys) return;

                shouldPrevent = !!shortcut.preventDefault;

                const event = new CustomEvent<ShortcutEventDetail>(
                    calculateShortcutEventName(shortcut.name),
                    {
                        detail: {
                            pressedKeys: [e.key].concat(modifierKeys),
                            normalizedKey: normalizedKeys,
                            modifiers: modifierKeys,
                            key: e.key,
                        },
                    },
                );

                document.dispatchEvent(event);
            });

            if (shouldPrevent) {
                e.preventDefault();
            }
        },
        [setShortcutsManagerStore, store],
    );

    const onKeyUp = useCallback(
        (e: KeyboardEvent) => {
            e.preventDefault();

            setShortcutsManagerStore(prev => ({
                pressedKeys: prev.pressedKeys?.filter(key => key !== e.key),
            }));
        },
        [setShortcutsManagerStore],
    );

    const onBlur = useCallback(() => {
        setShortcutsManagerStore(() => ({
            pressedKeys: [],
        }));
    }, [setShortcutsManagerStore]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('blur', onBlur);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            document.removeEventListener('blur', onBlur);
        };
    }, [onBlur, onKeyDown, onKeyUp]);

    return null;
};

const EventManagerContainer = memo(() => {
    const { isDisabled } = useShortcutsManagerContextValueSelector(state => ({
        isDisabled: !!state.disabled,
    }));

    if (isDisabled) return null;

    return <EventsManager />;
});

export default memo(EventManagerContainer);
