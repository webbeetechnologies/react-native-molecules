// @typescript-eslint/no-unused-vars
// WORK IN PROGRESS

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { TextInput as TextInputNative, useWindowDimensions, View } from 'react-native';

import { useLatest } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import AmPmSwitcher from './AmPmSwitcher';
import TimeInput from './TimeInput';
import {
    clockTypes,
    type PossibleClockTypes,
    type PossibleInputTypes,
    toHourInputFormat,
} from './timeUtils';
import { timePickerInputsStyles } from './utils';

type Props = {
    inputType: PossibleInputTypes;
    focused: PossibleClockTypes;
    hours: number;
    minutes: number;
    hourLabel: string;
    minuteLabel: string;
    hourErrorText: string;
    minuteErrorText: string;
    onFocusInput: (type: PossibleClockTypes) => any;
    onChange: (hoursMinutesAndFocused: {
        hours: number;
        minutes: number;
        focused?: undefined | PossibleClockTypes;
    }) => any;
    is24Hour: boolean;
};

function TimeInputs({
    hours,
    minutes,
    hourLabel,
    minuteLabel,
    hourErrorText,
    minuteErrorText,
    onFocusInput,
    focused,
    inputType,
    onChange,
    is24Hour,
}: Props) {
    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;
    const [hourError, setHourError] = useState(false);
    const [minuteError, setMinuteError] = useState(false);

    timePickerInputsStyles.useVariants({
        state: resolveStateVariant({
            landScape: isLandscape,
        }) as any,
    });
    const startInput = useRef<TextInputNative | null>(null);
    const endInput = useRef<TextInputNative | null>(null);

    useEffect(() => {
        if (inputType !== 'keyboard') {
            setHourError(false);
            setMinuteError(false);
            return;
        }

        const id = setTimeout(() => startInput.current?.focus(), 0);
        return () => clearTimeout(id);
    }, [inputType]);

    const onSubmitStartInput = useCallback(() => {
        if (endInput.current) {
            endInput.current.focus();
        }
    }, [endInput]);

    const onSubmitEndInput = useCallback(() => {
        // TODO: close modal and persist time
    }, []);

    const minutesRef = useLatest(minutes);
    const isPm = hours >= 12;
    const onChangeHours = useCallback(
        (newHours: number) => {
            onChange({
                hours: newHours,
                minutes: minutesRef.current,
                focused: clockTypes.hours,
            });
        },
        [onChange, minutesRef],
    );

    const onHourChange = useCallback(
        (newHoursFromInput: number, text: string) => {
            if (text.length === 0) {
                setHourError(false);
                return;
            }

            const isNumeric = /^\d+$/.test(text);
            const minHours = is24Hour ? 0 : 1;
            const maxHours = is24Hour ? 23 : 12;
            const isValid =
                isNumeric && newHoursFromInput >= minHours && newHoursFromInput <= maxHours;

            setHourError(!isValid);

            if (!isValid) {
                return;
            }

            let newHours = newHoursFromInput;
            if (!is24Hour) {
                if (isPm) {
                    newHours = newHoursFromInput === 12 ? 12 : newHoursFromInput + 12;
                } else {
                    newHours = newHoursFromInput === 12 ? 0 : newHoursFromInput;
                }
            }

            onChange({
                hours: newHours,
                minutes: minutesRef.current,
            });

            const maxStartDigit = is24Hour ? 2 : 1;
            const shouldAdvance = text.length >= 2 || newHoursFromInput > maxStartDigit;
            if (shouldAdvance) endInput.current?.focus();
        },
        [is24Hour, isPm, minutesRef, onChange],
    );

    const onMinuteChange = useCallback(
        (newMinutesFromInput: number, text: string) => {
            if (text.length === 0) {
                setMinuteError(false);
                return;
            }

            const isNumeric = /^\d+$/.test(text);
            const isValid = isNumeric && newMinutesFromInput >= 0 && newMinutesFromInput <= 59;

            setMinuteError(!isValid);

            if (!isValid) {
                return;
            }

            onChange({
                hours: hours,
                minutes: newMinutesFromInput,
            });
        },
        [hours, onChange],
    );

    return (
        <View style={timePickerInputsStyles.wrapper}>
            <View style={timePickerInputsStyles.inputContainer}>
                <TimeInput
                    ref={startInput}
                    placeholder={''}
                    value={toHourInputFormat(hours, is24Hour)}
                    clockType={clockTypes.hours}
                    pressed={focused === clockTypes.hours}
                    onPress={onFocusInput}
                    inputType={inputType}
                    returnKeyType={'next'}
                    onSubmitEditing={onSubmitStartInput}
                    blurOnSubmit={false}
                    error={hourError}
                    onChanged={onHourChange}
                    // onChangeText={onChangeStartInput}
                />
                <View style={timePickerInputsStyles.hoursAndMinutesSeparator}>
                    <View style={timePickerInputsStyles.spaceDot} />
                    <View style={timePickerInputsStyles.dot} />
                    <View style={timePickerInputsStyles.betweenDot} />
                    <View style={timePickerInputsStyles.dot} />
                    <View style={timePickerInputsStyles.spaceDot} />
                </View>
                <TimeInput
                    ref={endInput}
                    placeholder={'00'}
                    value={minutes}
                    clockType={clockTypes.minutes}
                    pressed={focused === clockTypes.minutes}
                    onPress={onFocusInput}
                    inputType={inputType}
                    error={minuteError}
                    onSubmitEditing={onSubmitEndInput}
                    onChanged={onMinuteChange}
                />
                {!is24Hour && (
                    <>
                        <View style={timePickerInputsStyles.spaceBetweenInputsAndSwitcher} />
                        <AmPmSwitcher hours={hours} onChange={onChangeHours} />
                    </>
                )}
            </View>
            {inputType === 'keyboard' ? (
                <View style={timePickerInputsStyles.supportingRow}>
                    <View style={timePickerInputsStyles.supportingSlot}>
                        <Text
                            style={[
                                timePickerInputsStyles.supportingText,
                                hourError ? timePickerInputsStyles.supportingTextError : null,
                            ]}>
                            {hourError ? hourErrorText : hourLabel}
                        </Text>
                    </View>
                    <View style={timePickerInputsStyles.hoursAndMinutesSeparator} />
                    <View style={timePickerInputsStyles.supportingSlot}>
                        <Text
                            style={[
                                timePickerInputsStyles.supportingText,
                                minuteError ? timePickerInputsStyles.supportingTextError : null,
                            ]}>
                            {minuteError ? minuteErrorText : minuteLabel}
                        </Text>
                    </View>
                    {!is24Hour && (
                        <View style={timePickerInputsStyles.spaceBetweenInputsAndSwitcher} />
                    )}
                </View>
            ) : null}
        </View>
    );
}

export default memo(TimeInputs);
