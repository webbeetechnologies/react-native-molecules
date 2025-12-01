import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const datePickerInputStylesDefault = StyleSheet.create({
    root: {
        minWidth: 150,
        justifyContent: 'center',
    },
});

export const datePickerInputStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerInput',
    datePickerInputStylesDefault,
);
