import { getRegisteredComponentWithFallback } from '../../core';
import { List } from '../List';
import MenuComponent, { MenuItem, MenuRoot, MenuTrigger } from './Menu';
import { MenuRootContext } from './utils';

export const MenuDefault = Object.assign(MenuComponent, {
    Root: MenuRoot,
    Trigger: MenuTrigger,
    Item: MenuItem,
    Content: List.Content,
    Group: List.Group,
    SearchInput: List.SearchInput,
    RootContext: MenuRootContext,
});

export const Menu = getRegisteredComponentWithFallback('Menu', MenuDefault);

export type { MenuItemProps, Props as MenuProps, MenuRootProps, MenuTriggerProps } from './Menu';
export { MenuRootContext, menuStyles } from './utils';
