import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

export type States = 'hovered' | 'focused' | 'pressed' | 'disabled';
export type CardTypographyVariant = 'headline' | 'subhead' | 'text';
export type CardTypographySize = 'sm' | 'md' | 'lg';

const cardActionsStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingHorizontal: theme.spacings['4'],
        paddingBottom: theme.spacings['4'],
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacings['3'],
    },
}));

registerComponentsStyles({
    Card_Actions: cardActionsStylesDefault,
});

export const cardActionsStyles = getRegisteredMoleculesComponentStyles('Card_Actions');
