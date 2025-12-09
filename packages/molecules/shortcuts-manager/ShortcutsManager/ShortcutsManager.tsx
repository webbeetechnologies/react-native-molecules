import { memo, useContext, useEffect, useMemo, useRef } from 'react';

import { keyBy } from '../../utils/lodash';
import EventsManager from '../EventsManager';
import type { Shortcut } from '../types';
import {
    ShortcutsManagerContext,
    ShortcutsManagerContextProvider,
    type ShortcutsManagerContextType,
    type ShortcutsManagerProps,
} from './utils';

const defaultScopes: ShortcutsManagerProps['scopes'] = [];
const defaultShortcuts: Shortcut[] = [];

const _ShortcutsManager = ({ shortcuts, scopes, children }: ShortcutsManagerProps) => {
    const shortcutsRef = useRef<Shortcut[]>(shortcuts || defaultShortcuts);
    const scopesRef = useRef(scopes || defaultScopes);
    const parentContextRef = useContext(ShortcutsManagerContext);

    const contextValue = useMemo(() => {
        const currentValue = {
            shortcuts: keyBy(shortcutsRef.current, 'name'),
            scopes: keyBy(scopesRef.current, 'name'),
        } as ShortcutsManagerContextType;

        if (!parentContextRef) return currentValue;

        return {
            shortcuts: {
                ...currentValue.shortcuts,
                ...parentContextRef.store.current.shortcuts,
            },
            scopes: {
                ...currentValue.scopes,
                ...parentContextRef.store.current.scopes,
            },
        } as ShortcutsManagerContextType;
    }, [parentContextRef]);

    // disable the parent event listener, we only need 1 listener
    useEffect(() => {
        if (!parentContextRef) return;

        parentContextRef.set(() => ({ disabled: true }));

        // if unmounted re-enable parent event listener
        return () => {
            parentContextRef.set(() => ({ disabled: false }));
        };
    }, [parentContextRef]);

    return (
        <ShortcutsManagerContextProvider value={contextValue}>
            <EventsManager />
            {children}
        </ShortcutsManagerContextProvider>
    );
};

export default memo(_ShortcutsManager);
