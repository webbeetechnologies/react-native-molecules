import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const tabsStylesDefault = StyleSheet.create(theme => ({
    root: {
        activeColor: theme.colors.primary,
    } as any,

    itemsContainer: {
        flexDirection: 'row',
        position: 'relative',
        flex: 1,
    },

    indicator: {
        position: 'absolute',
        bottom: 0,

        variants: {
            variant: {
                primary: {
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                },
                secondary: {
                    height: 2,
                },
            },
        },
    },

    divider: {},
}));

const tabsItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        ...({ activeColor: theme.colors.primary } as any),

        flex: 1,
        paddingVertical: theme.spacings['2'],
        paddingHorizontal: theme.spacings['4'],
        alignItems: 'center',
        justifyContent: 'center',
    },

    contentsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stateLayer: {
        variants: {
            variant: {
                primary: {},
                secondary: {},
            },
            state: {
                hovered: {},
                active: {},
                activeAndHovered: {},
                default: {},
            },
        },
        compoundVariants: [
            {
                variant: 'primary',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
            {
                variant: 'primary',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
            {
                variant: 'primary',
                state: 'activeAndHovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                },
            },
            {
                variant: 'secondary',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
            {
                variant: 'secondary',
                state: 'activeAndHovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
        ],
    },
}));

const tabsLabelStylesDefault = StyleSheet.create(theme => ({
    label: {
        ...theme.typescale.titleSmall,
        color: theme.colors.onSurface,
    },

    icon: {
        color: theme.colors.onSurfaceVariant,
    },
}));

export const tabsStyles = getRegisteredComponentStylesWithFallback('Tabs', tabsStylesDefault);
export const tabsItemStyles = getRegisteredComponentStylesWithFallback(
    'Tabs_Item',
    tabsItemStylesDefault,
);
export const tabsLabelStyles = getRegisteredComponentStylesWithFallback(
    'Tabs_Label',
    tabsLabelStylesDefault,
);

export type States = 'hovered' | 'active' | 'activeAndHovered' | 'disabled';
