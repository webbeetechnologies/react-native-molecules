import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const defaultStyles = StyleSheet.create(theme => ({
    emptyState: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['6'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        color: theme.colors.onSurfaceVariant,
        fontSize: 14,
    },
}));

export const listStyles = getRegisteredComponentStylesWithFallback('List', defaultStyles);

const listItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacings['4'],

        _web: {
            outlineStyle: 'none',
        },

        variants: {
            state: {
                disabled: {
                    opacity: 0.38,
                },
                hovered: {},
                focused: {},

                selected: {
                    backgroundColor: theme.colors.surfaceVariant,
                },
                selectedAndFocused: {
                    backgroundColor: theme.colors.surfaceVariant,
                },
            },
            variant: {
                default: {
                    paddingLeft: theme.spacings['4'],
                    paddingRight: theme.spacings['6'],
                    minHeight: 56,
                },
                menuItem: {
                    paddingHorizontal: theme.spacings['3'],
                    minHeight: 40,
                },
            },
        },
    },
    stateLayer: {
        variants: {
            state: {
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
                focused: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
                selectedAndFocused: {
                    backgroundColor: theme.colors.stateLayer.focussed.onSurface,
                },
            },
        },
    },
}));

export const listItemStyles = getRegisteredComponentStylesWithFallback(
    'List_Item',
    listItemStylesDefault,
);
