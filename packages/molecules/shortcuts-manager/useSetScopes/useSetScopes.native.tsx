import { useCallback } from 'react';

import type { Scope } from '../types';

const useSetScopes = () => {
    return useCallback((_newScopes: Scope[] | ((currentScopes: Scope[]) => Scope[])) => {}, []);
};

export default useSetScopes;
