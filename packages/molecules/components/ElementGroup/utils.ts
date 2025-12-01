import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const elementGroupStylesDefault = StyleSheet.create(theme => ({
    root: {
        borderRadius: theme.shapes.corner.extraSmall,
        variants: {
            orientation: {
                horizontal: {
                    flexDirection: 'row',
                },
                vertical: {
                    flexDirection: 'column',
                },
            },
        },
    },
}));

export const elementGroupStyles = getRegisteredComponentStylesWithFallback(
    'ElementGroup',
    elementGroupStylesDefault,
);
