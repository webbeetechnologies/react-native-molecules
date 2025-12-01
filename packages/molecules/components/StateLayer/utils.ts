import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const stateLayerStylesDefault = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: -1,
    },
});

export const stateLayerStyles = getRegisteredComponentStylesWithFallback(
    'StateLayer',
    stateLayerStylesDefault,
);
