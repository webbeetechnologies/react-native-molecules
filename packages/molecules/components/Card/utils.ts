import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

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

export const cardActionsStyles = getRegisteredComponentStylesWithFallback(
    'Card_Actions',
    cardActionsStylesDefault,
);
