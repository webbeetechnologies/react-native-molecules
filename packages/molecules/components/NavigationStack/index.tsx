import { getRegisteredComponentWithFallback } from '../../core';
import NavigationStackComponent from './NavigationStack';
import NavigationStackItem from './NavigationStackItem';

export const NavigationStackDefault = Object.assign(NavigationStackComponent, {
    Item: NavigationStackItem,
});

export const NavigationStack = getRegisteredComponentWithFallback(
    'NavigationStack',
    NavigationStackDefault,
);

export type { NavigationStackHandle, Props as NavigationStackProps } from './NavigationStack';
export type { Props as NavigationStackItemProps } from './NavigationStackItem';
export { navigationStackItemStyles, useNavigation, useRoute } from './utils';
