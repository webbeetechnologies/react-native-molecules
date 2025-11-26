import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const datePickerInputStylesDefault = StyleSheet.create({
    root: {
        minWidth: 150,
        justifyContent: 'center',
    },
});

registerComponentsStyles({
    DatePickerInput: datePickerInputStylesDefault,
});

export const datePickerInputStyles = getRegisteredMoleculesComponentStyles('DatePickerInput');
