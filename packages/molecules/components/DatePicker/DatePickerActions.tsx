import { useCallback } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
    getRegisteredComponentStylesWithFallback,
    getRegisteredComponentWithFallback,
} from '../../core';
import { Button } from '../Button';
import { useDatePickerContext } from './context';

export type DatePickerActionsProps = {
    cancelLabel?: string;
    confirmLabel?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
};

function DatePickerActionsDefault({
    cancelLabel = 'Cancel',
    confirmLabel = 'OK',
    onCancel,
    onConfirm,
}: DatePickerActionsProps) {
    const { draft, commit, cancel } = useDatePickerContext();

    const handleCancel = useCallback(() => {
        onCancel?.();
        cancel();
    }, [onCancel, cancel]);

    const handleConfirm = useCallback(() => {
        onConfirm?.();
        commit();
    }, [onConfirm, commit]);

    if (!draft) return null;

    return (
        <View style={datePickerActionsStyles.footer}>
            <Button variant="text" onPress={handleCancel}>
                <Button.Text>{cancelLabel}</Button.Text>
            </Button>
            <Button variant="text" onPress={handleConfirm}>
                <Button.Text>{confirmLabel}</Button.Text>
            </Button>
        </View>
    );
}

export default DatePickerActionsDefault;

export const DatePickerActions = getRegisteredComponentWithFallback(
    'DatePickerActions',
    DatePickerActionsDefault,
);

const datePickerActionsStylesDefault = StyleSheet.create(theme => ({
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        columnGap: theme.spacings['2'],
        paddingHorizontal: theme.spacings['4'],
        paddingTop: theme.spacings['0'],
        paddingBottom: theme.spacings['2'],
    },
}));

const datePickerActionsStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerActions',
    datePickerActionsStylesDefault,
);
