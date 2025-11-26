import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BlurEvent, FocusEvent } from 'react-native';

import { useToggle } from '../../hooks';
import { IconButton, type IconButtonProps } from '../IconButton';
import { TextInput, type TextInputProps } from '../TextInput';
import type { TimePickerModalProps } from '../TimePickerModal';
import { TimePickerModal } from '../TimePickerModal/TimePickerModal';
import { sanitizeTime } from './sanitizeTime';
import { getFormattedTime, getOutputTime, styles, timeFormat } from './utils';

export type Props = TextInputProps & {
    time: string;
    onTimeChange: (time: string) => void;
    is24Hour?: boolean;
    withModal?: boolean;
    modalProps?: Omit<TimePickerModalProps, 'time' | 'onConfirm' | 'isOpen' | 'onClose' | 'ref'>;
    iconButtonProps?: Omit<Partial<IconButtonProps>, 'onPress' | 'ref'>;
};

const TimePickerField = (
    {
        time,
        onTimeChange: onTimeChangeProp,
        is24Hour = false,
        withModal = true,
        style,
        onBlur: onBlurProp,
        modalProps = {},
        iconButtonProps = {},
        disabled,
        onFocus: onFocusProp,
        ...rest
    }: Props,
    ref: any,
) => {
    const componentStyles = useMemo(() => [styles.root, style], [style]);

    const [timeString, setTimeString] = useState(() => getFormattedTime({ time, is24Hour }));
    const isBlurredRef = useRef(true);

    const currentTimeFormat = useMemo(() => timeFormat[!is24Hour ? '12' : '24'], [is24Hour]);

    const { state: isOpen, handleOpen: onOpenModal, handleClose: onCloseModal } = useToggle(false);

    const onChangeText = useCallback(
        (_text: string) => {
            const text = sanitizeTime(_text, is24Hour);
            setTimeString(_text);

            if (disabled || !text) return;

            const outputTime = getOutputTime({ time: text || time, is24Hour });

            onTimeChangeProp(outputTime);
        },
        [disabled, is24Hour, onTimeChangeProp, time],
    );

    const onConfirmTime = useCallback(
        (newTime: string) => {
            onCloseModal();

            onTimeChangeProp(newTime);
        },
        [onTimeChangeProp, onCloseModal],
    );

    const onBlur = useCallback(
        (e: BlurEvent) => {
            isBlurredRef.current = true;
            onBlurProp?.(e);

            if (disabled) return;

            // const outputTime = getOutputTime({ time: timeString || time, is24Hour });
            // onTimeChangeProp(outputTime);

            // if (time === outputTime) {
            setTimeString(sanitizeTime(getFormattedTime({ time, is24Hour }), is24Hour));
            // }
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

    const rightElement = useMemo(() => {
        if (!withModal) return null;

        return (
            <>
                <IconButton
                    name="clock-outline"
                    onPress={onOpenModal}
                    disabled={disabled}
                    {...iconButtonProps}
                />
                <TimePickerModal
                    {...modalProps}
                    time={getFormattedTime({ time: time, is24Hour: true })}
                    isOpen={isOpen}
                    onClose={onCloseModal}
                    onConfirm={onConfirmTime}
                    is24Hour={is24Hour}
                />
            </>
        );
    }, [
        disabled,
        iconButtonProps,
        is24Hour,
        isOpen,
        modalProps,
        onCloseModal,
        onConfirmTime,
        onOpenModal,
        time,
        withModal,
    ]);

    // only change masked string when the input is not focus so as to not interrup the user
    useEffect(() => {
        if (!isBlurredRef.current) return;

        setTimeString(getFormattedTime({ time, is24Hour }));
    }, [is24Hour, time]);

    return (
        <TextInput
            ref={ref}
            placeholder={currentTimeFormat.format}
            {...rest}
            disabled={disabled}
            value={timeString}
            onFocus={onFocus}
            onChangeText={onChangeText}
            style={componentStyles}
            onBlur={onBlur}
            right={rightElement}
        />
    );
};

export default memo(forwardRef(TimePickerField));
