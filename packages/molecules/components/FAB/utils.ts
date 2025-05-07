import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';
import { StyleSheet } from 'react-native-unistyles';

export const iconSizeMap = {
    xs: 18,
    sm: 24,
    md: 28,
    lg: 36,
};

const fabStylesDefault = StyleSheet.create(theme => ({
    root: {
        ...{ iconSize: 24 },

        variants: {
            state: {
                disabled: {
                    backgroundColor: theme.colors.surfaceDisabled,
                },
            },

            variant: {
                primary: {
                    backgroundColor: theme.colors.primaryContainer,
                },
                secondary: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
                tertiary: {
                    backgroundColor: theme.colors.tertiaryContainer,
                },
                surface: {
                    backgroundColor: theme.colors.surface,
                },
            },

            size: {
                xs: {
                    minHeight: 32,
                    minWidth: 32,
                    borderRadius: theme.shapes.corner.small,
                },
                sm: {
                    minHeight: 40,
                    minWidth: 40,
                    borderRadius: theme.shapes.corner.medium,
                },
                md: {
                    minHeight: 56,
                    minWidth: 56,
                    borderRadius: theme.shapes.corner.large,
                },
                lg: {
                    minHeight: 96,
                    minWidth: 96,
                    borderRadius: theme.shapes.corner.extraLarge,
                },
            },
        },
    },

    innerContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        variants: {
            size: {
                xs: {
                    borderRadius: theme.shapes.corner.small,
                },
                sm: {
                    padding: theme.spacings['3'],
                    borderRadius: theme.shapes.corner.medium,
                },
                md: {
                    padding: theme.spacings['4'],
                    borderRadius: theme.shapes.corner.large,
                },
                lg: {
                    padding: theme.spacings['7'],
                    borderRadius: theme.shapes.corner.extraLarge,
                },
            },
        },
    },

    stateLayer: {
        variants: {
            state: {
                disabled: {
                    backgroundColor: theme.colors.stateLayer.disabled.onSurface,
                },
            },

            size: {
                xs: {
                    borderRadius: theme.shapes.corner.small,
                },
                sm: {
                    borderRadius: theme.shapes.corner.medium,
                },
                md: {
                    borderRadius: theme.shapes.corner.large,
                },
                lg: {
                    borderRadius: theme.shapes.corner.extraLarge,
                },
            },
        },
        compoundVariants: [
            {
                variant: 'primary',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onPrimaryContainer,
                },
            },
            {
                variant: 'secondary',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSecondaryContainer,
                },
            },
            {
                variant: 'tertiary',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onTertiaryContainer,
                },
            },
            {
                variant: 'surface',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                },
            },
        ],
    },

    icon: {
        variants: {
            state: {
                disabled: {
                    color: theme.colors.onSurfaceDisabled,
                },
            },

            variant: {
                primary: {
                    color: theme.colors.onPrimaryContainer,
                },
                secondary: {
                    color: theme.colors.onSecondaryContainer,
                },
                tertiary: {
                    color: theme.colors.onTertiaryContainer,
                },
                surface: {
                    color: theme.colors.primary,
                },
            },
        },
    },

    label: {
        fontSize: theme.typescale.labelSmall.fontSize,
        lineHeight: theme.typescale.labelSmall.lineHeight,
        fontWeight: theme.typescale.labelMedium.labelSmall,
        marginLeft: theme.spacings['1'],
        variants: {
            state: {
                disabled: {
                    color: theme.colors.onSurfaceDisabled,
                },
            },

            variant: {
                primary: {
                    color: theme.colors.onPrimaryContainer,
                },
                secondary: {
                    color: theme.colors.onPrimaryContainer,
                },
                tertiary: {
                    color: theme.colors.onPrimaryContainer,
                },
                surface: {
                    color: theme.colors.primary,
                },
            },

            size: {
                sm: {
                    ...theme.typescale.labelMedium,
                    marginLeft: theme.spacings['1'],
                },
                md: {
                    ...theme.typescale.labelLarge,
                    marginLeft: theme.spacings['2'],
                },
                lg: {
                    ...theme.typescale.bodyExtraLarge,
                    marginLeft: theme.spacings['3'],
                },
            },
        },
    },
}));

registerComponentsStyles({
    FAB: fabStylesDefault,
});

export const fabStyles = getRegisteredMoleculesComponentStyles('FAB');

export type States = 'hovered' | 'disabled';
