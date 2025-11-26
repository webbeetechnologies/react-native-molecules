import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { TextInput, type TextInputProps } from '../TextInput';
import { TouchableRipple } from '../TouchableRipple';
import { inputTypes, type PossibleClockTypes, type PossibleInputTypes } from './timeUtils';
import { timePickerInputStyles } from './utils';

interface TimeInputProps
    extends Omit<
        Omit<TextInputProps, 'value' | 'variant' | 'onChangeText' | 'onPress'>,
        'onFocus'
    > {
    value: number;
    clockType: PossibleClockTypes;
    onPress?: (type: PossibleClockTypes) => any;
    pressed: boolean;
    onChanged: (n: number) => any;
    inputType: PossibleInputTypes;
}

function TimeInput(
    {
        value,
        clockType,
        pressed,
        onPress,
        onChanged,
        inputType,
        inputStyle,
        style,
        ...rest
    }: TimeInputProps,
    ref: any,
) {
    const onInnerChange = (text: string) => {
        onChanged(Number(text));
    };

    const theme = useTheme();
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const highlighted = inputType === inputTypes.picker ? pressed : inputFocused;

    const state = resolveStateVariant({
        highlighted,
    });
    timePickerInputStyles.useVariants({
        state: state as any,
    });

    const formattedValue = useMemo(() => {
        let _formattedValue = `${value}`;

        if (!inputFocused) {
            _formattedValue = `${value}`.length === 1 ? `0${value}` : `${value}`;
        }

        return _formattedValue;
    }, [value, inputFocused]);

    const { rippleColor, containerStyle, textInputContainerStyle, textInputStyle, buttonStyle } =
        useMemo(() => {
            const { container, input, button } = timePickerInputStyles;

            return {
                rippleColor: timePickerInputStyles.root?._rippleColor,
                containerStyle: container,
                textInputContainerStyle: [{ paddingHorizontal: 0 }, style],
                textInputStyle: [input, inputStyle],
                buttonStyle: [StyleSheet.absoluteFill, button],
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [inputStyle, style, state]);

    const onFocus = useCallback(() => setInputFocused(true), []);
    const onBlur = useCallback(() => setInputFocused(false), []);
    const onPressInput = useCallback(() => onPress?.(clockType), [clockType, onPress]);

    return (
        <View style={containerStyle}>
            <TextInput
                variant="plain"
                ref={ref}
                inputStyle={textInputStyle}
                style={textInputContainerStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardAppearance={theme.dark ? 'dark' : 'default'}
                value={formattedValue}
                maxLength={2}
                onChangeText={onInnerChange}
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
