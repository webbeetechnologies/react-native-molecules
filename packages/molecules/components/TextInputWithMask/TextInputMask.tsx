import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { BlurEvent } from 'react-native';

import { TextInput, type TextInputProps } from '../TextInput';
import { enhanceTextWithMask } from './utils';

export type Props = Omit<TextInputProps, 'onChangeText'> & {
    mask: string;
    onChangeText?: (text: string) => void;
};

// TODO - make it more universal
function TextInputWithMask(
    { onChangeText: onChangeTextProp, value = '', mask, onBlur: onBlurProp, ...rest }: Props,
    ref: any,
) {
    const [controlledValue, setControlledValue] = useState<string>(value || '');

    const inputRef = useRef(null);

    const onChangeText = useCallback(
        (text: string) => {
            const enhancedText = enhanceTextWithMask(text, mask, controlledValue);
            setControlledValue(enhancedText);
            onChangeTextProp?.(enhancedText);
        },
        [controlledValue, mask, onChangeTextProp],
    );

    const onBlur = useCallback(
        (e: BlurEvent) => {
            onBlurProp?.(e);
            onChangeTextProp?.(controlledValue);
        },
        [controlledValue, onBlurProp, onChangeTextProp],
    );

    useEffect(() => {
        setControlledValue(value || '');
    }, [value]);

    useImperativeHandle(ref, () =>
        Object.assign(inputRef?.current || {}, { setDisplayValue: setControlledValue }),
    );

    return (
        <TextInput
            ref={inputRef}
            {...rest}
            value={controlledValue}
            onChangeText={onChangeText}
            onBlur={onBlur}
        />
    );
}

export default forwardRef(TextInputWithMask);
