import { useCallback, useEffect, useRef, useState } from 'react';
import type { BlurEvent, FocusEvent } from 'react-native';

import { getFormattedTime, getOutputTime, sanitizeTime } from './utils';

type Props = {
    time: string;
    is24Hour: boolean;
    disabled?: boolean;
    onChange?: (time: string) => void;
    onBlur?: (e: BlurEvent) => void;
    onFocus?: (e: FocusEvent) => void;
};

export function useTimeFieldState({
    time,
    is24Hour,
    disabled,
    onChange,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
}: Props) {
    const [timeString, setTimeString] = useState(() => getFormattedTime({ time, is24Hour }));
    const isBlurredRef = useRef(true);

    const onChangeText = useCallback(
        (_text: string) => {
            const text = sanitizeTime(_text, is24Hour);
            setTimeString(_text);

            if (disabled || !text) return;

            onChange?.(getOutputTime({ time: text || time, is24Hour }));
        },
        [disabled, is24Hour, onChange, time],
    );

    const onBlur = useCallback(
        (e: BlurEvent) => {
            isBlurredRef.current = true;
            onBlurProp?.(e);

            if (disabled) return;

            setTimeString(sanitizeTime(getFormattedTime({ time, is24Hour }), is24Hour));
        },
        [disabled, is24Hour, onBlurProp, time],
    );

    const onFocus = useCallback(
        (e: FocusEvent) => {
            isBlurredRef.current = false;
            onFocusProp?.(e);
        },
        [onFocusProp],
    );

    useEffect(() => {
        if (!isBlurredRef.current) return;

        setTimeString(getFormattedTime({ time, is24Hour }));
    }, [is24Hour, time]);

    return {
        timeString,
        onChangeText,
        onBlur,
        onFocus,
    };
}
