import { memo, useCallback, useMemo } from 'react';

import type { DatePickerValue, RangeValue } from '../DatePicker/context';
import { useDatePickerContext } from '../DatePicker/context';
import { TextInput } from '../TextInput';
import type { Props as TextInputProps } from '../TextInput/TextInput';
import { useTimeFieldState } from './useTimeFieldState';
import { timeFormat } from './utils';

export type TimeFieldProps = Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText'>;

const isRange = (value: DatePickerValue): value is RangeValue =>
    value !== null && typeof value === 'object' && 'start' in value && 'end' in value;

const toTimeString = (value: Date | null): string => {
    if (!value) return '';
    const h = value.getHours().toString().padStart(2, '0');
    const m = value.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

const applyTimeToDate = (base: Date | null, time: string): Date | null => {
    if (!time) return null;
    const [h, m] = time.split(':').map(n => parseInt(n, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return base;
    const next = base ? new Date(base) : new Date();
    next.setHours(h, m, 0, 0);
    return next;
};

function TimeField({ ref, disabled: disabledProp, onBlur, onFocus, ...rest }: TimeFieldProps) {
    const { value, commitValue, is24Hour, disabled: providerDisabled } = useDatePickerContext();

    const disabled = disabledProp ?? providerDisabled;

    const dateValue = useMemo<Date | null>(() => (isRange(value) ? null : value), [value]);

    const timeString = useMemo(() => toTimeString(dateValue), [dateValue]);

    const onChange = useCallback(
        (next: string) => {
            commitValue(applyTimeToDate(dateValue, next));
        },
        [dateValue, commitValue],
    );

    const {
        timeString: formatted,
        onChangeText,
        onBlur: onInnerBlur,
        onFocus: onInnerFocus,
    } = useTimeFieldState({
        time: timeString,
        is24Hour,
        disabled,
        onChange,
        onBlur,
        onFocus,
    });

    return (
        <TextInput
            placeholder={timeFormat[is24Hour ? '24' : '12'].format}
            {...rest}
            ref={ref}
            disabled={disabled}
            value={formatted}
            onChangeText={onChangeText}
            onBlur={onInnerBlur}
            onFocus={onInnerFocus}
        />
    );
}

export default memo(TimeField);
