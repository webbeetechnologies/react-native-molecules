import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const chipStylesDefault = StyleSheet.create(theme => ({
    container: {
        borderRadius: theme.shapes.corner.small,
        backgroundColor: theme.colors.surface,

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
    touchableRippleContainer: {
        flex: 1,
        paddingHorizontal: theme.spacings['2'],
        borderRadius: theme.shapes.corner.small,
        flexDirection: 'row',
        alignItems: 'center',
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

registerComponentsStyles({
    Chip: chipStylesDefault,
});

export const styles = getRegisteredMoleculesComponentStyles('Chip');

export type States = 'hovered' | 'selectedAndHovered' | 'selected' | 'disabled';
