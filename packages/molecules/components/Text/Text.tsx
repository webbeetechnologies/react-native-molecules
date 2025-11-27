import { StyleSheet } from 'react-native-unistyles';

import {
    getRegisteredComponentWithFallback,
    getRegisteredMoleculesComponentStyles,
    registerComponentStyles,
    registerMoleculesComponent,
} from '../../core';
import { textFactory } from './textFactory';

const defaultStyles = StyleSheet.create(theme => ({
    root: { color: theme.colors.onSurface, ...theme.typescale.bodyMedium },
}));

registerComponentStyles('Text', defaultStyles);

const TextDefault = textFactory(
    (getRegisteredMoleculesComponentStyles('Text') as any) ?? defaultStyles,
);

registerMoleculesComponent('Text', TextDefault);

export default getRegisteredComponentWithFallback('Text', TextDefault);
