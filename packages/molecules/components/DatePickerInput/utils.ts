import { createContext } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export type DatePickerInputContextType = {
    onPressTrigger: () => void;
};

export const DatePickerInputContext = createContext<DatePickerInputContextType>({
    onPressTrigger: () => {},
});

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
