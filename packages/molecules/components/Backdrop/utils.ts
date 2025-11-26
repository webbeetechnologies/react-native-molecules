import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const backdropStylesDefault = StyleSheet.create({
    root: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgb(0, 0, 0)',
        opacity: 0.3,
    },
});

registerComponentsStyles({
    Backdrop: backdropStylesDefault,
});

export const backdropStyles = getRegisteredMoleculesComponentStyles('Backdrop');
