import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { format } from '../../utils/date-fns';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Modal, type ModalProps } from '../Modal';
import { Portal } from '../Portal';
import { Text } from '../Text';
import TimePicker from '../TimePicker/TimePicker';
import {
    clockTypes,
    getTimeInputTypeIcon,
    inputTypes,
    type PossibleClockTypes,
    type PossibleInputTypes,
    reverseInputTypes,
} from '../TimePicker/timeUtils';
import { styles } from './utils';

export type Props = Omit<ModalProps, 'children'> & {
    is24Hour?: boolean;
    label?: string;
    uppercase?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    time?: string;
    onConfirm: (time: string) => any;
    keyboardIcon?: string;
    clockIcon?: string;
    isLandscape?: boolean;
};

export function TimePickerModal({
    isOpen,
    onClose,
    onConfirm: onConfirmProp,
    time: timeProp,
    label = 'Select time',
    uppercase = false,
    cancelLabel = 'Cancel',
    confirmLabel = 'Ok',
    is24Hour,
    keyboardIcon = 'keyboard-outline',
    clockIcon = 'clock-outline',
    isLandscape = false,
    style,
    ...rest
}: Props) {
    const [inputType, setInputType] = useState<PossibleInputTypes>(inputTypes.picker);
    const [focused, setFocused] = useState<PossibleClockTypes>(clockTypes.hours);
    const [time, setTime] = useState(() => timeProp || format(new Date(), 'HH:mm'));

    const modelStyle = useMemo(() => [styles.modalContent, style], [style]);

    const onFocusInput = useCallback((type: PossibleClockTypes) => setFocused(type), []);

    const onChange = useCallback(
        (params: { focused?: PossibleClockTypes | undefined; time: string }) => {
            if (params.focused) {
                setFocused(params.focused);
            }

            setTime(params.time);
        },
        [setFocused, setTime],
    );

    const onConfirm = useCallback(() => onConfirmProp(time), [onConfirmProp, time]);

    useEffect(() => {
        setTime(timeProp || format(new Date(), 'HH:mm'));
    }, [timeProp]);

    return (
        <Portal>
            <Modal {...rest} isOpen={isOpen} style={modelStyle} onClose={onClose}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>{uppercase ? label.toUpperCase() : label}</Text>
                    </View>
                    <View style={styles.timePickerContainer}>
                        <TimePicker
                            is24Hour={is24Hour}
                            inputType={inputType}
                            focused={focused}
                            time={time}
                            onTimeChange={onChange}
                            onFocusInput={onFocusInput}
                            isLandscape={isLandscape}
                        />
                    </View>
                    <View style={styles.footer}>
                        <IconButton
                            name={getTimeInputTypeIcon(inputType, {
                                keyboard: keyboardIcon,
                                picker: clockIcon,
                            })}
                            onPress={() => setInputType(reverseInputTypes[inputType])}
                            style={styles.inputTypeToggle}
                            accessibilityLabel="toggle keyboard"
                        />
                        <View style={styles.fill} />
                        <Button onPress={onClose}>
                            <Button.Text>{cancelLabel}</Button.Text>
                        </Button>
                        <Button onPress={onConfirm}>
                            <Button.Text>{confirmLabel}</Button.Text>
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
}

export default memo(TimePickerModal);
