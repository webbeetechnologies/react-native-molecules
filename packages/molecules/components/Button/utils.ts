import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';
import { StyleSheet } from 'react-native-unistyles';

export const sizeToIconSizeMap = {
    xs: 18,
    sm: 22,
    md: 24,
    lg: 26,
};

const defaultStylesDefault = StyleSheet.create(theme => {
    return {
        root: {
            flexGrow: 1,

            variants: {
                size: {
                    sm: {
                        minWidth: 64,
                        borderRadius: theme.shapes.corner.full,
                    },
                    md: {
                        minWidth: 64,
                        borderRadius: theme.shapes.corner.full,
                    },
                    lg: {
                        minWidth: 64,
                        borderRadius: theme.shapes.corner.full,
                    },
                },

                state: {
                    disabled: {
                        color: theme.colors.onSurfaceDisabled,
                    },
                    hovered: {},
                    default: {},
                },
                variant: {
                    outlined: {
                        backgroundColor: 'transparent',
                        color: theme.colors.primary,
                        borderColor: theme.colors.outline,
                        borderWidth: 1,
                        // elevationLevel: theme.elevations.level0,
                    },
                    text: {
                        backgroundColor: 'transparent',
                        color: theme.colors.primary,
                        // elevationLevel: theme.elevations.level0,
                    },
                    contained: {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.onPrimary,
                        // elevationLevel: theme.elevations.level0,
                    },
                    elevated: {
                        backgroundColor: theme.colors.elevation.level1,
                        color: theme.colors.primary,
                        // elevationLevel: theme.elevations.level1,
                    },
                    'contained-tonal': {
                        backgroundColor: theme.colors.secondaryContainer,
                        color: theme.colors.onSecondaryContainer,
                        // elevationLevel: theme.elevations.level0,
                    },
                },
            },
            compoundVariants: [
                {
                    variant: 'outlined',
                    state: 'disabled',
                    styles: {
                        borderColor: theme.colors.stateLayer.disabled.onSurface,
                    },
                },
                {
                    variant: 'outlined',
                    state: 'hovered',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.hover.primary,
                    },
                },
                {
                    variant: 'text',
                    state: 'disabled',
                    styles: {},
                },
                {
                    variant: 'contained',
                    state: 'disabled',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.disabled.onSurface,
                    },
                },
                {
                    variant: 'contained',
                    state: 'hovered',
                    styles: {
                        // elevationLevel: theme.elevations.level1,
                    },
                },
                {
                    variant: 'elevated',
                    state: 'disabled',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.disabled.onSurface,
                    },
                },
                {
                    variant: 'elevated',
                    state: 'hovered',
                    styles: {
                        // elevationLevel: theme.elevations.level2,
                    },
                },
                {
                    variant: 'contained-tonal',
                    state: 'disabled',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.disabled.onSurface,
                    },
                },
                {
                    variant: 'contained-tonal',
                    state: 'hovered',
                    styles: {
                        // elevationLevel: theme.elevations.level1,
                    },
                },
            ],
        },
        stateLayer: {
            variants: {
                variant: {
                    text: {},
                    contained: {},
                    elevated: {},
                    'contained-tonal': {},
                    outlined: {},
                },
                size: {
                    lg: {},
                },
                state: {
                    hovered: {},
                    disabled: {},
                    default: {},
                },
            },
            compoundVariants: [
                {
                    variant: 'text',
                    state: 'hovered',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.hover.primary,
                    },
                },
                {
                    variant: 'contained',
                    state: 'hovered',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.hover.onPrimary,
                    },
                },
                {
                    variant: 'elevated',
                    state: 'hovered',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.hover.primary,
                    },
                },
                {
                    variant: 'outlined',
                    state: 'hovered',
                    styles: {},
                },
                {
                    variant: 'contained-tonal',
                    state: 'hovered',
                    styles: {
                        backgroundColor: theme.colors.stateLayer.hover.onSecondaryContainer,
                    },
                },
            ],
        },

        button: {
            borderStyle: 'solid',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
        },
        icon: {
            marginLeft: theme.spacings['4'],
            marginRight: theme.spacings._4,

            variants: {
                state: {
                    disabled: {
                        color: theme.colors.onSurfaceDisabled,
                    },
                    hovered: {},
                    default: {},
                },
                variant: {
                    outlined: {
                        color: theme.colors.primary,
                    },
                    text: {
                        color: theme.colors.primary,
                    },
                    contained: {
                        color: theme.colors.onPrimary,
                    },
                    elevated: {
                        color: theme.colors.primary,
                    },
                    'contained-tonal': {
                        color: theme.colors.onSecondaryContainer,
                    },
                },
            },
        },
        iconTextMode: {
            marginLeft: theme.spacings['3'],
            marginRight: theme.spacings._2,
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            marginVertical: theme.spacings['2l'],
            marginHorizontal: theme.spacings['6'],
            ...theme.typescale.labelLarge,

            variants: {
                size: {
                    sm: {
                        ...theme.typescale.labelMedium,
                    },
                    md: {
                        ...theme.typescale.labelLarge,
                    },
                    lg: {
                        ...theme.typescale.labelLarge,
                        fontSize: theme.typescale.bodyLarge.fontSize,
                    },
                },
                variant: {
                    outlined: {
                        color: theme.colors.primary,
                    },
                    text: {
                        color: theme.colors.primary,
                    },
                    contained: {
                        color: theme.colors.onPrimary,
                    },
                    elevated: {
                        color: theme.colors.primary,
                    },
                    'contained-tonal': {
                        color: theme.colors.onSecondaryContainer,
                    },
                },
                state: {
                    disabled: {
                        color: theme.colors.onSurfaceDisabled,
                    },
                    hovered: {},
                    default: {},
                },
            },

            compoundVariants: [
                {
                    variant: 'outlined',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },

                {
                    variant: 'text',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },
                {
                    variant: 'contained',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },
                {
                    variant: 'elevated',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },

                {
                    variant: 'contained-tonal',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },
            ],
        },
        labelText: {
            marginVertical: theme.spacings['2l'],
            marginHorizontal: theme.spacings['3'],
            ...theme.typescale.labelLarge,

            variants: {
                variant: {
                    text: {
                        color: theme.colors.primary,
                    },
                },
                state: {
                    disabled: {
                        color: theme.colors.onSurfaceDisabled,
                    },
                    hovered: {},
                    default: {},
                },
                size: {
                    sm: {
                        ...theme.typescale.labelMedium,
                    },
                    md: {
                        ...theme.typescale.labelLarge,
                    },
                    lg: {
                        ...theme.typescale.labelLarge,
                        fontSize: theme.typescale.bodyLarge.fontSize,
                    },
                },
            },

            compoundVariants: [
                {
                    variant: 'text',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },
            ],
        },
        labelTextAddons: {
            marginVertical: theme.spacings['2l'],
            marginHorizontal: theme.spacings['4'],

            variants: {
                variant: {
                    text: {
                        color: theme.colors.primary,
                    },
                },
                state: {
                    disabled: {
                        color: theme.colors.onSurfaceDisabled,
                    },
                    hovered: {},
                    default: {},
                },
                size: {
                    sm: {
                        ...theme.typescale.labelMedium,
                    },
                    md: {
                        ...theme.typescale.labelLarge,
                    },
                    lg: {
                        ...theme.typescale.labelLarge,
                        fontSize: theme.typescale.bodyLarge.fontSize,
                    },
                },
            },

            compoundVariants: [
                {
                    variant: 'text',
                    state: 'disabled',
                    styles: {
                        color: theme.colors.stateLayer.disabled.onSurface_Level4,
                    },
                },
            ],
        },
    };
});

registerComponentsStyles({
    Button: defaultStylesDefault,
});

export const defaultStyles = getRegisteredMoleculesComponentStyles('Button');
