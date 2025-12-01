import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const navigationRailStylesDefault = StyleSheet.create(theme => ({
    root: {
        width: 80,
        backgroundColor: theme.colors.surface,
        flexGrow: 1,
    },
}));

const navigationRailHeaderStylesDefault = StyleSheet.create({
    header: {
        alignItems: 'center',
    },
});

const navigationRailContentStylesDefault = StyleSheet.create({
    root: {
        flexGrow: 1,
    },
});

const navigationRailFooterStylesDefault = StyleSheet.create({
    root: {
        alignItems: 'center',
    },
});

const navigationRailItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        alignItems: 'center',
        marginBottom: theme.spacings['3'],
        _web: {
            cursor: 'pointer',
        },
        variants: {
            state: {
                hovered: {},
                default: {},
                active: {},
                activeAndHovered: {},
            },
            size: {
                undefined: {},
                sm: {},
                md: {},
                lg: {},
            },
        },
    },

    iconContainer: {
        borderRadius: theme.shapes.corner.full,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',

        _web: {
            cursor: 'pointer',
        },

        variants: {
            state: {
                hovered: {},
                default: {},
                active: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
                activeAndHovered: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
            },

            size: {
                undefined: {},
                sm: {
                    width: 56,
                    height: 32,
                },
                md: {
                    width: 56,
                    height: 32,
                },
                lg: {
                    width: 56,
                    height: 32,
                },
            },
        },
    },
    icon: {
        color: theme.colors.onSurfaceVariant,
        position: 'relative',

        variants: {
            state: {
                hovered: {},
                default: {},
                active: {
                    color: theme.colors.onSecondaryContainer,
                },
                activeAndHovered: {
                    color: theme.colors.onSecondaryContainer,
                },
            },
        },
    },
    badge: {
        position: 'absolute',
        bottom: '75%',
        left: '75%',
        zIndex: 2,
    },

    label: {
        ...theme.typescale.labelMedium,
        color: theme.colors.onSurfaceVariant,
        marginTop: theme.spacings['1'],
        justifyContent: 'center',

        variants: {
            state: {
                hovered: {},
                default: {},
                active: {
                    color: theme.colors.onSurface,
                },
                activeAndHovered: {
                    color: theme.colors.onSurface,
                },
            },
        },
    },

    stateLayer: {
        borderRadius: theme.shapes.corner.full,

        variants: {
            state: {
                active: {},
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurfaceVariant,
                },
                activeAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
                default: {},
            },
        },
    },
}));

export const navigationRailStyles = getRegisteredComponentStylesWithFallback(
    'NavigationRail',
    navigationRailStylesDefault,
);
export const navigationRailHeaderStyles = getRegisteredComponentStylesWithFallback(
    'NavigationRail_Header',
    navigationRailHeaderStylesDefault,
);
export const navigationRailContentStyles = getRegisteredComponentStylesWithFallback(
    'NavigationRail_Content',
    navigationRailContentStylesDefault,
);
export const navigationRailFooterStyles = getRegisteredComponentStylesWithFallback(
    'NavigationRail_Footer',
    navigationRailFooterStylesDefault,
);
export const navigationRailItemStyles = getRegisteredComponentStylesWithFallback(
    'NavigationRail_Item',
    navigationRailItemStylesDefault,
);
