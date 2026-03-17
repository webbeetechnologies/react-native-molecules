import { createContext } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export type FilePickerContextType = {
    onPressTrigger: () => void;
};

export const FilePickerContext = createContext<FilePickerContextType>({
    onPressTrigger: () => {},
});

const filePickerStylesDefault = StyleSheet.create({
    root: {},
});

export const defaultStyles = getRegisteredComponentStylesWithFallback(
    'FilePicker',
    filePickerStylesDefault,
);
