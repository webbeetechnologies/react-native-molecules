import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const filePickerStylesDefault = StyleSheet.create({
    root: {},
});

export const defaultStyles = getRegisteredComponentStylesWithFallback(
    'FilePicker',
    filePickerStylesDefault,
);
