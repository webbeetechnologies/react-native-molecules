import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    type NativeSyntheticEvent,
    StyleSheet,
    TextInput as NativeTextInput,
    type TextInputProps as NativeTextInputProps,
    type TextInputSelectionChangeEventData,
    View,
} from 'react-native';

import { useTheme } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { TouchableRipple } from '../TouchableRipple';
import { inputTypes, type PossibleClockTypes, type PossibleInputTypes } from './timeUtils';
import { timePickerInputStyles } from './utils';

interface TimeInputProps extends Omit<NativeTextInputProps, 'value' | 'onChangeText' | 'onPress'> {
    value: number;
    clockType: PossibleClockTypes;
    onPress?: (type: PossibleClockTypes) => any;
    pressed: boolean;
    onChanged: (n: number, text: string) => any;
    inputType: PossibleInputTypes;
    error?: boolean;
    inputStyle?: NativeTextInputProps['style'];
}

function TimeInput(
    {
        value,
        clockType,
        pressed,
        onPress,
        onChanged,
        inputType,
        error = false,
        inputStyle,
        style,
        ...rest
    }: TimeInputProps,
    ref: any,
) {
    const theme = useTheme();
    const [inputFocused, setInputFocused] = useState<boolean>(false);
    const [rawText, setRawText] = useState<string | null>(null);
    const [selection, setSelection] = useState<{ start: number; end: number } | undefined>();

    const onInnerChange = (text: string) => {
        setRawText(text);
        onChanged(Number(text), text);
    };

    const highlighted = inputType === inputTypes.picker ? pressed : inputFocused;

    const state = resolveStateVariant({
        highlighted,
    });
    timePickerInputStyles.useVariants({
        state: state as any,
    });

    const formattedValue = useMemo(() => {
        if (rawText !== null && (inputFocused || error)) return rawText;

        const str = `${value}`;
        return str.length === 1 ? `0${str}` : str;
    }, [value, inputFocused, rawText, error]);

    const { rippleColor, containerStyle, textInputStyle, buttonStyle } = useMemo(() => {
        const {
            container,
            input,
            keyboardInput,
            keyboardInputHighlighted,
            inputError,
            keyboardInputError,
            button,
        } = timePickerInputStyles;
        const isKeyboardInput = inputType === inputTypes.keyboard;

        return {
            rippleColor: timePickerInputStyles.root?._rippleColor,
            containerStyle: container,
            textInputStyle: [
                input,
                isKeyboardInput ? keyboardInput : null,
                isKeyboardInput && highlighted ? keyboardInputHighlighted : null,
                error ? inputError : null,
                isKeyboardInput && error ? keyboardInputError : null,
                style,
                inputStyle,
            ],
            buttonStyle: [StyleSheet.absoluteFill, button],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, highlighted, inputStyle, inputType, style, state]);

    const onFocus = useCallback(() => setInputFocused(true), []);

    const onBlur = useCallback(() => {
        setInputFocused(false);
        setSelection(undefined);
        if (!error) {
            setRawText(null);
        }
    }, [error]);

    const onPressInput = useCallback(() => onPress?.(clockType), [clockType, onPress]);

    const onSelectionChange = useCallback(
        (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
            if (selection) {
                setSelection(undefined);
            }

            rest.onSelectionChange?.(e);
        },
        [rest, selection],
    );

    useEffect(() => {
        if (error && inputFocused && rawText?.length) {
            setSelection({ start: 0, end: rawText.length });
            return;
        }

        setSelection(undefined);
    }, [error, inputFocused, rawText]);

    return (
        <View style={containerStyle}>
            <NativeTextInput
                ref={ref}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardAppearance={theme.dark ? 'dark' : 'default'}
                value={formattedValue}
                maxLength={2}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                selectTextOnFocus={inputType === inputTypes.picker || error}
                selection={selection}
                onSelectionChange={onSelectionChange}
                onChangeText={onInnerChange}
                style={textInputStyle}
                {...rest}
            />
            <>
                {onPress && inputType === inputTypes.picker ? (
                    <TouchableRipple
                        style={buttonStyle}
                        rippleColor={rippleColor}
                        onPress={onPressInput}
                        borderless={true}>
                        <View />
                    </TouchableRipple>
                ) : null}
            </>
        </View>
    );
}

export default memo(forwardRef(TimeInput));
