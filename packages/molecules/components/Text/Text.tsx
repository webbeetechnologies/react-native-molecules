import { StyleSheet } from 'react-native-unistyles';

import {
    getRegisteredComponentStylesWithFallback,
    getRegisteredComponentWithFallback,
} from '../../core';
import { textFactory } from './textFactory';

const defaultStyles = StyleSheet.create(theme => ({
    root: { color: theme.colors.onSurface, ...theme.typescale.bodyMedium },
}));

const TextDefault = textFactory(
    getRegisteredComponentStylesWithFallback('Text', defaultStyles) as any,
);

export default getRegisteredComponentWithFallback('Text', TextDefault);
