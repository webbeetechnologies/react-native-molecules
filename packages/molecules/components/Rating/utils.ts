import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

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

registerComponentsStyles({
    Rating: ratingStylesDefault,
    Rating_Item: ratingItemStylesDefault,
});

export const ratingStyles = getRegisteredMoleculesComponentStyles('Rating');
export const ratingItemStyles = getRegisteredMoleculesComponentStyles('Rating_Item');
