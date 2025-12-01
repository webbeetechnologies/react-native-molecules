import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

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

export const tooltipStyles = getRegisteredComponentStylesWithFallback(
    'Tooltip',
    tooltipStylesDefault,
);
