import DrawerCollapsibleItemComponent from './DrawerCollapsibleItem';
import DrawerCollapsibleItemContent from './DrawerCollapsibleItemContent';
import DrawerCollapsibleItemHeader from './DrawerCollapsibleItemHeader';

export const DrawerCollapsibleItem = Object.assign(DrawerCollapsibleItemComponent, {
    Header: DrawerCollapsibleItemHeader,
    Content: DrawerCollapsibleItemContent,
});

export type { AccordionHeaderElementProps as DrawerCollapsibleItemHeaderElementProps } from '../../Accordion';
export {
    default as DrawerCollapsible,
    type Props as DrawerCollapsibleProps,
} from './DrawerCollapsible';
export type { Props as DrawerCollapsibleItemProps } from './DrawerCollapsibleItem';
export type { Props as DrawerCollapsibleItemContentProps } from './DrawerCollapsibleItemContent';
export type { Props as DrawerCollapsibleItemHeaderProps } from './DrawerCollapsibleItemHeader';
export {
    drawerCollapsibleItemContentStyles,
    drawerCollapsibleItemHeaderStyles,
    drawerCollapsibleItemStyles,
    drawerCollapsibleStyles,
} from './utils';
