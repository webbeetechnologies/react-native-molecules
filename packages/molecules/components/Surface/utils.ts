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

// TODO - abstract this
export function extractProperties(
    _objectsArray: Record<string, any>,
    propertiesToExtract: string[],
) {
    const extracted: Record<string, any> = {};

    const objectsArray = _objectsArray.flat();

    for (let i = objectsArray.length - 1; i >= 0; i--) {
        const obj = objectsArray[i];

        for (const prop of propertiesToExtract) {
            if (!obj) continue;
            if (prop in obj) {
                // @ts-ignore
                extracted[prop] = obj[prop];
            }
        }
    }

    return extracted;
}

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

export const getElevationAndroid = (
    elevation: number,
    _inputRange: number[],
    elevationLevel: number[],
) => {
    return elevationLevel[elevation];
};
