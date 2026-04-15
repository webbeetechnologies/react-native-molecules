import { type RefObject, useCallback, useEffect, useState } from 'react';
import type { BlurEvent, FocusEvent } from 'react-native';

import { useLatest } from '../../hooks';
import { endOfDay, format, isValid, parse } from '../../utils/date-fns';
import { isNil } from '../../utils/lodash';
import type { ValidRangeType } from '../DatePickerInline';
import { useRangeChecker } from '../DatePickerInline/dateUtils';

const formatValue = (value: Date | null | undefined, dateFormat: string) =>
    !isNil(value) ? format(value, dateFormat) || '' : '';

type Props = {
    value?: Date | null;
    validRange?: ValidRangeType;
    inputMode: 'start' | 'end';
    dateFormat: string;
    isBlurredRef: RefObject<boolean>;
    onChange?: (value: Date | null) => void;
    onBlur?: (e: BlurEvent) => void;
    onFocus?: (e: FocusEvent) => void;
};

export function useDateFieldState({
    value,
    validRange,
    inputMode,
    dateFormat,
    isBlurredRef,
    onChange,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
}: Props) {
    const { isDisabled, isWithinValidRange } = useRangeChecker(validRange);
    const [formattedValue, setFormattedValue] = useState(() => formatValue(value, dateFormat));
    const formattedValueRef = useLatest(formattedValue);

    const onChangeText = useCallback(
        (date: string) => {
            const parsedDate = parse(date, dateFormat, new Date());

            setFormattedValue(
                isBlurredRef.current
                    ? isValid(parsedDate)
                        ? date
                        : formattedValueRef.current
                    : date,
            );

            if (!isValid(parsedDate)) {
                onChange?.(date ? value ?? null : null);
                return;
            }

            const finalDate = inputMode === 'end' ? endOfDay(parsedDate) : parsedDate;

            if (isDisabled(finalDate) || !isWithinValidRange(finalDate)) {
                onChange?.(null);
                return;
            }

            onChange?.(finalDate);
        },
        [
            dateFormat,
            formattedValueRef,
            inputMode,
            isBlurredRef,
            isDisabled,
            isWithinValidRange,
            onChange,
            value,
        ],
    );

    const onBlur = useCallback(
        (e: BlurEvent) => {
            isBlurredRef.current = true;
            onBlurProp?.(e);
            formattedValueRef.current = formatValue(value, dateFormat);
            setFormattedValue(formattedValueRef.current);
        },
        [dateFormat, formattedValueRef, isBlurredRef, onBlurProp, value],
    );

    const onFocus = useCallback(
        (e: FocusEvent) => {
            isBlurredRef.current = false;
            onFocusProp?.(e);
        },
        [isBlurredRef, onFocusProp],
    );

    useEffect(() => {
        if (!isBlurredRef.current) return;

        setFormattedValue(formatValue(value, dateFormat));
    }, [value, dateFormat, isBlurredRef]);

    return {
        formattedValue,
        onChangeText,
        onBlur,
        onFocus,
    };
}
