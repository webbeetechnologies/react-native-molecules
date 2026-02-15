import type { ReactElement, ReactNode, RefObject } from 'react';
import type {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    PressableProps,
    StyleProp,
    TextInput as NativeTextInput,
    TextProps,
    TextStyle,
    ViewStyle,
} from 'react-native';

import type { IconProps } from '../Icon';
import type { Props as TextInputProps } from './TextInput';

export type TextInputLabelProp = string | ReactElement;

// States for compound component context
export type TextInputStates =
    | 'disabled'
    | 'focused'
    | 'hovered'
    | 'hoveredAndFocused'
    | 'errorFocusedAndHovered'
    | 'error'
    | 'errorFocused'
    | 'errorHovered'
    | 'errorDisabled'
    | 'default';

// Context type for compound components
export type TextInputContextType = {
    // Variants
    variant: TextInputVariant;
    size: TextInputSize;
    state: TextInputStates;

    // State flags
    disabled: boolean;
    error: boolean;
    focused: boolean;
    hovered: boolean;
    hasValue: boolean;
    hasLabel: boolean;
    required: boolean;
    multiline: boolean;

    // Layout
    labelLayout: { measured: boolean; width: number; height: number };
    leftElementLayout: { measured: boolean; width: number; height: number };
    onLayoutLabel: (e: LayoutChangeEvent) => void;
    onLayoutLeftElement: (e: LayoutChangeEvent) => void;

    // Refs and handlers
    forceFocus: () => void;
};

// Compound component props
export type TextInputLabelCompoundProps = TextProps & {
    children: TextInputLabelProp;
    floatingStyle?: StyleProp<TextStyle>;
    maxFontSizeMultiplier?: number;
};

export type TextInputElementCompoundProps = Omit<PressableProps, 'onPress'> & {
    onPress?: null | ((event: GestureResponderEvent, forceFocus: () => void) => void) | undefined;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    onLayout?: (e: LayoutChangeEvent) => void;
};

export type TextInputIconCompoundProps = Omit<IconProps, 'color'> & {
    color?: string;
};

export type TextInputSupportingTextCompoundProps = {
    children: string;
    style?: StyleProp<TextStyle>;
};

export type TextInputOutlineCompoundProps = {
    style?: StyleProp<ViewStyle>;
};

export type TextInputSize = 'lg' | 'md' | 'sm';

export type TextInputVariant = 'flat' | 'outlined' | 'plain';

export type RenderProps = Omit<TextInputProps, 'ref'> & {
    ref: RefObject<NativeTextInput | null>;
    size?: TextInputSize;
    numberOfLines?: number;
    adjustsFontSizeToFit?: boolean;
    testID?: string;
};

export type State = {
    labelAnimation: Animated.Value;
    errorAnimation: Animated.Value;
    focused: boolean;
    placeholder?: string;
    value?: string;
    labelLayout: { measured: boolean; width: number; height: number };
};

export type InputBaseProps = {
    parentState: State;
    innerRef: RefObject<NativeTextInput | null>;
    onFocus?: (args: any) => void;
    onBlur?: (args: any) => void;
    forceFocus: () => void;
    onChangeText?: (value: string) => void;
    onLayoutAnimatedText: (args: any) => void;
    componentStyles: Record<string, any>;
} & Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'selectionColor' | 'containerStyle'>;

export type InputLabelProps = {
    baseLabelTranslateX: number;
    wiggleOffsetX: number;
    labelScale: number;
    floatingLabelVerticalOffset?: number;
    paddingOffset?: { paddingLeft: number; paddingRight: number } | null;
    labelTranslationXOffset?: number;
    label?: TextInputLabelProp | null;
    error?: boolean | null;
    onLayoutAnimatedText: (args: any) => void;
    maxFontSizeMultiplier?: number | undefined | null;
    required?: boolean;
    testID?: string;
    style?: StyleProp<TextStyle>;
    floatingStyle?: StyleProp<TextStyle>;
    hasValue: boolean;
    labelLayout: { measured: boolean; width: number; height: number };
    labelAnimation: Animated.Value;
    errorAnimation: Animated.Value;
    focused: boolean;
};

export type LabelBackgroundProps = {
    labelProps: InputLabelProps;
    labelStyle: any;
    parentState: State;
    maxFontSizeMultiplier?: number | undefined | null;
};
