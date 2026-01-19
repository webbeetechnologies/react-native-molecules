import { getRegisteredComponentWithFallback } from '../../core';
import LoadingIndicatorDefault from './LoadingIndicator';

export const LoadingIndicator = getRegisteredComponentWithFallback(
    'LoadingIndicator',
    LoadingIndicatorDefault,
);

export {
    type LoadingIndicatorProps,
    loadingIndicatorStyles,
    loadingIndicatorStylesDefault,
} from './utils';
