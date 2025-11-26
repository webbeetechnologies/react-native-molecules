// @typescript-eslint/no-unused-vars
// WORK IN PROGRESS

import { memo, useCallback, useRef } from 'react';
import { TextInput as TextInputNative, useWindowDimensions, View } from 'react-native';

import { useLatest } from '../../hooks';
import { resolveStateVariant } from '../../utils';
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
    onFocusInput,
    focused,
    inputType,
    onChange,
    is24Hour,
}: Props) {
    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;

    timePickerInputsStyles.useVariants({
        state: resolveStateVariant({
            landScape: isLandscape,
        }) as any,
    });
    const startInput = useRef<TextInputNative | null>(null);
    const endInput = useRef<TextInputNative | null>(null);

    const onSubmitStartInput = useCallback(() => {
        if (endInput.current) {
            endInput.current.focus();
        }
    }, [endInput]);

    const onSubmitEndInput = useCallback(() => {
        // TODO: close modal and persist time
    }, []);

    const minutesRef = useLatest(minutes);
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
        (newHoursFromInput: number) => {
            let newHours = newHoursFromInput;
            if (newHoursFromInput >= 24) {
                newHours = 0;
            }
            onChange({
                hours: newHours,
                minutes,
            });
        },
        [minutes, onChange],
    );

    const onMinuteChange = useCallback(
        (newMinutesFromInput: number) => {
            let newMinutes = newMinutesFromInput;

            if (newMinutesFromInput > 59) {
                newMinutes = 0;
            }
            onChange({
                hours: hours,
                minutes: newMinutes,
            });
        },
        [hours, onChange],
    );

    return (
        <View style={timePickerInputsStyles.inputContainer}>
            <TimeInput
                ref={startInput}
                placeholder={'00'}
                value={toHourInputFormat(hours, is24Hour)}
                clockType={clockTypes.hours}
                pressed={focused === clockTypes.hours}
                onPress={onFocusInput}
                inputType={inputType}
                returnKeyType={'next'}
                onSubmitEditing={onSubmitStartInput}
                blurOnSubmit={false}
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
    );
}

export default memo(TimeInputs);
