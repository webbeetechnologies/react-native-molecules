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
                    // iconSize: iconSizeMap.sm,
                },
                md: {
                    padding: PADDING,
                    borderRadius: 18,
                    // iconSize: iconSizeMap.md,
                },
                lg: {
                    padding: PADDING,
                    borderRadius: 20,
                    // iconSize: iconSizeMap.lg,
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        flexShrink: 1,
        flexGrow: 1,
        variants: {
            variant: {
                item: {
                    color: theme.colors.onSurface,
                },
            },
            isLeading: {
                true: {
                    textAlign: 'right',
                    paddingLeft: 0,
                    paddingRight: theme.spacings['2'],
                },
                false: {
                    textAlign: 'left',
                    paddingLeft: theme.spacings['2'],
                    paddingRight: 0,
                },
            },
        },
        compoundVariants: [
            {
                variant: 'item',
                size: 'sm',
                styles: {
                    ...theme.typescale.bodyMedium,
                },
            },
            {
                variant: 'item',
                size: 'md',
                styles: {
                    ...theme.typescale.bodyMedium,
                },
            },
            {
                variant: 'item',
                size: 'lg',
                styles: {
                    ...theme.typescale.bodyLarge,
                },
            },
        ],
    },
    fillContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedFill: {
        width: 24 / 2 + (PADDING - 2),
        height: 24 / 2 + (PADDING - 2),

        variants: {
            size: {
                sm: {
                    width: iconSizeMap.sm / 2 + (PADDING - 2),
                    height: iconSizeMap.sm / 2 + (PADDING - 2),
                },
                md: {
                    width: iconSizeMap.md / 2 + (PADDING - 2),
                    height: iconSizeMap.md / 2 + (PADDING - 2),
                },
                lg: {
                    width: iconSizeMap.lg / 2 + (PADDING - 2),
                    height: iconSizeMap.lg / 2 + (PADDING - 2),
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
    // compoundVariantStyles: (variant: 'android' | 'ios' | 'item', size: Size, state: States) => {
    //     if (variant === 'android') {
    //         return {
    //             root: {
    //                 ...(size === 'sm' && { width: 32, height: 32 }),
    //                 ...(size === 'md' && { width: 36, height: 36 }),
    //                 ...(size === 'lg' && { width: 40, height: 40 }),
    //             },
    //             stateLayer: {
    //                 ...(state === 'hovered' && {
    //                     backgroundColor: theme.colors.stateLayer.hover.onSurface,
    //                 }),
    //                 ...(state === 'checkedAndHovered' && {
    //                     backgroundColor: theme.colors.stateLayer.hover.primary,
    //                 }),
    //             },
    //         } as any;
    //     }

    //     if (variant === 'item') {
    //         return {
    //             root: {
    //                 labelColor: 'colors.onSurface',
    //                 ...(size === 'sm' && { labelTypeScale: theme.typescale.bodyMedium }),
    //                 ...(size === 'md' && { labelTypeScale: theme.typescale.bodyLarge }),
    //                 ...(size === 'lg' && { labelTypeScale: theme.typescale.bodyLarge }),
    //             },
    //         };
    //     }
    // },
}));

export const styles = getRegisteredComponentStylesWithFallback('Checkbox', checkboxStylesDefault);
