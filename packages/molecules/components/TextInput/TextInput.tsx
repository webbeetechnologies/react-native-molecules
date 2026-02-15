import React, {
    memo,
    type PropsWithoutRef,
    type ReactNode,
    type Ref,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import type {
    BlurEvent,
    ColorValue,
    FocusEvent,
    GestureResponderEvent,
    LayoutChangeEvent,
    StyleProp,
    TextInputProps as NativeTextInputProps,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {
    Animated,
    I18nManager,
    Platform,
    Pressable,
    TextInput as NativeTextInput,
    View,
} from 'react-native';

import { useActionState } from '../../hooks/useActionState';
import useControlledValue from '../../hooks/useControlledValue';
import useLatest from '../../hooks/useLatest';
import useSubcomponents from '../../hooks/useSubcomponents';
import { createSyntheticEvent, resolveStateVariant } from '../../utils';
import { HelperText } from '../HelperText';
import { Icon } from '../Icon';
import { StateLayer } from '../StateLayer';
import InputLabel from './InputLabel';
import type {
    RenderProps,
    TextInputElementCompoundProps,
    TextInputIconCompoundProps,
    TextInputLabelCompoundProps,
    TextInputOutlineCompoundProps,
    TextInputSize,
    TextInputSupportingTextCompoundProps,
    TextInputVariant,
} from './types';
import {
    getInputMinHeight,
    styles,
    TextInputContext,
    textInputIconStyles,
    textInputLabelStyles,
    textInputLeftStyles,
    textInputOutlineStyles,
    textInputRightStyles,
    textInputSupportingTextStyles,
} from './utils';

const BLUR_ANIMATION_DURATION = 180;
const FOCUS_ANIMATION_DURATION = 150;

export type ElementProps = {
    color: string;
    forceFocus: () => void;
    focused: boolean;
};

export type Props = Omit<NativeTextInputProps, 'style' | 'ref'> & {
    ref?: Ref<TextInputHandles | null>;
    /**
     * Variant of the TextInput.
     * - `flat` - flat input with an underline.
     * - `outlined` - input with an outline.
     * - `plain` - plain input without any decoration.
     */
    variant?: TextInputVariant;
    /**
     * Size of the TextInput.
     */
    size?: TextInputSize;
    /**
     * If true, user won't be able to interact with the component.
     */
    disabled?: boolean;
    /**
     * Whether to style the TextInput with error style.
     */
    error?: boolean;
    /**
     * Whether the input can have multiple lines.
     */
    multiline?: boolean;
    /**
     * To display the required indicator in the Label
     */
    required?: boolean;
    /**
     * Value of the text input (for controlled usage).
     */
    value?: string;
    /**
     * Default value for uncontrolled usage.
     */
    defaultValue?: string;
    /**
     * Callback that is called when the text input's text changes.
     */
    onChangeText?: (text: string) => void;
    /**
     * Callback when input is focused.
     */
    onFocus?: (args: FocusEvent) => void;
    /**
     * Callback when input loses focus.
     */
    onBlur?: (args: BlurEvent) => void;
    /**
     * Selection color of the input
     */
    selectionColor?: ColorValue;

    /**
     * Placeholder text color.
     */
    placeholderTextColor?: ColorValue;

    /**
     * If false, text is not editable.
     */
    editable?: boolean;
    /**
     * Style of the container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Props for the container that is directly inside the context container which is horizontal layout
     */
    containerProps?: ViewProps;
    /**
     * Style of the Input Container
     */
    inputWrapperProps?: ViewProps;
    /**
     * props for the stateLayer (flat variant)
     */
    stateLayerProps?: PropsWithoutRef<ViewProps>;
    /**
     * testID to be used on tests.
     */
    testID?: string;
    /**
     * Children for composable API. Use TextInput.Label, TextInput.Left, TextInput.Right, etc.
     */
    children?: ReactNode;
    /**
     * Render custom input component.
     */
    render?: (props: RenderProps) => ReactNode;
    inputStyle?: NativeTextInputProps['style'];
    placeholder?: string;
};

export type TextInputHandles = Pick<
    NativeTextInput,
    'focus' | 'clear' | 'blur' | 'isFocused' | 'setNativeProps'
>;

const animationScale = 1;
const minimizedLabelFontSize = 12;
const maximizedLabelFontSize = 16;
const labelWiggleXOffset = 4;

const DefaultComponent = (props: RenderProps) => <NativeTextInput {...props} />;

const TextInput = ({
    ref,
    variant = 'outlined',
    size = 'sm',
    disabled = false,
    error: errorProp = false,
    multiline = false,
    editable = true,
    required = false,

    selectionColor,
    placeholderTextColor,
    containerProps,
    style,
    inputWrapperProps,
    stateLayerProps,
    onBlur,
    onFocus,
    testID,
    value: valueProp,
    defaultValue,
    onChangeText,
    render,
    placeholder,
    children,
    inputStyle,
    ...rest
}: Props) => {
    const { hovered, actionsRef } = useActionState({ actionsToListen: ['hover'] });

    const {
        TextInput_Label,
        TextInput_Left,
        TextInput_Right,
        TextInput_SupportingText,
        TextInput_Outline,
        rest: restChildren,
    } = useSubcomponents({
        children,
        allowedChildren: [
            { name: 'TextInput_Label', allowMultiple: false },
            { name: 'TextInput_Left', allowMultiple: false },
            { name: 'TextInput_Right', allowMultiple: false },
            { name: 'TextInput_SupportingText', allowMultiple: false },
            { name: 'TextInput_Outline', allowMultiple: false },
        ] as const,
        includeRest: true,
    });

    const hasLabel = TextInput_Label.length > 0;

    const [focused, setFocused] = useState<boolean>(false);
    // Use value from props instead of local state when input is controlled
    const [value, onChangeValue] = useControlledValue({
        value: valueProp,
        defaultValue: defaultValue,
        onChange: onChangeText,
        disabled: !editable || disabled,
    });

    const onBlurRef = useLatest(onBlur);

    const state = resolveStateVariant({
        errorDisabled: errorProp && disabled,
        disabled,
        errorFocusedAndHovered: errorProp && hovered && focused,
        errorFocused: errorProp && focused,
        errorHovered: errorProp && hovered,
        hoveredAndFocused: hovered && focused,
        hovered,
        focused: focused,
        error: !!errorProp,
    }) as any;

    styles.useVariants({
        variant: variant as any,
        state,
        size,
    });

    const [labelLayout, setLabelLayout] = useState<{
        measured: boolean;
        width: number;
        height: number;
    }>({
        measured: false,
        width: 0,
        height: 0,
    });

    const [leftElementLayout, setElementLayout] = useState<{
        measured: boolean;
        width: number;
        height: number;
    }>({
        measured: false,
        width: 0,
        height: 0,
    });

    const inputRefLocal = useRef<NativeTextInput>(null);

    useImperativeHandle(ref, () => inputRefLocal.current!);

    const handleFocus = useCallback(
        (args: FocusEvent) => {
            if (disabled || !editable) {
                return;
            }

            setFocused(true);

            onFocus?.(args);
        },
        [disabled, editable, onFocus],
    );

    const handleBlur = useCallback(
        (args: BlurEvent) => {
            if (!editable) {
                return;
            }

            setFocused(false);
            onBlur?.(args);
        },
        [editable, onBlur],
    );

    const handleLayoutAnimatedText = useCallback((e: LayoutChangeEvent) => {
        setLabelLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            measured: true,
        });
    }, []);

    const handleLayoutLeftElement = useCallback((e: LayoutChangeEvent) => {
        setElementLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            measured: true,
        });
    }, []);

    const forceFocus = useCallback(() => inputRefLocal.current?.focus(), []);

    const inputMinHeight = getInputMinHeight(variant, size);

    // Workaround for React bug where onBlur doesn't fire when a focused input unmounts
    // Issue: https://github.com/facebook/react/issues/25194
    // Only needed for React 18+ on web (issue still exists in React 19)
    useEffect(() => {
        const is_version_18_or_higher =
            typeof React.version === 'string' ? +React.version.split('.')[0] >= 18 : false;

        const _onBlurRef = onBlurRef;
        const input = inputRefLocal.current;

        return () => {
            if (!is_version_18_or_higher || !focused || Platform.OS !== 'web') {
                return;
            }

            // Manually fire blur event on unmount if input was focused
            const event = new Event('blur', { bubbles: true });
            Object.defineProperty(event, 'target', {
                writable: false,
                value: input,
            });
            const syntheticEvent = createSyntheticEvent(
                event,
            ) as React.ChangeEvent<HTMLInputElement>;
            _onBlurRef.current?.(syntheticEvent as any);
        };
    }, [onBlurRef, focused]);

    const renderFunc = render || DefaultComponent;
    const showPlaceholder = !hasLabel || focused || !!value;
    const placeholderText = showPlaceholder ? placeholder : undefined;

    const labelHeight = labelLayout.height;
    const finalHeight = +labelHeight;
    const inputHeight = finalHeight < inputMinHeight ? inputMinHeight : finalHeight;

    const computedStyles = useMemo(
        () => ({
            textInputStyle: [
                styles.input,
                !multiline ? { height: inputHeight || labelHeight } : {},
                multiline && variant === 'outlined' && { paddingTop: 12 },
                {
                    textAlignVertical: multiline ? ('top' as const) : ('center' as const),
                    textAlign: I18nManager.isRTL ? ('right' as const) : ('left' as const),
                },
                Platform.OS === 'ios' && !multiline
                    ? { lineHeight: undefined, textAlign: undefined }
                    : {},
                inputStyle,
            ],
            stateLayerStyle: [styles.stateLayer, stateLayerProps?.style],
        }),
        // forcing useMemo to recompute when state, size or variant change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            size,
            state,
            variant,
            multiline,
            inputHeight,
            labelHeight,
            inputStyle,
            stateLayerProps?.style,
        ],
    );
    const hasValue = !!value;

    const contextValue = useMemo(
        () => ({
            variant,
            size,
            state,
            disabled,
            hasValue,
            error: errorProp,
            focused,
            hovered,
            hasLabel,
            required,
            multiline,
            labelLayout,
            leftElementLayout,
            onLayoutLabel: handleLayoutAnimatedText,
            onLayoutLeftElement: handleLayoutLeftElement,
            forceFocus,
        }),
        [
            variant,
            size,
            state,
            disabled,
            errorProp,
            focused,
            hovered,
            hasValue,
            hasLabel,
            required,
            multiline,
            labelLayout,
            leftElementLayout,
            handleLayoutAnimatedText,
            handleLayoutLeftElement,
            forceFocus,
        ],
    );

    const outlineElement = TextInput_Outline.length > 0 ? TextInput_Outline : <TextInputOutline />;

    return (
        <TextInputContext value={contextValue}>
            <View
                ref={actionsRef}
                {...containerProps}
                style={[styles.root, style, containerProps?.style]}>
                {outlineElement}
                {variant === 'flat' && (
                    <StateLayer
                        testID={testID && `${testID}--stateLayer`}
                        {...stateLayerProps}
                        style={computedStyles.stateLayerStyle}
                    />
                )}

                {TextInput_Left}
                <View
                    {...inputWrapperProps}
                    style={[
                        styles.inputWrapper,
                        {
                            minHeight: labelHeight,
                        },
                        inputWrapperProps?.style,
                    ]}>
                    {TextInput_Label}
                    {renderFunc({
                        placeholder: placeholderText,
                        ref: inputRefLocal,
                        placeholderTextColor: placeholderTextColor,
                        selectionColor: selectionColor,
                        editable: !disabled && editable,
                        underlineColorAndroid: 'transparent' as const,
                        multiline,
                        size,
                        onFocus: handleFocus,
                        onBlur: handleBlur,
                        onChangeText: onChangeValue,
                        value: value,
                        ...rest,
                        style: computedStyles.textInputStyle,
                    })}
                </View>
                {TextInput_Right}
            </View>
            {TextInput_SupportingText}
            {restChildren}
        </TextInputContext>
    );
};

