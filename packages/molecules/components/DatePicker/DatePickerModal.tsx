import type { ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import {
    Platform,
    StatusBar,
    type StatusBarStyle,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';

import { getRegisteredComponentWithFallback } from '../../core';
import { format } from '../../utils/date-fns';
import { DateField } from '../DateField';
import { IconButton } from '../IconButton';
import { Modal, type ModalProps } from '../Modal';
import { Portal } from '../Portal';
import { Text } from '../Text';
import { TextInput } from '../TextInput';
import type { DatePickerContextType, DatePickerValue } from './context';
import {
    DatePickerContext,
    useDatePickerContext,
    useOptionalDatePickerContext,
    withDraftLayer,
} from './context';
import { DateCalendar } from './DateCalendar';
import { DatePickerActions } from './DatePickerActions';
import { DatePickerProvider } from './DatePickerProvider';
import { datePickerModalStyles } from './utils';

export type DatePickerModalProps = Omit<ModalProps, 'children' | 'isOpen' | 'onClose'> & {
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    value?: DatePickerValue;
    onChange?: (value: DatePickerValue) => void;
    label?: string;
    disableStatusBar?: boolean;
    disableStatusBarPadding?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    editIcon?: string;
    calendarIcon?: string;
    headerLayout?: 'inline' | 'docked';
    /** Override the surface default draft mode. Modal defaults to `true` (staged commit). */
    draft?: boolean;
};

type BodyProps = Omit<DatePickerModalProps, 'isOpen' | 'onClose' | 'value' | 'onChange' | 'draft'>;

function DatePickerModalBody({
    children,
    style,
    label = 'Select date',
    disableStatusBar,
    disableStatusBarPadding,
    confirmLabel = 'OK',
    cancelLabel = 'Cancel',
    editIcon = 'pencil',
    calendarIcon = 'calendar',
    headerLayout,
    ...rest
}: BodyProps) {
    const ctx = useDatePickerContext();
    const dimensions = useWindowDimensions();
    const [editing, setEditing] = useState(false);

    const { containerStyle, headerStyle, barStyle, modalStyle } = useMemo(() => {
        const isHeaderBackgroundLight = true;
        return {
            containerStyle: [StyleSheet.absoluteFill, styles.container],
            headerStyle: [
                datePickerModalStyles.headlineContainer,
                {
                    paddingTop:
                        disableStatusBarPadding || Platform.OS !== 'android'
                            ? datePickerModalStyles.headlineContainer.paddingTop
                            : (datePickerModalStyles.headlineContainer.paddingTop as number) +
                              (StatusBar.currentHeight || 0),
                },
            ],
            barStyle: (isHeaderBackgroundLight
                ? 'dark-content'
                : 'light-content') as StatusBarStyle,
            modalStyle: [
                datePickerModalStyles.content,
                dimensions.width > 650 ? { maxHeight: 600 } : { borderRadius: 0 },
                style,
            ],
        };
    }, [dimensions.width, disableStatusBarPadding, style]);

    const draft =
        ctx.draftValue && typeof ctx.draftValue === 'object' && 'start' in ctx.draftValue
            ? null
            : ctx.draftValue;

    const summaryLabel = useMemo(() => {
        if (editing) return 'Enter dates';
        if (!draft) return 'Select date';
        return format(draft, 'EEE, MMM d');
    }, [draft, editing]);

    const body = editing ? (
        <View style={datePickerModalStyles.inputContainer}>
            <DateField autoFocus>
                <TextInput.Label>Date</TextInput.Label>
            </DateField>
        </View>
    ) : (
        children ?? <DateCalendar headerLayout={headerLayout} showOutsideDays={false} />
    );

    return (
        <View style={containerStyle} pointerEvents="box-none">
            <Portal>
                <Modal
                    {...rest}
                    isOpen={ctx.open}
                    onClose={ctx.cancel}
                    style={modalStyle}
                    elevation={0}>
                    <>
                        {disableStatusBar ? null : (
                            <StatusBar translucent={true} barStyle={barStyle} />
                        )}
                        <View style={datePickerModalStyles.frame}>
                            <View style={headerStyle}>
                                <View style={datePickerModalStyles.headerCopy}>
                                    <Text style={datePickerModalStyles.headline}>{label}</Text>
                                    <Text
                                        style={datePickerModalStyles.supporting}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit={true}>
                                        {summaryLabel}
                                    </Text>
                                </View>
                                <IconButton
                                    name={editing ? calendarIcon : editIcon}
                                    accessibilityLabel={
                                        editing ? 'Show calendar' : 'Enter date manually'
                                    }
                                    onPress={() => setEditing(prev => !prev)}
                                    style={datePickerModalStyles.modeToggle}
                                />
                            </View>
                            <View style={datePickerModalStyles.body}>{body}</View>
                            <DatePickerActions
                                cancelLabel={cancelLabel}
                                confirmLabel={confirmLabel}
                            />
                        </View>
                    </>
                </Modal>
            </Portal>
        </View>
    );
}

function DatePickerModalLayer({
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
            <DatePickerModalBody {...bodyProps} />
        </DatePickerContext>
    );
}

function DatePickerModalAdapter({
    draft,
    bodyProps,
}: {
    draft: boolean | undefined;
    bodyProps: BodyProps;
}) {
    const base = useDatePickerContext();
    return <DatePickerModalLayer base={base} draft={draft} bodyProps={bodyProps} />;
}

function DatePickerModalInner({
    isOpen: isOpenProp,
    onClose: onCloseProp,
    value: valueProp,
    onChange: onChangeProp,
    draft: draftProp,
    ...rest
}: DatePickerModalProps) {
    const outer = useOptionalDatePickerContext();

    const onOpenChange = useCallback(
        (next: boolean) => {
            if (!next) onCloseProp?.();
        },
        [onCloseProp],
    );

    if (outer) {
        return <DatePickerModalLayer base={outer} draft={draftProp} bodyProps={rest} />;
    }

    return (
        <DatePickerProvider
            value={valueProp}
            onChange={onChangeProp}
            open={isOpenProp}
            onOpenChange={onOpenChange}>
            <DatePickerModalAdapter draft={draftProp} bodyProps={rest} />
        </DatePickerProvider>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'transparent' },
});

const DatePickerModalDefault = memo(DatePickerModalInner);

export default DatePickerModalDefault;

export const DatePickerModal = getRegisteredComponentWithFallback(
    'DatePickerModal',
    DatePickerModalDefault,
);
