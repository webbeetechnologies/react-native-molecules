import { getRegisteredComponentWithFallback } from '../../core';
import LoadingIndicatorDefault from './LoadingIndicator';

export const LoadingIndicator = getRegisteredComponentWithFallback(
    'LoadingIndicator',
    LoadingIndicatorDefault,
);

export {
    type Props as LoadingIndicatorProps,
    loadingIndicatorStyles,
    loadingIndicatorStylesDefault,
} from './utils';
