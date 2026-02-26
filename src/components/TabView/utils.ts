import type { ViewStyle } from 'react-native';
import type { ComponentStylePropWithVariants } from '../../types';

type CustomProps = {};

export const tabViewStyles: ComponentStylePropWithVariants<ViewStyle, '', CustomProps> = {};

type TabsItemCustomProps = {};

type States = 'hovered' | 'active' | 'activeAndHovered' | 'disabled';

export const tabViewItemStyles: ComponentStylePropWithVariants<
    ViewStyle,
    States,
    TabsItemCustomProps
> = {};
