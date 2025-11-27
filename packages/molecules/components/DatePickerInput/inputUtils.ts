import { type RefObject, useCallback, useEffect, useState } from 'react';
import type { BlurEvent, FocusEvent } from 'react-native';

import { useLatest } from '../../hooks';
import { endOfDay, format, isValid, parse } from '../../utils/date-fns';
import { isNil } from '../../utils/lodash';
import type { ValidRangeType } from '../DatePickerInline';
import { useRangeChecker } from '../DatePickerInline/dateUtils';

const formatValue = (value: Date | null | undefined, dateFormat: string) =>
    !isNil(value) ? format(value, dateFormat) || '' : '';

export default function useDateInput({
    // locale,
    value,
    validRange,
    inputMode = 'start',
    onChange,
    dateFormat,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    isBlurredRef,
}: {
    onChange?: (d: Date | null) => void;
    onBlur?: (e: BlurEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    // locale: undefined | string;
    value?: Date | null;
    validRange?: ValidRangeType;
    inputMode: 'start' | 'end';
    dateFormat: string;
    isBlurredRef: RefObject<boolean>;
}) {
    const { isDisabled, isWithinValidRange } = useRangeChecker(validRange);

    const [formattedValue, setFormattedValue] = useState(() => formatValue(value, dateFormat));
    const formattedValueRef = useLatest(formattedValue);

    // const [error, setError] = useState<null | string>(null);

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
                // TODO: Translate
                // setError(`Date format must be ${dateFormat}`);
                onChange?.(date ? value ?? null : null);

                return;
            }

            const finalDate = inputMode === 'end' ? endOfDay(parsedDate) : parsedDate;

            if (isDisabled(finalDate)) {
                // TODO: Translate
                // setError('Day is not allowed');
                onChange?.(null);

                return;
            }
            if (!isWithinValidRange(finalDate)) {
                // TODO: Translate
                // const errors =
                //     validStart && validEnd
                //         ? [
                //               `${`Must be between ${format(validStart, dateFormat)} - ${format(
                //                   validEnd,
                //                   dateFormat,
                //               )})`}`,
                //           ]
                //         : [
                //               validStart ? `Must be later then ${validStart}` : '',
                //               validEnd ? `Must be earlier then ${validEnd}` : '',
                //           ];

                // setError(errors.filter(n => n).join(' '));
                onChange?.(null);

                return;
            }

            onChange?.(finalDate);
            // setError(null);
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
        onChange,
        // error,
        formattedValue,
        onChangeText,
        onBlur,
        onFocus,
    };
}
