import { memo, useId } from 'react';
import { View } from 'react-native';

import {
    normalizedCookie4Path,
    normalizedCookie9Path,
    normalizedOvalPath,
    normalizedPentagonPath,
    normalizedPillPath,
    normalizedSoftBurstPath,
    normalizedSunnyPath,
} from './pathNormalize';
import { loadingIndicatorStyles as componentStyles, type Props, useProcessProps } from './utils';

// 8 evenly-spaced keyframe beats matching the original CSS animation.
const SMIL_KEY_TIMES = '0; 0.1428; 0.2857; 0.4285; 0.5714; 0.7142; 0.8571; 1';
// Approximation of cubic-bezier(0.42, 1.67, 0.21, 0.90) clamped to [0,1]
// because SMIL keySplines does not allow y-values outside that range.
const SMIL_KEY_SPLINES = Array(7).fill('0.42 1 0.21 0.90').join('; ');

const SHAPE_ROTATION_VALUES =
    '0 19 19; 154.29 19 19; 308.57 19 19; 462.86 19 19; 617.14 19 19; 771.43 19 19; 925.71 19 19; 1080 19 19';

/**
 * Material 3 Expressive Loading Indicator for Web.
 *
 * Uses pure SMIL animations so both shape morphing and rotation work in Safari:
 * - <animate attributeName="d"> for shape morphing
 * - <animateTransform type="rotate"> with explicit center (19 19) for rotation
 *
 * CSS `d` property animation in @keyframes is not supported in Safari, and mixing
 * CSS transform with SMIL on the same element causes the rotation pivot to shift
 * as fill-box dimensions change during morphing.
 */
const LoadingIndicator = ({
    animating = true,
    color: colorProp,
    size: sizeProp = 'md',
    style,
    variant = 'default',
    innerContainerProps,
}: Props) => {
    const id = useId();
    componentStyles.useVariants({
        variant: variant as 'contained',
    });

    const { size, strokeColor } = useProcessProps({
        variant,
        size: sizeProp,
        color: colorProp,
    });

    if (!animating) return null;

    const shapeValues = [
        normalizedSoftBurstPath,
        normalizedCookie9Path,
        normalizedPentagonPath,
        normalizedPillPath,
        normalizedSunnyPath,
        normalizedCookie4Path,
        normalizedOvalPath,
        normalizedSoftBurstPath,
    ].join('; ');

    return (
        <View
            style={[
                componentStyles.container,
                {
                    width: Math.floor((10 / 48) * size * 2) + size,
                    height: Math.floor((10 / 48) * size * 2) + size,
                },
                style,
            ]}
            accessible
            accessibilityLabel="Loading"
            accessibilityRole="progressbar"
            accessibilityState={{ busy: animating }}>
            <View
                {...innerContainerProps}
                style={[
                    { width: size, height: size },
                    componentStyles.innerContainer,
                    innerContainerProps?.style,
                ]}>
                <svg
                    className={`m3-expressive-svg-${id}`}
                    width={size}
                    height={size}
                    viewBox="0 0 38 38">
                    <path d={normalizedSoftBurstPath} fill={strokeColor}>
                        <animate
                            attributeName="d"
                            dur="4.55s"
                            repeatCount="indefinite"
                            calcMode="spline"
                            keyTimes={SMIL_KEY_TIMES}
                            keySplines={SMIL_KEY_SPLINES}
                            values={shapeValues}
                        />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            dur="4.55s"
                            repeatCount="indefinite"
                            calcMode="spline"
                            keyTimes={SMIL_KEY_TIMES}
                            keySplines={SMIL_KEY_SPLINES}
                            values={SHAPE_ROTATION_VALUES}
                        />
                    </path>
                </svg>
            </View>
            <style>
                {`
                .m3-expressive-svg-${id} {
                    display: block;
                }
                `}
            </style>
        </View>
    );
};

export default memo(LoadingIndicator);
