import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const dateTimePickerStylesDefault = StyleSheet.create({
    container: {},
});

export const dateTimePickerStyles = getRegisteredComponentStylesWithFallback(
    'DateTimePicker',
    dateTimePickerStylesDefault,
);
