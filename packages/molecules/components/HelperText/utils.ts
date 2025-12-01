import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export const helperTextStylesDefault = StyleSheet.create(theme => ({
    root: {
        fontSize: theme.typescale.bodySmall.fontSize,
        paddingVertical: theme.spacings['1'],
        paddingHorizontal: theme.spacings['4'],

        variants: {
            variant: {
                error: {
                    color: theme.colors.error,
                },
                info: {
                    color: theme.colors.onSurfaceVariant,
                },
            },
        },
    },
}));

export const styles = getRegisteredComponentStylesWithFallback(
    'HelperText',
    helperTextStylesDefault,
);
