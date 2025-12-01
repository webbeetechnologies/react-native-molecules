import { getRegisteredComponentWithFallback } from '../../core';
import NavigationRailComponent from './NavigationRail';
import NavigationRailContent from './NavigationRailContent';
import NavigationRailFooter from './NavigationRailFooter';
import NavigationRailHeader from './NavigationRailHeader';
import NavigationRailItem from './NavigationRailItem';

export const NavigationRailDefault = Object.assign(NavigationRailComponent, {
    Item: NavigationRailItem,
    Header: NavigationRailHeader,
    Content: NavigationRailContent,
    Footer: NavigationRailFooter,
});

export const NavigationRail = getRegisteredComponentWithFallback(
    'NavigationRail',
    NavigationRailDefault,
);

export type { Props as NavigationRailProps } from './NavigationRail';
export type { Props as NavigationRailContentProps } from './NavigationRailContent';
export type { Props as NavigationRailFooterProps } from './NavigationRailFooter';
export type { Props as NavigationRailHeaderProps } from './NavigationRailHeader';
export type { Props as NavigationRailItemProps } from './NavigationRailItem';
export {
    navigationRailContentStyles,
    navigationRailFooterStyles,
    navigationRailHeaderStyles,
    navigationRailItemStyles,
    navigationRailStyles,
} from './utils';
