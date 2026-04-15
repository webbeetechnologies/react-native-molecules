import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { getRegisteredComponentWithFallback } from '../../core';
import { useControlledValue } from '../../hooks';
import { DatePickerActions, DatePickerProvider } from '../DatePicker';
import type { DatePickerContextType, DatePickerValue } from '../DatePicker/context';
import {
    DatePickerContext,
    useDatePickerContext,
    useOptionalDatePickerContext,
    withDraftLayer,
} from '../DatePicker/context';
import { IconButton } from '../IconButton';
import { Modal, type ModalProps } from '../Modal';
import { Portal } from '../Portal';
import { Text } from '../Text';
import { TimePickerContext } from './context';
import { TimePickerClock } from './TimePicker';
import {
    getTimeInputTypeIcon,
    inputTypes,
    type PossibleInputTypes,
    reverseInputTypes,
} from './timeUtils';
import { timePickerModalStyles as styles } from './utils';

export type TimePickerModalProps = Omit<ModalProps, 'children' | 'isOpen' | 'onClose'> & {
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    value?: DatePickerValue;
    onChange?: (value: DatePickerValue) => void;
    is24Hour?: boolean;
    inputType?: PossibleInputTypes;
    defaultInputType?: PossibleInputTypes;
    onInputTypeChange?: (next: PossibleInputTypes) => void;
    label?: string;
    uppercase?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    keyboardIcon?: string;
    clockIcon?: string;
    /** Override the surface default draft mode. Modal defaults to `true` (staged commit). */
    draft?: boolean;
};

type BodyProps = Omit<
    TimePickerModalProps,
    'isOpen' | 'onClose' | 'value' | 'onChange' | 'is24Hour' | 'draft'
>;

function TimePickerModalBody({
    children,
    style,
    label = 'Select time',
    uppercase = false,
    cancelLabel = 'Cancel',
    confirmLabel = 'OK',
    keyboardIcon = 'keyboard-outline',
    clockIcon = 'clock-outline',
    inputType: inputTypeProp,
    defaultInputType = inputTypes.picker,
    onInputTypeChange,
    ...rest
}: BodyProps) {
    const ctx = useDatePickerContext();
    const [inputType, setInputType] = useControlledValue<PossibleInputTypes>({
        value: inputTypeProp,
        defaultValue: defaultInputType,
        onChange: onInputTypeChange,
    });

    const tpContextValue = useMemo(() => ({ inputType, setInputType }), [inputType, setInputType]);

    const modalStyle = useMemo(() => [styles.modalContent, style], [style]);

    return (
        <Portal>
            <TimePickerContext value={tpContextValue}>
                <Modal {...rest} isOpen={ctx.open} onClose={ctx.cancel} style={modalStyle}>
                    <KeyboardAvoidingView
                        style={styles.keyboardView}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <View style={styles.frame}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    {uppercase ? label.toUpperCase() : label}
                                </Text>
                            </View>
                            <View style={styles.timePickerContainer}>
                                {children ?? <TimePickerClock />}
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
                                <DatePickerActions
                                    cancelLabel={cancelLabel}
                                    confirmLabel={confirmLabel}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </TimePickerContext>
        </Portal>
    );
}

function TimePickerModalLayer({
    base,
    draft: draftProp,
    bodyProps,
}: {
    base: DatePickerContextType;
    draft: boolean | undefined;
    bodyProps: BodyProps;
}) {
    const effectiveDraft = draftProp ?? base.providerDraft ?? true;
    const ctx = useMemo(() => withDraftLayer(base, effectiveDraft), [base, effectiveDraft]);
    if (!base.open) return null;
    return (
        <DatePickerContext value={ctx}>
            <TimePickerModalBody {...bodyProps} />
        </DatePickerContext>
    );
}

function TimePickerModalAdapter({
    draft,
    bodyProps,
}: {
    draft: boolean | undefined;
    bodyProps: BodyProps;
}) {
    const base = useDatePickerContext();
    return <TimePickerModalLayer base={base} draft={draft} bodyProps={bodyProps} />;
}

const TimePickerModalDefault = memo(
    ({
        isOpen: isOpenProp,
        onClose: onCloseProp,
        value: valueProp,
        onChange: onChangeProp,
        is24Hour,
        draft: draftProp,
        ...rest
    }: TimePickerModalProps) => {
        const outer = useOptionalDatePickerContext();

        if (outer) {
            return <TimePickerModalLayer base={outer} draft={draftProp} bodyProps={rest} />;
        }

        return (
            <DatePickerProvider
                mode="time"
                value={valueProp}
                onChange={onChangeProp}
                open={isOpenProp}
                onOpenChange={next => {
                    if (!next) onCloseProp?.();
                }}
                is24Hour={is24Hour}>
                <TimePickerModalAdapter draft={draftProp} bodyProps={rest} />
            </DatePickerProvider>
        );
    },
);

export const TimePickerModal = getRegisteredComponentWithFallback(
    'TimePickerModal',
    TimePickerModalDefault,
);

export default TimePickerModal;