export default memo(TextInput);

/**
 * TextInput.Label - Renders the animated floating label
 */
export const TextInputLabel = memo(
    ({
        children,
        style,
        floatingStyle,
        maxFontSizeMultiplier = 15,
    }: TextInputLabelCompoundProps) => {
        const {
            labelLayout,
            leftElementLayout,
            hasValue,
            focused,
            error,
            required,
            onLayoutLabel,
            variant,
            size,
            state,
        } = useContext(TextInputContext);

        textInputLabelStyles.useVariants({
            variant: variant as any,
            state: state as any,
            size,
        });

        const { current: labelAnimation } = useRef<Animated.Value>(
            new Animated.Value(hasValue ? 0 : 1),
        );
        const { current: errorAnimation } = useRef<Animated.Value>(
            new Animated.Value(error ? 1 : 0),
        );

        useEffect(() => {
            if (error) {
                Animated.timing(errorAnimation, {
                    toValue: 1,
                    duration: FOCUS_ANIMATION_DURATION * animationScale,
                    useNativeDriver: true,
                }).start();
                return;
            }

            Animated.timing(errorAnimation, {
                toValue: 0,
                duration: BLUR_ANIMATION_DURATION * animationScale,
                useNativeDriver: true,
            }).start();
        }, [error, errorAnimation]);

        const shouldMinimize = hasValue || focused;

        useEffect(() => {
            if (shouldMinimize) {
                Animated.timing(labelAnimation, {
                    toValue: 0,
                    duration: BLUR_ANIMATION_DURATION * animationScale,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(labelAnimation, {
                    toValue: 1,
                    duration: FOCUS_ANIMATION_DURATION * animationScale,
                    useNativeDriver: true,
                }).start();
            }
        }, [focused, shouldMinimize, labelAnimation]);

        if (variant === 'plain') {
            return null;
        }

        const labelScale = minimizedLabelFontSize / maximizedLabelFontSize;
        const floatingLabelVerticalOffset = variant === 'flat' ? 16 : 0;
        const labelWidth = labelLayout.width;
        const labelHalfWidth = labelWidth / 2;
        const baseLabelTranslateX =
            (I18nManager.isRTL ? 1 : -1) *
            (labelScale - 1 + labelHalfWidth - (labelScale * labelWidth) / 2);
        const resolvedBaseLabelTranslateX =
            variant === 'outlined'
                ? baseLabelTranslateX - leftElementLayout.width
                : baseLabelTranslateX;

        return (
            <InputLabel
                hasValue={hasValue}
                focused={focused}
                labelAnimation={labelAnimation}
                errorAnimation={errorAnimation}
                labelLayout={labelLayout}
                label={children}
                floatingStyle={[textInputLabelStyles.floatingLabel, floatingStyle]}
                floatingLabelVerticalOffset={floatingLabelVerticalOffset}
                required={required}
                onLayoutAnimatedText={onLayoutLabel}
                error={error}
                baseLabelTranslateX={resolvedBaseLabelTranslateX}
                labelScale={labelScale}
                wiggleOffsetX={labelWiggleXOffset}
                maxFontSizeMultiplier={maxFontSizeMultiplier}
                style={[textInputLabelStyles.labelText, style]}
            />
        );
    },
);

TextInputLabel.displayName = 'TextInput_Label';

/**
 * TextInput.Left - Container for left-positioned elements
 */
export const TextInputLeft = memo(
    ({
        children,
        style,
        onLayout,
        onPress: onPressProp,
        ...rest
    }: TextInputElementCompoundProps) => {
        const { forceFocus, onLayoutLeftElement, state } = useContext(TextInputContext);

        textInputLeftStyles.useVariants({
            state: state as any,
        });

        const handleLayout = useCallback(
            (e: LayoutChangeEvent) => {
                onLayoutLeftElement(e);
                onLayout?.(e);
            },
            [onLayoutLeftElement, onLayout],
        );

        const onPress = useCallback(
            (e: GestureResponderEvent) => {
                if (onPressProp) {
                    onPressProp(e, forceFocus);

                    return;
                }

                forceFocus();
            },
            [forceFocus, onPressProp],
        );

        return (
            <Pressable
                onPress={onPress}
                style={[textInputLeftStyles.leftElement, style]}
                onLayout={handleLayout}
                accessibilityRole="none"
                {...rest}>
                {children}
            </Pressable>
        );
    },
);

TextInputLeft.displayName = 'TextInput_Left';

/**
 * TextInput.Right - Container for right-positioned elements
 */
export const TextInputRight = memo(
    ({ children, style, onPress: onPressProp, ...rest }: TextInputElementCompoundProps) => {
        const { forceFocus, state } = useContext(TextInputContext);

        textInputRightStyles.useVariants({
            state: state as any,
        });

        const onPress = useCallback(
            (e: GestureResponderEvent) => {
                if (onPressProp) {
                    onPressProp(e, forceFocus);

                    return;
                }

                forceFocus();
            },
            [forceFocus, onPressProp],
        );

        return (
            <Pressable
                onPress={onPress}
                style={[textInputRightStyles.rightElement, style]}
                accessibilityRole="none"
                {...rest}>
                {children}
            </Pressable>
        );
    },
);

TextInputRight.displayName = 'TextInput_Right';

/**
 * TextInput.Icon - Convenience component for icons within TextInput
 */
export const TextInputIcon = memo(
    ({ size: sizeProp, color: colorProp, style, ...rest }: TextInputIconCompoundProps) => {
        const { state } = useContext(TextInputContext);

        textInputIconStyles.useVariants({
            // @ts-ignore - state includes 'default' which is valid but not in style variants
            state,
        });

        const colorResolved = colorProp;

        return (
            <Icon
                size={sizeProp ?? 20}
                color={colorResolved}
                style={[textInputIconStyles.root, style]}
                {...rest}
            />
        );
    },
);

TextInputIcon.displayName = 'TextInput_Icon';

/**
 * TextInput.SupportingText - Helper/error text below the input
 */
export const TextInputSupportingText = memo(
    ({ children, style }: TextInputSupportingTextCompoundProps) => {
        const { error, state } = useContext(TextInputContext);

        textInputSupportingTextStyles.useVariants({
            state: state as any,
        });

        return (
            <HelperText
                variant={error ? 'error' : 'info'}
                style={[textInputSupportingTextStyles.supportingText, style]}>
                {children}
            </HelperText>
        );
    },
);

TextInputSupportingText.displayName = 'TextInput_SupportingText';

/**
 * TextInput.Outline - Renders the border overlay for outlined/flat variants.
 * Rendered automatically if not provided. Use this to customize border styles.
 */
export const TextInputOutline = memo(({ style }: TextInputOutlineCompoundProps) => {
    const { variant, state } = useContext(TextInputContext);

    textInputOutlineStyles.useVariants({
        variant: variant as any,
        state: state as any,
    });

    if (variant === 'plain') {
        return null;
    }

    if (variant === 'flat') {
        return (
            <View
                style={[
                    textInputOutlineStyles.underline,
                    textInputOutlineStyles.activeIndicator,
                    style,
                ]}
            />
        );
    }

    // outlined
    return <View pointerEvents="none" style={[textInputOutlineStyles.outline, style]} />;
});

TextInputOutline.displayName = 'TextInput_Outline';
