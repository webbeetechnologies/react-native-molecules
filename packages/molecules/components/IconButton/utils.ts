import { StyleSheet } from 'react-native-unistyles';

import {
    getRegisteredComponentStylesWithFallback,
    getRegisteredComponentUtilsWithFallback,
} from './../../core/componentsRegistry';

export type States =
    | 'selectedAndDisabled'
    | 'disabled'
    | 'selected'
    | 'hovered'
    | 'selectedAndHovered';

const iconButtonSizeToIconSizeMapDefault = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
};

const iconButtonStylesDefault = StyleSheet.create(theme => ({
    root: {
        borderColor: theme.colors.outline,
        borderRadius: theme.shapes.corner.full,
        overflow: 'hidden',
        borderWidth: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',

        variants: {
            size: {
                xs: {
                    width: 26,
                    height: 26,
                    borderRadius: theme.shapes.corner.full,
                },
                sm: {
                    width: 30,
                    height: 30,
                    borderRadius: theme.shapes.corner.full,
                },
                md: {
                    width: 34,
                    height: 34,
                    borderRadius: theme.shapes.corner.full,
                },
                lg: {
                    width: 38,
                    height: 38,
                    borderRadius: theme.shapes.corner.full,
                },
                undefined: {},
            },

            state: {
                disabled: {
                    opacity: 0.38,
                },
                selectedAndDisabled: {
                    opacity: 0.38,
                },
                selected: {},
                selectedAndHovered: {},
                hovered: {},
                default: {},
            },

            variant: {
                default: {},

                contained: {
                    backgroundColor: theme.colors.surfaceVariant,
                },

                'contained-tonal': {
                    backgroundColor: theme.colors.surfaceVariant,
                },

                outlined: {
                    borderWidth: 1,
                },
            },
        },

        compoundVariants: [
            {
                variant: 'default',
                state: 'selectedAndDisabled',
                styles: {},
            },
            {
                variant: 'default',
                state: 'selected',
                styles: {},
            },
            {
                variant: 'default',
                state: 'selectedAndHovered',
                styles: {},
            },
            {
                variant: 'contained',
                state: 'selectedAndDisabled',
                styles: {
                    backgroundColor: theme.colors.primary,
                },
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
                state: 'selected',
                styles: {
                    backgroundColor: theme.colors.primary,
                },
            },
            {
                variant: 'contained',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.primary,
                },
            },
            {
                variant: 'contained',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.primary,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'selectedAndDisabled',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
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
                state: 'selected',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndDisabled',
                styles: {
                    backgroundColor: theme.colors.inverseSurface,
                    borderWidth: 0,
                },
            },
            {
                variant: 'outlined',
                state: 'disabled',
                styles: {
                    borderColor: theme.colors.onSurface,
                },
            },
            {
                variant: 'outlined',
                state: 'selected',
                styles: {
                    backgroundColor: theme.colors.inverseSurface,
                    borderWidth: 0,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
            },
            {
                variant: 'outlined',
                state: 'hovered',
                styles: {},
            },
        ],
    },
    stateLayer: {
        variants: {
            state: {
                disabled: {},
                selectedAndDisabled: {},
                selected: {},
                selectedAndHovered: {},
                hovered: {},
                default: {},
            },
            size: {
                undefined: {},
            },

            variant: {
                default: {},
                contained: {},
                'contained-tonal': {},
                outlined: {},
            },
        },
        compoundVariants: [
            {
                variant: 'default',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                },
            },
            {
                variant: 'default',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurfaceVariant,
                },
            },
            {
                variant: 'contained',
                state: 'selectedAndHovered',
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
                variant: 'contained-tonal',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSecondaryContainer,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurfaceVariant,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSecondaryContainer,
                },
            },
            {
                variant: 'outlined',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurfaceVariant,
                },
            },
        ],
    },

    icon: {
        color: theme.colors.onSurfaceVariant,

        variants: {
            variant: {
                default: {},

                contained: {
                    color: theme.colors.primary,
                },

                'contained-tonal': {
                    color: theme.colors.onSurfaceVariant,
                },

                outlined: {
                    color: theme.colors.onSurfaceVariant,
                },
            },
        },

        compoundVariants: [
            {
                variant: 'default',
                state: 'selectedAndDisabled',
                styles: {
                    color: theme.colors.primary,
                },
            },
            {
                variant: 'default',
                state: 'selected',
                styles: {
                    color: theme.colors.primary,
                },
            },
            {
                variant: 'default',
                state: 'selectedAndHovered',
                styles: {
                    color: theme.colors.primary,
                },
            },
            {
                variant: 'contained',
                state: 'selectedAndDisabled',
                styles: {
                    color: theme.colors.onPrimary,
                },
            },
            {
                variant: 'contained',
                state: 'disabled',
                styles: {},
            },
            {
                variant: 'contained',
                state: 'selected',
                styles: {
                    color: theme.colors.onPrimary,
                },
            },
            {
                variant: 'contained',
                state: 'selectedAndHovered',
                styles: {
                    color: theme.colors.onPrimary,
                },
            },
            {
                variant: 'contained',
                state: 'hovered',
                styles: {
                    color: theme.colors.onPrimary,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'selectedAndDisabled',
                styles: {
                    color: theme.colors.onSecondaryContainer,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'disabled',
                styles: {},
            },
            {
                variant: 'contained-tonal',
                state: 'selected',
                styles: {
                    color: theme.colors.onSecondaryContainer,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'selectedAndHovered',
                styles: {
                    color: theme.colors.onSecondaryContainer,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndDisabled',
                styles: {
                    color: theme.colors.inverseOnSurface,
                },
            },
            {
                variant: 'outlined',
                state: 'disabled',
                styles: {},
            },
            {
                variant: 'outlined',
                state: 'selected',
                styles: {
                    color: theme.colors.inverseOnSurface,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndHovered',
                styles: {
                    color: theme.colors.onSecondaryContainer,
                },
            },
            {
                variant: 'outlined',
                state: 'hovered',
                styles: {},
            },
        ],
    },
}));

export const defaultStyles = getRegisteredComponentStylesWithFallback(
    'IconButton',
    iconButtonStylesDefault,
);
export const iconButtonSizeToIconSizeMap = getRegisteredComponentUtilsWithFallback(
    'IconButton',
    iconButtonSizeToIconSizeMapDefault,
    'iconButtonSizeToIconSizeMap',
);
