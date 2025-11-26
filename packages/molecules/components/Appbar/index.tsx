import type { ComponentType } from 'react';

import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import AppbarActions from './AppbarActions';
import AppbarBase from './AppbarBase';
import AppbarCenterAligned from './AppbarCenterAligned';
import AppbarLarge from './AppbarLarge';
import AppbarLeft from './AppbarLeft';
import AppbarMedium from './AppbarMedium';
import AppbarRight from './AppbarRight';
import AppbarSmall from './AppbarSmall';
import AppbarTitle from './AppbarTitle';
import type { AppbarProps } from './types';

export const AppbarDefault = Object.assign(AppbarBase as ComponentType<AppbarProps>, {
    Small: AppbarSmall,
    CenterAligned: AppbarCenterAligned,
    Medium: AppbarMedium,
    Large: AppbarLarge,

    Left: AppbarLeft,
    Right: AppbarRight,
    Title: AppbarTitle,
    Actions: AppbarActions,
});
registerMoleculesComponents({
    Appbar: AppbarDefault,
});

export const Appbar = getRegisteredComponentWithFallback('Appbar', AppbarDefault);

export type { Props as AppbarActionsProps } from './AppbarActions';
export type { Props as AppbarLeftProps } from './AppbarLeft';
export type { Props as AppbarRightProps } from './AppbarRight';
export type { Props as AppbarTitleProps } from './AppbarTitle';
export type { AppbarProps } from './types';
export {
    appbarBaseStyles,
    appbarCenterAlignedStyles,
    appbarLargeStyles,
    appbarLeft,
    appbarMediumStyles,
    appbarRight,
    appbarSmallStyles,
    appbarTitle,
} from './utils';
