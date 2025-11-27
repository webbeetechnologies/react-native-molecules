import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

// type States = 'disabled' | 'hovered';

const linkStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.primary,
        ...theme.typescale.labelLarge,

        _web: {
            cursor: 'pointer',
            _hover: {
                textDecorationLine: 'underline',
            },
        },

        variants: {
            state: {
                disabled: {
                    color: theme.colors.onSurfaceDisabled,
                    opacity: 0.38,

                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                default: {},
            },
        },
    },
}));

registerComponentsStyles({
    Link: linkStylesDefault,
});

export const linkStyles = getRegisteredMoleculesComponentStyles('Link');
