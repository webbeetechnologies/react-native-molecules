import { memo, useCallback, useMemo, useRef } from 'react';

import type { DatePickerValue, RangeValue } from '../DatePicker/context';
import { useDatePickerContext } from '../DatePicker/context';
import type { TextInputProps } from '../TextInput';
import { TextInputWithMask } from '../TextInputWithMask';
import { useDateFieldState } from './useDateFieldState';

export type DateFieldInputMode = 'start' | 'end';

export type DateFieldProps = Omit<
    TextInputProps,
    'value' | 'defaultValue' | 'onChangeText' | 'inputMode'
> & {
    inputMode?: DateFieldInputMode;
    dateFormat?: string;
};

const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

const isRange = (value: DatePickerValue): value is RangeValue =>
    value !== null && typeof value === 'object' && 'start' in value && 'end' in value;

const preserveTime = (next: Date | null, prev: Date | null): Date | null => {
    if (!next || !prev) return next;

    const combined = new Date(next);

    combined.setHours(
        prev.getHours(),
        prev.getMinutes(),
        prev.getSeconds(),
        prev.getMilliseconds(),
    );
    return combined;
};

function DateField({
    ref,
    inputMode = 'start',
    dateFormat = DEFAULT_DATE_FORMAT,
    disabled: disabledProp,
    onBlur,
    onFocus,
    ...rest
}: DateFieldProps) {
    const {
        mode,
        value,
        commitValue,
        validRange,
        disabled: providerDisabled,
    } = useDatePickerContext();
    const isBlurredRef = useRef(true);

    const disabled = disabledProp ?? providerDisabled;

    const fieldValue = useMemo<Date | null>(() => {
        if (mode === 'range') {
            if (!isRange(value)) return null;
            return inputMode === 'end' ? value.end : value.start;
        }
        return isRange(value) ? null : value;
    }, [value, mode, inputMode]);

    const onChange = useCallback(
        (next: Date | null) => {
            if (mode === 'range') {
                const current: RangeValue = isRange(value) ? value : { start: null, end: null };
                commitValue({ ...current, [inputMode]: next });
                return;
            }
            commitValue(preserveTime(next, isRange(value) ? null : value));
        },
        [mode, value, inputMode, commitValue],
    );

    const {
        formattedValue,
        onChangeText,
        onBlur: onInnerBlur,
        onFocus: onInnerFocus,
    } = useDateFieldState({
        value: fieldValue,
        validRange,
        inputMode,
        dateFormat,
        onChange,
        onBlur,
        onFocus,
        isBlurredRef,
    });

    return (
        <TextInputWithMask
            {...rest}
            ref={ref}
            disabled={disabled}
            value={formattedValue}
            placeholder={dateFormat}
            keyboardType="number-pad"
            mask={dateFormat}
            onChangeText={onChangeText}
            onBlur={onInnerBlur}
            onFocus={onInnerFocus}
        />
    );
}

export default memo(DateField);
