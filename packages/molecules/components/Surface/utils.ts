import type { Animated } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { inputRange } from '../../styles/shadow';

const defaultStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
    },
}));

export const defaultStyles = getRegisteredComponentStylesWithFallback(
    'Surface',
    defaultStylesDefault,
);

const _shadowColor = '#000';

const iOSShadowOutputRanges = [
    {
        shadowOpacity: 0.15,
        height: [0, 1, 2, 4, 6, 8],
        shadowRadius: [0, 3, 6, 8, 10, 12],
    },
    {
        shadowOpacity: 0.3,
        height: [0, 1, 1, 1, 2, 4],
        shadowRadius: [0, 1, 2, 3, 3, 4],
    },
];

export const getStyleForAnimatedShadowLayer = (
    layer: 0 | 1,
    elevation: Animated.Value,
    shadowColor = _shadowColor,
) => {
    return {
        shadowColor,
        shadowOpacity: elevation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, iOSShadowOutputRanges[layer].shadowOpacity],
            extrapolate: 'clamp',
        }),
        shadowOffset: {
            width: 0,
            height: elevation.interpolate({
                inputRange,
                outputRange: iOSShadowOutputRanges[layer].height,
            }),
        },
        shadowRadius: elevation.interpolate({
            inputRange,
            outputRange: iOSShadowOutputRanges[layer].shadowRadius,
        }),
    };
};

export const getStyleForShadowLayer = (
    layer: 0 | 1,
    elevation: number,
    shadowColor = _shadowColor,
) => {
    return {
        shadowColor,
        shadowOpacity: elevation ? iOSShadowOutputRanges[layer].shadowOpacity : 0,
        shadowOffset: {
            width: 0,
            height: iOSShadowOutputRanges[layer].height[elevation],
        },
        shadowRadius: iOSShadowOutputRanges[layer].shadowRadius[elevation],
    };
};

/**
 * Combines the two shadow layers into a single shadow style.
 * This approximates the two-layer shadow effect using a single shadow.
 */
export const getCombinedShadowStyle = (elevation: number, shadowColor = _shadowColor) => {
    if (elevation === 0) {
        return {
            shadowColor,
            shadowOpacity: 0,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 0,
        };
    }

    const layer0 = iOSShadowOutputRanges[0];
    const layer1 = iOSShadowOutputRanges[1];

    // Use the larger shadow offset (from layer 0)
    const shadowOffsetHeight = layer0.height[elevation];

    // Use the larger shadow radius (from layer 0)
    const shadowRadius = layer0.shadowRadius[elevation];

    // Combine opacities (additive, capped at 1.0)
    // This approximates the visual effect of two overlapping shadows
    const shadowOpacity = Math.min(1.0, layer0.shadowOpacity + layer1.shadowOpacity);

    return {
        shadowColor,
        shadowOpacity,
        shadowOffset: {
            width: 0,
            height: shadowOffsetHeight,
        },
        shadowRadius,
    };
};

// export const getElevationAndroid = (
//     elevation: number,
//     _inputRange: number[],
//     elevationLevel: number[],
// ) => {
//     return elevationLevel[elevation];
// };
