import { useCallback } from 'react';

import { mergeRefs } from '../utils';
import useLatest from './useLatest';

export const useMergedRefs: typeof mergeRefs = refs => {
    const latestRefs = useLatest(refs);
    return useCallback(
        value => {
            mergeRefs(latestRefs.current)(value);
        },
        [latestRefs],
    );
};
