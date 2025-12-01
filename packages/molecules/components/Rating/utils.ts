import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export type States = 'activeAndDisabled' | 'active' | 'disabled' | 'readonly' | 'activeAndReadonly';

const ratingStylesDefault = StyleSheet.create({
    root: {
        flexDirection: 'row',
    },
});

const ratingItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                disabled: {
                    color: theme.colors.disabled,
                    opacity: 0.38,
                },
                activeAndDisabled: {
                    opacity: 0.38,
                },
                readonly: {},
            },
        },
    },
}));

export const ratingStyles = getRegisteredComponentStylesWithFallback('Rating', ratingStylesDefault);
export const ratingItemStyles = getRegisteredComponentStylesWithFallback(
    'Rating_Item',
    ratingItemStylesDefault,
);
