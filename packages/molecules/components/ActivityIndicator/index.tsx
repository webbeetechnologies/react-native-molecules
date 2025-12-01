import { getRegisteredComponentWithFallback } from '../../core';
import ActivityIndicatorDefault from './ActivityIndicator';

export const ActivityIndicator = getRegisteredComponentWithFallback(
    'ActivityIndicator',
    ActivityIndicatorDefault,
);

export {
    type Props as ActivityIndicatorProps,
    activityIndicatorStyles,
    activityIndicatorStylesDefault,
} from './ActivityIndicator';
