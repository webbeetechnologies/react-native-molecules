import { getRegisteredComponentWithFallback } from '../../core';
import MenuComponent from './Menu';
import MenuDivider from './MenuDivider';
import MenuItem from './MenuItem';

export const MenuDefault = Object.assign(MenuComponent, {
    Item: MenuItem,
    Divider: MenuDivider,
});

export const Menu = getRegisteredComponentWithFallback('Menu', MenuDefault);

export type { Props as MenuProps } from './Menu';
export type { Props as MenuItemProps } from './MenuItem';
export { menuItemStyles, menuStyles } from './utils';
