import type { StyleProp, TextStyle } from 'react-native';

export type ButtonVariant = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonStates = 'hovered' | 'disabled' | 'default';

export type ButtonShape = 'rounded' | 'square';

export type ButtonContextType = {
    variant: ButtonVariant;
    size: ButtonSize;
    state: ButtonStates;
    disabled: boolean;
    labelColor?: string;
    iconSize?: number;
    textRelatedStyle?: StyleProp<TextStyle>;
};
