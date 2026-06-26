import type { ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { tokenStylesParser } from '../../utils/tokenStylesParser';

export type Props = ViewProps & {
    /**
     * Whether the indicator is animating. When false, the indicator is hidden.
     * @default true
     */
    animating?: boolean;
    /**
     * Color of the indicator. Accepts theme color tokens (e.g., 'primary', 'secondary', 'error') or CSS color values.
     * @default 'primary' for default variant, 'onPrimaryContainer' for contained variant
     */
    color?: string;
    /**
     * Size of the indicator. 'sm' = 24px, 'md' = 38px, or a custom number.
     * @default 'md'
     */
    size?: number | 'sm' | 'md';
    /**
     * Visual variant. 'contained' adds a circular background using primaryContainer color.
     * @default 'default'
     */
    variant?: 'default' | 'contained';
    /**
     * Props passed to the inner animated container.
     */
    innerContainerProps?: ViewProps;
};

export const expressFastSpatial = 'cubic-bezier(0.42, 1.67, 0.21, 0.90)';

export const useProcessProps = ({
    variant,
    size: sizeProp,
    color: colorProp,
}: Pick<Props, 'variant' | 'size' | 'color'>) => {
    const size = typeof sizeProp === 'string' ? (sizeProp === 'sm' ? 24 : 38) : sizeProp || 38;

    const color = colorProp || (variant === 'contained' ? 'onPrimaryContainer' : 'primary');
    const parsedColor = tokenStylesParser.getColor(color, 'color') as { color?: string };
    const strokeColor = parsedColor?.color;

    return {
        size,
        strokeColor,
    };
};

export const loadingIndicatorStylesDefault = StyleSheet.create(theme => ({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.full,
        _web: {
            width: 'fit-content',
        },

        variants: {
            variant: {
                default: {},
                contained: {
                    backgroundColor: theme.colors.primaryContainer,
                },
            },
        },
    },
    innerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: 'center',

        _web: {
            animation: 'm3-expressive-pulse 2.275s ease-in-out infinite',
        },
    },
}));

export const loadingIndicatorStyles = getRegisteredComponentStylesWithFallback(
    'LoadingIndicator',
    loadingIndicatorStylesDefault,
);
