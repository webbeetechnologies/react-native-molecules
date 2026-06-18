import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export const ANIMATION_DURATION = 100;

export const iconSizeMap = {
    sm: 20,
    md: 24,
    lg: 28,
};

const radioStylesDefault = StyleSheet.create(theme => ({
    root: {},

    container: {
        borderRadius: theme.shapes.corner.full as unknown as number,
        alignItems: 'center',
        justifyContent: 'center',

        variants: {
            size: {
                sm: { padding: 4 },
                md: { padding: 6 },
                lg: { padding: 8 },
            },
        },
    },
    radioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    radio: {
        borderColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: { borderColor: theme.colors.primary },
                checkedAndHovered: { borderColor: theme.colors.primary },
                hovered: {},
                disabled: { borderColor: theme.colors.onSurfaceDisabled },
            },
            size: {
                sm: { height: 16, width: 16, borderRadius: 8 },
                md: { height: 20, width: 20, borderRadius: 10 },
                lg: { height: 24, width: 24, borderRadius: 12 },
            },
        },
    },
    dot: {
        backgroundColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: { backgroundColor: theme.colors.primary },
                checkedAndHovered: { backgroundColor: theme.colors.primary },
                hovered: {},
                disabled: { backgroundColor: theme.colors.onSurfaceDisabled },
            },
            size: {
                sm: { height: 8, width: 8, borderRadius: 4 },
                md: { height: 10, width: 10, borderRadius: 5 },
                lg: { height: 12, width: 12, borderRadius: 6 },
            },
        },
    },
    icon: {
        backgroundColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: { backgroundColor: theme.colors.primary },
                checkedAndHovered: { backgroundColor: theme.colors.primary },
                hovered: {},
                disabled: { backgroundColor: theme.colors.onSurfaceDisabled },
            },
        },
    },
    stateLayer: {
        variants: {
            state: {
                hovered: { backgroundColor: theme.colors.stateLayer.hover.onSurface },
                checkedAndHovered: { backgroundColor: theme.colors.stateLayer.hover.primary },
            },
        },
    },
}));

const radioRowStylesDefault = StyleSheet.create(theme => ({
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

export const radioStyles = getRegisteredComponentStylesWithFallback('Radio', radioStylesDefault);
export const radioRowStyles = getRegisteredComponentStylesWithFallback(
    'Radio_Row',
    radioRowStylesDefault,
);
