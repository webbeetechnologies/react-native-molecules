import { createContext } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import type { ButtonContextType } from './types';

export const sizeToIconSizeMap = {
    xs: 20,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
};

export const sizeToHeightMap = {
    xs: 32,
    sm: 40,
    md: 56,
    lg: 96,
    xl: 136,
};

export const sizeToPaddingMap = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 48,
    xl: 64,
};

export const sizeToIconGapMap = {
    xs: 4,
    sm: 8,
    md: 8,
    lg: 12,
    xl: 16,
};

export const elevationMap: Record<string, Record<string, number>> = {
    true: {
        contained: 1,
        'contained-tonal': 1,
        elevated: 2,
    },
    false: {
        elevated: 1,
    },
};

export const ButtonContext = createContext<ButtonContextType>({
    variant: 'text',
    size: 'sm',
    state: 'default',
    disabled: false,
    labelColor: undefined,
    iconSize: undefined,
});

const buttonStylesDefault = StyleSheet.create(theme => {
    return {
        root: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderStyle: 'solid',
            variants: {
                size: {
                    xs: {
                        minWidth: 64,
                        height: 32,
                        paddingHorizontal: 12,
                        gap: 4,
                    },
                    sm: {
                        minWidth: 64,
                        height: 40,
                        paddingHorizontal: 16,
                        gap: 8,
                    },
                    md: {
                        minWidth: 64,
                        height: 56,
                        paddingHorizontal: 24,
                        gap: 8,
                    },
                    lg: {
                        minWidth: 96,
                        height: 96,
                        paddingHorizontal: 48,
                        gap: 12,
                    },
                    xl: {
                        minWidth: 136,
                        height: 136,
                        paddingHorizontal: 64,
                        gap: 16,
                    },
                },
                shape: {
                    rounded: {
                        borderRadius: theme.shapes.corner.full,
                    },
                    square: {
                        // Base - will be overridden by compoundVariants for size-specific radii
                        borderRadius: 12,
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
                // Square shape + size compound variants for border radius
                {
                    shape: 'square',
                    size: 'xs',
                    styles: {
                        borderRadius: theme.shapes.corner.medium,
                    },
                },
                {
                    shape: 'square',
                    size: 'sm',
                    styles: {
                        borderRadius: theme.shapes.corner.medium,
                    },
                },
                {
                    shape: 'square',
                    size: 'md',
                    styles: {
                        borderRadius: theme.shapes.corner.large,
                    },
                },
                {
                    shape: 'square',
                    size: 'lg',
                    styles: {
                        borderRadius: theme.shapes.corner.extraLarge,
                    },
                },
                {
                    shape: 'square',
                    size: 'xl',
                    styles: {
                        borderRadius: theme.shapes.corner.extraLarge,
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
    };
});

/**
 * Styles for Button.Icon component
 */
const buttonIconStylesDefault = StyleSheet.create(theme => ({
    root: {
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
}));

/**
 * Styles for Button.Text component
 */
const buttonTextStylesDefault = StyleSheet.create(theme => ({
    root: {
        ...theme.typescale.labelLarge,
        variants: {
            size: {
                xs: {
                    ...theme.typescale.labelLarge,
                },
                sm: {
                    ...theme.typescale.labelLarge,
                },
                md: {
                    ...theme.typescale.titleMedium,
                },
                lg: {
                    ...theme.typescale.headlineSmall,
                },
                xl: {
                    ...theme.typescale.headlineLarge,
                },
            },
            variant: {
                text: {
                    color: theme.colors.primary,
                },
                outlined: {
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
    },
}));

const buttonActivityIndicatorStylesDefault = StyleSheet.create(theme => ({
    root: {
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
}));

export const buttonStyles = getRegisteredComponentStylesWithFallback('Button', buttonStylesDefault);

export const buttonIconStyles = getRegisteredComponentStylesWithFallback(
    'ButtonIcon',
    buttonIconStylesDefault,
);

export const buttonTextStyles = getRegisteredComponentStylesWithFallback(
    'ButtonText',
    buttonTextStylesDefault,
);

export const buttonActivityIndicatorStyles = getRegisteredComponentStylesWithFallback(
    'ButtonActivityIndicator',
    buttonActivityIndicatorStylesDefault,
);
