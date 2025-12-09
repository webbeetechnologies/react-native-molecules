import React, {
    forwardRef,
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
    FocusEvent,
    LayoutChangeEvent,
    StyleProp,
    TextInputProps,
    TextStyle,
    ViewProps,
    ViewStyle,
} from 'react-native';
import { Animated, I18nManager, Platform, TextInput as NativeTextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useActionState } from '../../hooks/useActionState';
import useControlledValue from '../../hooks/useControlledValue';
import useLatest from '../../hooks/useLatest';
import type { WithElements } from '../../types';
import { BackgroundContext } from '../../utils';
import { createSyntheticEvent, resolveStateVariant } from '../../utils';
import { HelperText } from '../HelperText';
import { StateLayer } from '../StateLayer';
import InputLabel from './InputLabel';
import type { RenderProps, TextInputLabelProp, TextInputSize, TextInputVariant } from './types';
import { getInputMinHeight, styles } from './utils';

const BLUR_ANIMATION_DURATION = 180;
const FOCUS_ANIMATION_DURATION = 150;

export type ElementProps = {
    color: string;
    forceFocus: () => void;
    focused: boolean;
};

type Element = ReactNode | ((props: ElementProps) => ReactNode);

export type Props = Omit<TextInputProps, 'ref'> &
    WithElements<Element> & {
        ref?: Ref<NativeTextInput | null>;
        /**
         * Variant of the TextInput.
         * - `flat` - flat input with an underline.
         * - `outlined` - input with an outline.
         *
         * In `outlined` variant, the background color of the label is derived from `colors?.background` in theme or the `backgroundColor` style.
         * This component render TextInputOutlined or TextInputFlat based on that props
         */
        variant?: TextInputVariant;
        /**
         * If true, user won't be able to interact with the component.
         */
        disabled?: boolean;
        /**
         * The text or component to use for the floating label.
         */
        label?: TextInputLabelProp;
        /**
         * Placeholder for the input.
         */
        placeholder?: string;
        /**
         * Whether to style the TextInput with error style.
         */
        error?: boolean;
        /**
         * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
         */
        onChangeText?: Function;
        /**
         * Selection color of the input
         */
        selectionColor?: string;
        /**
         * Inactive underline color of the input.
         */
        underlineColor?: string;
        /**
         * Active underline color of the input.
         */
        activeUnderlineColor?: string;
        /**
         * Inactive outline color of the input.
         */
        outlineColor?: string;
        /**
         * Active outline color of the input.
         */
        activeOutlineColor?: string;
        /**
         * Sets min height with densed layout. For `TextInput` in `flat` mode
         * height is `64dp` or in dense layout - `52dp` with label or `40dp` without label.
         * For `TextInput` in `outlined` mode
         * height is `56dp` or in dense layout - `40dp` regardless of label.
         * When you apply `height` prop in style the `dense` prop affects only `paddingVertical` inside `TextInput`
         */
        size?: TextInputSize;
        /**
         * Whether the input can have multiple lines.
         */
        multiline?: boolean;
        /**
         * The number of lines to show in the input (Android only).
         */
        numberOfLines?: number;
        /**
         * The Supporting Text below the TextInput
         */
        supportingText?: string;
        /**
         * To display the required indicator in Supporting Text and in the Label
         */
        required?: boolean;
        /**
         *
         * Callback to render a custom input component such as `react-native-text-input-mask`
         * instead of the default `TextInput` component from `react-native`.
         *
         * Example:
         * ```js
         * <TextInput
         *   label="Phone number"
         *   render={props =>
         *     <TextInputMask
         *       {...props}
         *       mask="+[00] [000] [000] [000]"
         *     />
         *   }
         * />
         * ```
         */
        render?: (props: RenderProps) => ReactNode;
        /**
         * Value of the text input.
         */
        value?: string;
        /**
         * Pass `fontSize` prop to modify the font size inside `TextInput`.
         * Pass `height` prop to set `TextInput` height.
         * Pass `backgroundColor` prop to set `TextInput` backgroundColor.
         */
        style?: StyleProp<TextStyle>;
        /**
         * Style of the Input Container
         */
        inputContainerStyle?: StyleProp<ViewStyle>;
        /**
         * Style of the Input
         */
        inputStyle?: StyleProp<TextStyle>;
        /**
         * Style of the rightElement
         */
        rightElementStyle?: StyleProp<TextStyle>;
        /**
         * Style of the leftElement
         */
        leftElementStyle?: StyleProp<TextStyle>;
        /**
         * props for the stateLayer
         */
        stateLayerProps?: PropsWithoutRef<ViewProps>;
        /**
         * testID to be used on tests.
         */
        testID?: string;
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

const TextInput = forwardRef<TextInputHandles, Props>(
    (
        {
            variant = 'flat',
            size = 'md',
            disabled = false,
            error: errorProp = false,
            multiline = false,
            editable = true,
            required = false,
            maxFontSizeMultiplier = 15,
            supportingText,
            selectionColor: selectionColorProp,
            underlineColor: underlineColorProp,
            activeUnderlineColor: activeUnderlineColorProp,
            outlineColor: outlineColorProp,
            activeOutlineColor: activeOutlineColorProp,
            placeholderTextColor: placeholderTextColorProp,
            style,
            inputContainerStyle,
            inputStyle,
            stateLayerProps = {},
            left,
            right,
            render = DefaultComponent,
            onBlur,
            leftElementStyle,
            rightElementStyle,
            ...rest
        }: Props,
        ref,
    ) => {
        const { hovered, actionsRef } = useActionState({ actionsToListen: ['hover'] });
        const isControlled = rest.value !== undefined;
        const validInputValue = isControlled ? rest.value : rest.defaultValue;
        const floatingLabelVerticalOffset = variant === 'flat' ? 16 : 0;

        const { current: labelAnimation } = useRef<Animated.Value>(
            new Animated.Value(validInputValue ? 0 : 1),
        );
        const { current: errorAnimation } = useRef<Animated.Value>(
            new Animated.Value(errorProp ? 1 : 0),
        );
        const [focused, setFocused] = useState<boolean>(false);
        const [placeholder, setPlaceholder] = useState<string | undefined>('');
        // Use value from props instead of local state when input is controlled
        const [value, onChangeValue] = useControlledValue({
            value: rest.value,
            defaultValue: rest.defaultValue,
            onChange: rest.onChangeText,
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

        const timer = useRef<NodeJS.Timeout | undefined>(undefined);
        const inputRefLocal = useRef<NativeTextInput>(null);

        useImperativeHandle(ref, () => inputRefLocal.current!);

        const { backgroundColor: parentBackground } = useContext(BackgroundContext);
        const hasActiveOutline = focused || errorProp;

        useEffect(() => {
            // When the input has an error, we wiggle the label and apply error styles
            if (errorProp) {
                // show error
                Animated.timing(errorAnimation, {
                    toValue: 1,
                    duration: FOCUS_ANIMATION_DURATION * animationScale,
                    // To prevent this - https://github.com/callstack/react-native-paper/issues/941
                    useNativeDriver: true,
                }).start();

                return;
            }

            // hide error
            Animated.timing(errorAnimation, {
                toValue: 0,
                duration: BLUR_ANIMATION_DURATION * animationScale,
                // To prevent this - https://github.com/callstack/react-native-paper/issues/941
                useNativeDriver: true,
            }).start();
        }, [errorProp, errorAnimation]);

        useEffect(() => {
            // Show placeholder text only if the input is focused, or there's no label
            // We don't show placeholder if there's a label because the label acts as placeholder
            // When focused, the label moves up, so we can show a placeholder
            if (focused || !rest.label) {
                // Set the placeholder in a delay to offset the label animation
                // If we show it immediately, they'll overlap and look ugly
                timer.current = setTimeout(
                    () => setPlaceholder(rest.placeholder),
                    50,
                ) as unknown as NodeJS.Timeout;
            } else {
                // hidePlaceholder
                setPlaceholder('');
            }

            return () => {
                if (timer.current) {
                    clearTimeout(timer.current);
                }
            };
        }, [focused, rest.label, rest.placeholder]);

        const hasValue = !!value || focused;

        useEffect(() => {
            // The label should be minimized if the text input is focused, or has text
            // In minimized mode, the label moves up and becomes small
            // workaround for animated regression for react native > 0.61
            // https://github.com/callstack/react-native-paper/pull/1440
            if (hasValue) {
                // minimize label
                Animated.timing(labelAnimation, {
                    toValue: 0,
                    duration: BLUR_ANIMATION_DURATION * animationScale,
                    // To prevent this - https://github.com/callstack/react-native-paper/issues/941
                    useNativeDriver: true,
                }).start();
            } else {
                // restore label
                Animated.timing(labelAnimation, {
                    toValue: 1,
                    duration: FOCUS_ANIMATION_DURATION * animationScale,
                    // To prevent this - https://github.com/callstack/react-native-paper/issues/941
                    useNativeDriver: true,
                }).start();
            }
        }, [focused, hasValue, labelAnimation]);

        const handleFocus = useCallback(
            (args: FocusEvent) => {
                if (disabled || !editable) {
                    return;
                }

                setFocused(true);

                rest.onFocus?.(args);
            },
            [disabled, editable, rest],
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

        // This is because of a bug in react 18 doesn't trigger onBlur when the component is unmounted // we can remove it when it's fixed
        useEffect(() => {
            const isVersion18 =
                typeof React.version === 'string' ? +React.version.split('.')[0] >= 18 : false;

            const _onBlurRef = onBlurRef;
            const input = inputRefLocal.current;

            return () => {
                if (!isVersion18 || !input?.isFocused() || Platform.OS !== 'web') return;

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
        }, [onBlurRef]);

        // @ts-ignore // TODO - fix this
        const componentStyles = styles.root;

        const labelWidth = labelLayout.width;
        const labelHeight = labelLayout.height;
        const labelHalfWidth = labelWidth / 2;
        const labelScale =
            minimizedLabelFontSize / (componentStyles.fontSize || maximizedLabelFontSize);
        const baseLabelTranslateX =
            (I18nManager.isRTL ? 1 : -1) *
            (labelScale - 1 + labelHalfWidth - (labelScale * labelWidth) / 2);

        // const normalizedLeftElementMarginRight = normalizeSpacings(
        //     styles.leftElement,
        //     'marginRight',
        // );

        const baseLabelTranslateXOutline =
            baseLabelTranslateX - leftElementLayout.width - (left ? 0 : 0);

        const backgroundColor =
            styles.container?.backgroundColor || componentStyles.backgroundColor;
        // const viableRadiuses = normalizeBorderRadiuses(componentStyles);
        const finalHeight =
            (+(componentStyles.height ?? 0) > 0 ? componentStyles.height : +labelHeight) ?? 0;
        const inputHeight = finalHeight < inputMinHeight ? inputMinHeight : finalHeight;
        const hasLabel = !!rest.label;

        const computedStyles = useMemo(
            () => ({
                activeIndicator: styles.activeIndicator,
                fontSize: componentStyles.fontSize,
                fontWeight: componentStyles.fontWeight,
                height: componentStyles.height,
                textAlign: componentStyles.textAlign,
                backgroundColor,
                activeColor: (styles as any).root.activeColor,
                baseLabelTranslateX:
                    variant === 'outlined' ? baseLabelTranslateXOutline : baseLabelTranslateX,
                labelScale,
                selectionColor: selectionColorProp || (styles as any).root.activeColor,
                underlineColor: underlineColorProp,
                activeUnderlineColor: activeUnderlineColorProp,
                outlineColor: outlineColorProp,
                activeOutlineColor: activeOutlineColorProp,
                placeholderTextColor: placeholderTextColorProp || styles.placeholder?.color,
                floatingLabelVerticalOffset,
                labelWiggleXOffset,
                textInputStyle: [
                    styles.inputText,
                    variant === 'flat' && hasLabel && { paddingTop: 12 },
                    !multiline || (multiline && componentStyles.height)
                        ? { height: inputHeight || labelHeight }
                        : {},
                    multiline && variant === 'outlined' && { paddingTop: 12 },
                    {
                        textAlignVertical: multiline ? 'top' : 'center',
                        textAlign: componentStyles.textAlign
                            ? componentStyles.textAlign
                            : I18nManager.isRTL
                            ? 'right'
                            : 'left',
                    },
                    Platform.OS === 'ios' && !multiline
                        ? { lineHeight: undefined, textAlign: undefined }
                        : {},
                    Platform.OS === 'web' && { outline: 'none' },
                    inputStyle,
                ],
                inputContainerStyle: [
                    styles.labelContainer,
                    {
                        minHeight: componentStyles.height || labelHeight,
                    },
                    inputContainerStyle,
                ],
                underlineStyle: [
                    styles.underline,
                    styles.activeIndicator,
                    hasActiveOutline && activeOutlineColorProp
                        ? {
                              backgroundColor: hasActiveOutline
                                  ? activeUnderlineColorProp
                                  : underlineColorProp,
                          }
                        : {},
                ],
                outlineStyle: [
                    styles.outline,
                    hasActiveOutline && activeOutlineColorProp
                        ? {
                              borderColor: hasActiveOutline
                                  ? activeOutlineColorProp
                                  : outlineColorProp,
                          }
                        : {},
                    // viableRadiuses,
                    {},
                ],
                patchContainer: [
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor,
                    },
                    styles.patchContainer,
                ],
                stateLayerStyle: [styles.stateLayer, stateLayerProps?.style],
            }),
            // forcing useMemo to recompute when state, size or variant change
            // eslint-disable-next-line
            [
                hasLabel,
                state,
                size,
                componentStyles,
                backgroundColor,
                variant,
                parentBackground,
                baseLabelTranslateXOutline,
                baseLabelTranslateX,
                labelScale,
                selectionColorProp,
                underlineColorProp,
                activeUnderlineColorProp,
                outlineColorProp,
                activeOutlineColorProp,
                placeholderTextColorProp,
                floatingLabelVerticalOffset,
                multiline,
                inputHeight,
                labelHeight,
                inputStyle,
                inputContainerStyle,
                hasActiveOutline,
                stateLayerProps?.style,
            ],
        );

        return (
            <>
                <View ref={actionsRef} style={[styles.container, style]}>
                    {variant === 'flat' && (
                        <>
                            <Animated.View
                                testID={rest.testID && `${rest.testID}--text-input-underline`}
                                style={computedStyles.underlineStyle}
                            />

                            <StateLayer
                                testID={rest.testID && `${rest.testID}--stateLayer`}
                                {...stateLayerProps}
                                style={computedStyles.stateLayerStyle}
                            />
                        </>
                    )}
                    {variant === 'outlined' && (
                        <Animated.View
                            testID="text-input-outline"
                            pointerEvents="none"
                            style={computedStyles.outlineStyle}
                        />
                    )}

                    {left && (
                        <View
                            style={[styles.leftElement, leftElementStyle]}
                            onLayout={handleLayoutLeftElement}
                            testID={rest.testID && `${rest.testID}--text-input-left-element`}>
                            {typeof left === 'function'
                                ? left?.({ color: computedStyles.activeColor, forceFocus, focused })
                                : left}
                        </View>
                    )}

                    <View
                        style={computedStyles.inputContainerStyle}
                        testID={rest.testID && `${rest.testID}-${variant}`}>
                        {Platform.OS !== 'android' &&
                            multiline &&
                            !!rest.label &&
                            variant === 'flat' && (
                                // Workaround for: https://github.com/callstack/react-native-paper/issues/2799
                                // Patch for a multiline TextInput with fixed height, which allow to avoid covering input label with its value.
                                <View
                                    testID={rest.testID && `${rest.testID}--patch-container`}
                                    pointerEvents="none"
                                    style={computedStyles.patchContainer}
                                />
                            )}

                        {variant !== 'plain' && (
                            <InputLabel
                                hasValue={!!value}
                                focused={focused}
                                labelAnimation={labelAnimation}
                                errorAnimation={errorAnimation}
                                labelLayout={labelLayout}
                                label={rest.label}
                                floatingStyle={styles.floatingLabel}
                                floatingLabelVerticalOffset={
                                    computedStyles.floatingLabelVerticalOffset
                                }
                                required={required}
                                onLayoutAnimatedText={handleLayoutAnimatedText}
                                error={errorProp}
                                baseLabelTranslateX={computedStyles.baseLabelTranslateX}
                                labelScale={computedStyles.labelScale}
                                wiggleOffsetX={computedStyles.labelWiggleXOffset}
                                maxFontSizeMultiplier={maxFontSizeMultiplier}
                                testID={rest.testID}
                                style={styles.labelText}
                            />
                        )}

                        {render({
                            testID: rest.testID,
                            ...rest,
                            style: computedStyles.textInputStyle,
                            ref: inputRefLocal,
                            onChangeText: onChangeValue,
                            placeholder: rest.label ? placeholder : rest.placeholder,
                            placeholderTextColor: computedStyles.placeholderTextColor,
                            editable: !disabled && editable,
                            selectionColor: computedStyles.selectionColor,
                            onFocus: handleFocus,
                            onBlur: handleBlur,
                            underlineColorAndroid: 'transparent',
                            multiline,
                            size,
                        })}
                    </View>

                    {right && (
                        <View
                            style={[styles.rightElement, rightElementStyle]}
                            testID={rest.testID && `${rest.testID}--text-input-right-element`}>
                            {typeof right === 'function'
                                ? right?.({
                                      color: computedStyles.activeColor,
                                      forceFocus,
                                      focused,
                                  })
                                : right}
                        </View>
                    )}
                </View>

                {supportingText && (
                    <HelperText
                        variant={errorProp ? 'error' : 'info'}
                        style={styles.supportingText}>
                        {supportingText}
                    </HelperText>
                )}
            </>
        );
    },
);

export default memo(TextInput);
