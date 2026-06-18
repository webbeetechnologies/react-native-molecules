import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const PADDING = 6;

export const iconSizeMap = {
    sm: 20,
    md: 24,
    lg: 28,
};

const checkboxStylesDefault = StyleSheet.create(theme => ({
    root: {
        variants: {
            variant: {
                android: {},
                ios: {},
            },
            size: {
                sm: {
                    padding: PADDING,
                    borderRadius: 16,
                },
                md: {
                    padding: PADDING,
                    borderRadius: 18,
                },
                lg: {
                    padding: PADDING,
                    borderRadius: 20,
                },
            },
        },

        compoundVariants: [
            {
                variant: 'android',
                size: 'sm',
                styles: {
                    width: 32,
                    height: 32,
                },
            },
            {
                variant: 'android',
                size: 'md',
                styles: {
                    width: 36,
                    height: 36,
                },
            },
            {
                variant: 'android',
                size: 'lg',
                styles: {
                    width: 40,
                    height: 40,
                },
            },
        ],
    },
    stateLayer: {
        variants: {
            state: {
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
                checkedAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                },
            },

            variant: {
                ios: {
                    backgroundColor: 'transparent',
                },
            },
        },
    },
    icon: {
        color: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: {
                    color: theme.colors.primary,
                },
                checkedAndHovered: {
                    color: theme.colors.primary,
                },
                disabled: {
                    color: theme.colors.onSurfaceDisabled,
                },
                hovered: {},
            },
        },
    },
}));

const checkboxRowStylesDefault = StyleSheet.create(theme => ({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        flexShrink: 1,
        flexGrow: 1,
        color: theme.colors.onSurface,
        ...theme.typescale.bodyLarge,

        variants: {
            state: {
                checked: {},
                checkedAndHovered: {},
                hovered: {},
                disabled: { color: theme.colors.onSurfaceDisabled },
            },
        },
    },
}));

export const styles = getRegisteredComponentStylesWithFallback('Checkbox', checkboxStylesDefault);
export const checkboxRowStyles = getRegisteredComponentStylesWithFallback(
    'Checkbox_Row',
    checkboxRowStylesDefault,
);
