import { getRegisteredComponentWithFallback } from '../../core';
import { DrawerCollapsible, DrawerCollapsibleItem } from './Collapsible';
import DrawerComponent from './Drawer';
import DrawerContent from './DrawerContent';
import DrawerFooter from './DrawerFooter';
import DrawerHeader from './DrawerHeader';
import DrawerItem from './DrawerItem';
import DrawerItemGroup from './DrawerItemGroup';

const DrawerDefault = Object.assign(DrawerComponent, {
    Item: DrawerItem,
    ItemGroup: DrawerItemGroup,
    Header: DrawerHeader,
    Content: DrawerContent,
    Footer: DrawerFooter,
    Collapsible: DrawerCollapsible,
    CollapsibleItem: DrawerCollapsibleItem,
});

export const Drawer = getRegisteredComponentWithFallback('Drawer', DrawerDefault);

export {
    type DrawerCollapsibleItemContentProps,
    drawerCollapsibleItemContentStyles,
    type DrawerCollapsibleItemHeaderElementProps,
    type DrawerCollapsibleItemHeaderProps,
    drawerCollapsibleItemHeaderStyles,
    type DrawerCollapsibleItemProps,
    drawerCollapsibleItemStyles,
    type DrawerCollapsibleProps,
    drawerCollapsibleStyles,
} from './Collapsible';
export { type Props as DrawerProps, drawerStyles } from './Drawer';
export { type Props as DrawerContentProps, drawerContentStyles } from './DrawerContent';
export { type Props as DrawerFooterProps, drawerFooterStyles } from './DrawerFooter';
export { type Props as DrawerHeaderProps, drawerHeaderStyles } from './DrawerHeader';
export {
    type DrawerItemElement,
    type DrawerItemElementProps,
    type Props as DrawerItemProps,
    drawerItemStyles,
} from './DrawerItem';
export { type Props as DrawerItemGroupProps, drawerItemGroupStyles } from './DrawerItemGroup';
