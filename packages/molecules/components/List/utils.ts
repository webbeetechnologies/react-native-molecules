import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const defaultStyles = StyleSheet.create(theme => ({
    groupLabel: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['2'],
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    searchInput: {
        marginHorizontal: theme.spacings['2'],
        marginVertical: theme.spacings['3'],
    },
    searchInputInput: {
        height: 42,
    },
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
                    justifyContent: 'center',
                },
                menuItem: {
                    paddingHorizontal: theme.spacings['3'],
                    minHeight: 48,
                    justifyContent: 'center',
                },
            },
        },
    },

    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 40,
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 40,
    },

    leftElement: {
        marginRight: theme.spacings['4'],
        marginLeft: theme.spacings._1,
    },
    rightElement: {
        marginRight: theme.spacings._1,
        marginLeft: theme.spacings['4'],
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
