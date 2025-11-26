import type { ReactElement, RefObject } from 'react';
import type {
    Animated,
    BlurEvent,
    ColorValue,
    FocusEvent,
    StyleProp,
    TextInput as NativeTextInput,
    TextStyle,
} from 'react-native';

import type { Props as TextInputProps } from './TextInput';

export type TextInputLabelProp = string | ReactElement;

export type TextInputSize = 'lg' | 'md' | 'sm';

export type TextInputVariant = 'flat' | 'outlined' | 'plain';

export type RenderProps = {
    ref: RefObject<NativeTextInput | null>;
    onChangeText?: (a: string) => void;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    editable?: boolean;
    selectionColor?: string;
    onFocus?: (args: FocusEvent) => void;
    onBlur?: (args: BlurEvent) => void;
    underlineColorAndroid?: string;
    style: any;
    multiline?: boolean;
    size?: TextInputSize;
    numberOfLines?: number;
    value?: string;
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
} & Omit<
    TextInputProps,
    | 'style'
    | 'activeOutlineColor'
    | 'activeUnderlineColor'
    | 'underlineColor'
    | 'outlineColor'
    | 'placeholderTextColor'
    | 'selectionColor'
    | 'containerStyle'
>;

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
