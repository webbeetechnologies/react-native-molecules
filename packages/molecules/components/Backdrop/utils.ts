import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

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

export const backdropStyles = getRegisteredComponentStylesWithFallback(
    'Backdrop',
    backdropStylesDefault,
);
