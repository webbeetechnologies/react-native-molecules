import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const stateLayerStylesDefault = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: -1,
    },
});

registerComponentsStyles({
    StateLayer: stateLayerStylesDefault,
});

export const stateLayerStyles = getRegisteredMoleculesComponentStyles('StateLayer');
