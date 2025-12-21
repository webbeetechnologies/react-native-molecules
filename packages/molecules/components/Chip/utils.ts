import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const chipStylesDefault = StyleSheet.create(theme => ({
    container: {
        borderRadius: theme.shapes.corner.small,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacings['2'],
        flexDirection: 'row',
        alignItems: 'center',

        variants: {
            variant: {
                outlined: {
                    borderWidth: StyleSheet.hairlineWidth,
                    borderStyle: 'solid',
                    borderColor: theme.colors.outline,

                    state: {
                        disabled: {
                            borderColor: theme.colors.onSurface,
                            opacity: 0.38,
                        },
                    },
                },
                elevated: {
                    backgroundColor: theme.colors.surface,
                },
            },

            state: {
                selected: {
                    backgroundColor: theme.colors.secondaryContainer,
                    borderWidth: 0,
                },
                disabled: {
                    backgroundColor: theme.colors.stateLayer.disabled.onSurface,
                    borderWidth: 0,
                },
            },

            size: {
                sm: {
                    minHeight: 28,
                },
                md: {
                    minHeight: 32,
                },
            },
        },
    },
    label: {
        display: 'flex',
        color: theme.colors.onSurfaceVariant,

        variants: {
            size: {
                sm: {
                    paddingHorizontal: theme.spacings['1'],
                    fontSize: theme.typescale.labelMedium.fontSize,
                    fontWeight: theme.typescale.labelMedium.fontWeight,
                    lineHeight: theme.typescale.labelMedium.lineHeight,
                },
                md: {
                    paddingHorizontal: theme.spacings['2'],
                    fontSize: theme.typescale.labelLarge.fontSize,
                    fontWeight: theme.typescale.labelLarge.fontWeight,
                    lineHeight: theme.typescale.labelLarge.lineHeight,
                },
            },
        },
    },
    leftElement: {},
    rightElement: {},
    stateLayer: {
        variants: {
            state: {
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurfaceVariant,
                },
                selectedAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSecondaryContainer,
                },
            },
        },
    },
}));

export const styles = getRegisteredComponentStylesWithFallback('Chip', chipStylesDefault);

export type States = 'hovered' | 'selectedAndHovered' | 'selected' | 'disabled';
