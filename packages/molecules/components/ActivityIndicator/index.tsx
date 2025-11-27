import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import ActivityIndicatorDefault from './ActivityIndicator';

registerMoleculesComponents({
    ActivityIndicator: ActivityIndicatorDefault,
});

export const ActivityIndicator = getRegisteredComponentWithFallback(
    'ActivityIndicator',
    ActivityIndicatorDefault,
);

export {
    type Props as ActivityIndicatorProps,
    activityIndicatorStyles,
    activityIndicatorStylesDefault,
} from './ActivityIndicator';
