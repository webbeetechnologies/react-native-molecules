import type { TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

export type CustomProps = {
    container?: ViewStyle;
    textContainer?: ViewStyle;
    title?: TextStyle;
    description?: TextStyle;
    actionButton?: ViewStyle;
    iconButton?: TextStyle;
};

const stylesDefault = StyleSheet.create(theme => ({
    container: {
        minHeight: 48,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.shapes.corner.extraSmall,
        paddingLeft: theme.spacings['4'],
        paddingRight: theme.spacings['2'],
        paddingVertical: theme.spacings['3'],
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        width: 280,
        flexGrow: 1,
    },
    title: {
        color: theme.colors.onSurface,
        fontSize: theme.typescale.bodyMedium.fontSize,
        fontWeight: theme.typescale.bodyMedium.fontWeight,
        lineHeight: theme.typescale.bodyMedium.fontSize,
    },
    description: {
        color: theme.colors.onSurface,
        fontSize: theme.typescale.labelSmall.fontSize,
        fontWeight: theme.typescale.labelSmall.fontWeight,
        lineHeight: theme.typescale.labelSmall.fontSize,
        marginTop: theme.spacings['1'],
    },
    actionButton: {
        marginLeft: theme.spacings['3'],
        flexGrow: 1,
    },
    iconButton: {
        marginLeft: theme.spacings['3'],
        marginRight: theme.spacings['1'],
        color: theme.colors.onSurface,
    },
}));

registerComponentsStyles({
    Toast: stylesDefault,
});

export const styles = getRegisteredMoleculesComponentStyles('Toast');
