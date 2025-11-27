import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

import { formatNumberWithMask, normalizeToNumberString } from '../utils';
import { isNil } from '../utils/lodash';
import usePrevious from './usePrevious';

export type NumberMaskConfig = {
    prefix?: string;
    suffix?: string;
    delimiter?: string;
    separator?: string;
    precision?: number;
    allowNegative?: boolean;
};

type DefaultPropsT = { [key: string]: any };

export type UseHandleNumberFormatProps<T extends DefaultPropsT = DefaultPropsT> = T & {
    value: number | null;
    onChangeText: (newValue: number | null) => void;
    config?: NumberMaskConfig;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    formatInitialValue?: boolean;
};

const useHandleNumberFormat = <T extends DefaultPropsT = DefaultPropsT>({
    value: valueProp,
    onChangeText: onChangeTextProp,
    config,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    formatInitialValue = true,
    ...rest
}: UseHandleNumberFormatProps<T>) => {
    const [displayValue, setDisplayValue] = useState(() =>
        !isNil(valueProp)
            ? formatInitialValue
                ? `${formatNumberWithMask({ number: valueProp, ...config })}`
                : `${valueProp}`
            : '',
    );

    const [isBlur, setIsBlur] = useState(true);

    const firstRenderRef = useRef(true);

    const isFirstRender = usePrevious(firstRenderRef.current);

    const onChangeText = useCallback(
        (text: string) => {
            const normalizedNumberString = normalizeToNumberString({ text, ...config });

            onChangeTextProp(
                normalizedNumberString === ''
                    ? null
                    : +normalizeToNumberString({ text, ...config }),
            );
            setDisplayValue(text);
        },
        [config, onChangeTextProp],
    );

    const onBlur = useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            onBlurProp?.(e);

            setDisplayValue(`${formatNumberWithMask({ number: valueProp, ...config })}`);
            setIsBlur(true);
        },
        [config, onBlurProp, valueProp],
    );

    const onFocus = useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            onFocusProp?.(e);

            setIsBlur(false);
        },
        [onFocusProp],
    );

    useEffect(() => {
        firstRenderRef.current = false;
    });

    useEffect(() => {
        if (!isBlur || isFirstRender.current) return;

        setDisplayValue(`${formatNumberWithMask({ number: valueProp, ...config })}`);
    }, [config, formatInitialValue, isBlur, isFirstRender, valueProp]);

    return useMemo(
        () => ({
            value: displayValue,
            onChangeText: onChangeText,
            onFocus,
            onBlur,
            ...rest,
        }),
        [displayValue, onBlur, onChangeText, onFocus, rest],
    );
};

export default useHandleNumberFormat;
