import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const filePickerStylesDefault = StyleSheet.create({
    root: {},
});

registerComponentsStyles({
    FilePicker: filePickerStylesDefault,
});

export const defaultStyles = getRegisteredMoleculesComponentStyles('FilePicker');
