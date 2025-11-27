import { memo, useCallback, useMemo, useState } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useControlledValue } from '../../hooks';
import { format, parse } from '../../utils/date-fns';
import AnalogClock from './AnalogClock';
import { DisplayModeContext } from './DisplayModeContext';
import TimeInputs from './TimeInputs';
import {
    inputTypes,
    type PossibleClockTypes,
    type PossibleInputTypes,
    toHourInputFormat,
} from './timeUtils';
import { timePickerStyles } from './utils';

type onChangeFunc = ({
    hours,
    minutes,
    focused,
}: {
    hours: number;
    minutes: number;
    focused?: undefined | PossibleClockTypes;
}) => any;

export type Props = {
    /**
     * hh:mm format
     * */
    time: string;
    onTimeChange: (params: { time: string; focused?: undefined | PossibleClockTypes }) => any;

    is24Hour?: boolean;
    inputType?: PossibleInputTypes;
    focused?: PossibleClockTypes;

    onFocusInput?: (type: PossibleClockTypes) => any;
    isLandscape?: boolean;
    style?: StyleProp<ViewStyle>;
};

function TimePicker({
    is24Hour = false,
    time,
    focused: focusedProp,
    onFocusInput: onFocusInputProp,
    inputType = 'keyboard',
    onTimeChange,
    isLandscape = false,
    style,
}: Props) {
    const { hours, minutes } = useMemo(() => {
        const date = time ? parse(time, 'HH:mm', new Date()) : new Date();

        return { hours: +format(date, 'HH'), minutes: +format(date, 'mm') };
    }, [time]);

    const [focused, onFocusInput] = useControlledValue({
        value: focusedProp,
        defaultValue: 'hours',
        onChange: onFocusInputProp,
    });

    // Initialize display Mode according the hours value
    const [displayMode, setDisplayMode] = useState<'AM' | 'PM' | undefined>(() =>
        !is24Hour ? (hours >= 12 ? 'PM' : 'AM') : undefined,
    );

    timePickerStyles.useVariants({
        variant: (isLandscape
            ? inputType === 'keyboard'
                ? 'landScapeWithoutClock'
                : 'landScape'
            : 'default') as any,
    });

    const onChange = useCallback<onChangeFunc>(
        params => {
            const newDisplayMode = params.hours >= 12 ? 'PM' : 'AM';

            if (newDisplayMode !== displayMode) setDisplayMode(newDisplayMode);

            onTimeChange?.({
                time: `${`${params.hours}`.padStart(2, '0')}:${`${params.minutes}`.padStart(
                    2,
                    '0',
                )}`,
                focused: params.focused,
            });
        },
        [displayMode, onTimeChange],
    );

    const memoizedValue = useMemo(
        () => ({ mode: displayMode, setMode: setDisplayMode }),
        [displayMode],
    );

    return (
        <DisplayModeContext.Provider value={memoizedValue}>
            <View style={[timePickerStyles.container, style]}>
                <TimeInputs
                    inputType={inputType}
                    hours={hours}
                    minutes={minutes}
                    is24Hour={is24Hour}
                    onChange={onChange}
                    onFocusInput={onFocusInput}
                    focused={focused}
                />
                <>
                    {inputType === inputTypes.picker ? (
                        <View style={timePickerStyles.clockContainer}>
                            <AnalogClock
                                hours={toHourInputFormat(hours, is24Hour)}
                                minutes={minutes}
                                focused={focused}
                                is24Hour={is24Hour}
                                onChange={onChange}
                            />
                        </View>
                    ) : null}
                </>
            </View>
        </DisplayModeContext.Provider>
    );
}

export default memo(TimePicker);
