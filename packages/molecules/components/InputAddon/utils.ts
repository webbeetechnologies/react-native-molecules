import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const inputAddonStylesDefault = StyleSheet.create(theme => ({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceVariant,
        borderColor: theme.colors.outline,
        borderWidth: 1,
        borderRadius: theme.spacings['1'],
        paddingHorizontal: theme.spacings['2'],

        variants: {
            variant: {
                left: {
                    borderRightWidth: 0,
                },

                right: {
                    borderLeftWidth: 0,
                },
            },
        },
    },
}));

registerComponentsStyles({
    InputAddon: inputAddonStylesDefault,
});

export const inputAddonStyles = getRegisteredMoleculesComponentStyles('InputAddon');
