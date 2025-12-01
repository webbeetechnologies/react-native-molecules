import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const menuStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingVertical: theme.spacings['2'],
        backgroundColor: theme.colors.surface,
        minWidth: 112,
        maxWidth: 280,
        borderRadius: theme.shapes.corner.small as unknown as number,
        display: 'flex',
        flexDirection: 'column',
    },
    backdrop: {
        opacity: 0,
    },
}));

const menuItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingVertical: theme.spacings['2'],
        flexDirection: 'row',
        alignItems: 'center',

        variants: {
            state: {
                disabled: {
                    opacity: 0.38,
                },
                hovered: {},
            },
            size: {
                default: {
                    paddingHorizontal: theme.spacings['4'],
                    height: 48,
                },

                dense: {
                    paddingLeft: theme.spacings['4'],
                    paddingRight: theme.spacings['2'],
                    height: 32,
                },
            },
        },
    },

    text: {
        flex: 1,
        color: theme.colors.onSurface,

        size: {
            default: {
                ...theme.typescale.bodyLarge,
            },

            dense: {
                ...theme.typescale.bodyMedium,
            },
        },
    },

    leftElement: {
        marginRight: theme.spacings['5'],
        marginLeft: theme.spacings['2'],
    },
    rightElement: {
        marginRight: theme.spacings['2'],
        marginLeft: theme.spacings['5'],
    },

    stateLayer: {
        variants: {
            state: {
                disabled: {
                    backgroundColor: 'transparent',
                },
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
        },
    },
}));

export const menuStyles = getRegisteredComponentStylesWithFallback('Menu', menuStylesDefault);
export const menuItemStyles = getRegisteredComponentStylesWithFallback(
    'Menu_Item',
    menuItemStylesDefault,
);
