import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const tooltipStylesDefault = StyleSheet.create(theme => ({
    content: {
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.shapes.corner.extraSmall,
        padding: theme.spacings['2'],
    },
    contentText: {
        color: theme.colors.onSurface,
        ...theme.typescale.bodySmall,
    },
}));

registerComponentsStyles({
    Tooltip: tooltipStylesDefault,
});

export const tooltipStyles = getRegisteredMoleculesComponentStyles('Tooltip');
