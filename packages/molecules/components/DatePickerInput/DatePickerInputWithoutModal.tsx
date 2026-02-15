import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef } from 'react';

import { TextInputWithMask } from '../TextInputWithMask';
import useDateInput from './inputUtils';
import type { DatePickerInputWithoutModalProps } from './types';
import { datePickerInputStyles } from './utils';

function DatePickerInputWithoutModal(
    {
        value,
        onChange: onChangeProp,
        // locale = 'en',
        validRange,
        inputMode,
        dateFormat = 'dd/MM/yyyy',
        style,
        onBlur: onBlurProp,
        onFocus: onFocusProp,
        ...rest
    }: DatePickerInputWithoutModalProps,
    ref: any,
) {
    const inputRef = useRef(null);
    const isBlurredRef = useRef(true);

    const onChange = useCallback(
        (date: Date | null) => {
            // because onChange was already trigger not need to trigger again on
            if (!isBlurredRef.current) {
                onChangeProp?.(date);
            }

            if (!date && isBlurredRef.current) (inputRef.current as any)?.setDisplayValue('');
        },
        [onChangeProp],
    );

    const { formattedValue, onChangeText, onBlur, onFocus } = useDateInput({
        // locale,
        value,
        validRange,
        inputMode,
        onChange,
        dateFormat,
        onBlur: onBlurProp,
        onFocus: onFocusProp,
        isBlurredRef,
    });

    const inputStyle = useMemo(() => [datePickerInputStyles.root, style], [style]);

    useImperativeHandle(ref, () => inputRef.current);

    return (
        <TextInputWithMask
            placeholder={dateFormat}
            style={inputStyle}
            {...rest}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={inputRef}
            value={formattedValue}
            keyboardType={'number-pad'}
            mask={dateFormat}
            onChangeText={onChangeText}
            // keyboardAppearance={theme.dark ? 'dark' : 'default'}
            // error={formattedValue ? !!error : false}
            // supportingText={formattedValue ? error || undefined : undefined}
        />
    );
}

export default memo(forwardRef(DatePickerInputWithoutModal));
