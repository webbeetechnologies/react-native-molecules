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
        color: theme.colors.onSurfaceVariant,
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
                    color: theme.colors.primary,
                },

                'contained-tonal': {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurfaceVariant,
                },

                outlined: {
                    color: theme.colors.onSurfaceVariant,
                    borderWidth: 1,
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
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.onPrimary,
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
                    color: theme.colors.onPrimary,
                },
            },
            {
                variant: 'contained',
                state: 'selectedAndHovered',
                styles: {
                    color: theme.colors.primary,
                },
            },
            {
                variant: 'contained',
                state: 'hovered',
                styles: {
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.onPrimary,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'selectedAndDisabled',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
                    color: theme.colors.onSecondaryContainer,
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
                    color: theme.colors.onSecondaryContainer,
                },
            },
            {
                variant: 'contained-tonal',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
                    color: theme.colors.onSecondaryContainer,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndDisabled',
                styles: {
                    backgroundColor: theme.colors.inverseSurface,
                    color: theme.colors.inverseOnSurface,
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
                    color: theme.colors.inverseOnSurface,
                    borderWidth: 0,
                },
            },
            {
                variant: 'outlined',
                state: 'selectedAndHovered',
                styles: {
                    backgroundColor: theme.colors.secondaryContainer,
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
                    backgroundColor: theme.colors.stateLayer.hover.inverseOnSurface,
                },
            },
        ],
    },

    icon: {},
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
