import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const dateTimePickerStylesDefault = StyleSheet.create({
    container: {},
});

registerComponentsStyles({
    DateTimePicker: dateTimePickerStylesDefault,
});

export const dateTimePickerStyles = getRegisteredMoleculesComponentStyles('DateTimePicker');
