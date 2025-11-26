import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const avatarStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
    },
    icon: {
        color: '#ffffff',
        // color: theme.colors.onPrimary,
    },
    label: {
        fontSize: theme.typescale.titleMedium.fontSize,
        fontWeight: theme.typescale.titleMedium.fontWeight,
        lineHeight: theme.typescale.titleMedium.lineHeight,
        textTransform: 'uppercase',
        color: '#ffffff',
    },
}));

registerComponentsStyles({
    Avatar: avatarStylesDefault,
});

export const avatarStyles = getRegisteredMoleculesComponentStyles('Avatar');
