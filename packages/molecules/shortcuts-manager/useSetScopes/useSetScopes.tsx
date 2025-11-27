import { useCallback } from 'react';

import { keyBy } from '../../utils/lodash';
import { useShortcutsManagerStoreRef } from '../ShortcutsManager/utils';
import type { Scope } from '../types';

const useSetScopes = () => {
    const { set: setStore } = useShortcutsManagerStoreRef();

    return useCallback(
        (newScopes: Scope[] | ((currentScopes: Scope[]) => Scope[])) => {
            setStore(prev => ({
                scopes: keyBy(
                    typeof newScopes === 'function'
                        ? newScopes(Object.values(prev.scopes))
                        : newScopes,
                    'name',
                ),
            }));
        },
        [setStore],
    );
};

export default useSetScopes;
