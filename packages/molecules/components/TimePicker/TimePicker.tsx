import { memo, useCallback, useMemo, useState } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { getRegisteredComponentWithFallback } from '../../core';
import { useControlledValue } from '../../hooks';
import { format, parse } from '../../utils/date-fns';
import { useOptionalDatePickerContext } from '../DatePicker/context';
import AnalogClock from './AnalogClock';
import { useOptionalTimePickerContext } from './context';
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
     * hh:mm format. Optional when mounted inside a DatePickerProvider — the provider's Date is read instead.
     * */
    time?: string;
    onTimeChange?: (params: { time: string; focused?: undefined | PossibleClockTypes }) => any;

    is24Hour?: boolean;
    inputType?: PossibleInputTypes;
    focused?: PossibleClockTypes;

    onFocusInput?: (type: PossibleClockTypes) => any;
    isLandscape?: boolean;
    style?: StyleProp<ViewStyle>;
};

const toTimeString = (value: Date | null | undefined): string => {
    if (!value) return '';
    const h = value.getHours().toString().padStart(2, '0');
    const m = value.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

const applyTimeToDate = (base: Date | null | undefined, time: string): Date | null => {
    if (!time) return null;
    const [h, m] = time.split(':').map(n => parseInt(n, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return base ?? null;
    const next = base ? new Date(base) : new Date();
    next.setHours(h, m, 0, 0);
    return next;
};

function TimePicker({
    time: timeProp,
    onTimeChange: onTimeChangeProp,
    is24Hour: is24HourProp,
    focused: focusedProp,
    onFocusInput: onFocusInputProp,
    inputType: inputTypeProp,
    isLandscape = false,
    style,
}: Props) {
    const ctx = useOptionalDatePickerContext();
    const tpCtx = useOptionalTimePickerContext();

    const ctxDate =
        ctx && ctx.draftValue && typeof ctx.draftValue === 'object' && 'start' in ctx.draftValue
            ? null
            : (ctx?.draftValue as Date | null | undefined);

    const time = timeProp ?? toTimeString(ctxDate);
    const is24Hour = is24HourProp ?? ctx?.is24Hour ?? false;
    const inputType = inputTypeProp ?? tpCtx?.inputType ?? (ctx ? 'picker' : 'keyboard');

    const onTimeChange = useMemo(
        () =>
            onTimeChangeProp ??
            ((params: { time: string; focused?: undefined | PossibleClockTypes }) => {
                if (!ctx) return;
                ctx.setValue(applyTimeToDate(ctxDate, params.time));
            }),
        [onTimeChangeProp, ctx, ctxDate],
    );

    const { hours, minutes } = useMemo(() => {
        const date = time ? parse(time, 'HH:mm', new Date()) : new Date();

        return { hours: +format(date, 'HH'), minutes: +format(date, 'mm') };
    }, [time]);

    const [focused, onFocusInput] = useControlledValue({
        value: focusedProp,
        defaultValue: 'hours',
        onChange: onFocusInputProp,
    });

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

const TimePickerDefault = memo(TimePicker);

export default TimePickerDefault;

export const TimePickerClock = getRegisteredComponentWithFallback('TimePicker', TimePickerDefault);
