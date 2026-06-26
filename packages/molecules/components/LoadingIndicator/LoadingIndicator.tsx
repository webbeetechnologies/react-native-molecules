import { memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

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

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Pre-parse normalized paths to flat number arrays.
// All normalized paths share the same command structure: M(2 nums) + N×C(6 nums) + Z,
// so lerpPaths can reconstruct without a separate template.
const SHAPE_NUMS: number[][] = [
    normalizedSoftBurstPath,
    normalizedCookie9Path,
    normalizedPentagonPath,
    normalizedPillPath,
    normalizedSunnyPath,
    normalizedCookie4Path,
    normalizedOvalPath,
    normalizedSoftBurstPath, // wrap-back for the final segment's `to`
].map(d => (d.match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number));

const ANIMATION_DURATION = 4550;
const PULSE_DURATION = 2275;
const SEGMENT_COUNT = 7;
const ROTATION_PER_SEGMENT = 1080 / SEGMENT_COUNT;

// Worklet: approximates cubic-bezier(0.42, 1.67, 0.21, 0.90) via Newton-Raphson.
// Output is clamped to [0,1] so overshoot stays visual-only.
function expressFastSpatialEase(t: number): number {
    'worklet';
    const p1x = 0.42,
        p1y = 1.67,
        p2x = 0.21,
        p2y = 0.9;
    const cx = 3.0 * p1x;
    const bx = 3.0 * (p2x - p1x) - cx;
    const ax = 1.0 - cx - bx;
    const cy = 3.0 * p1y;
    const by = 3.0 * (p2y - p1y) - cy;
    const ay = 1.0 - cy - by;
    const sampleX = (x: number) => ((ax * x + bx) * x + cx) * x;
    const sampleY = (x: number) => ((ay * x + by) * x + cy) * x;
    let guess = t;
    for (let i = 0; i < 4; i++) {
        const currentX = sampleX(guess) - t;
        const slope = (3.0 * ax * guess + 2.0 * bx) * guess + cx;
        if (Math.abs(slope) < 1e-6) break;
        guess -= currentX / slope;
    }
    return Math.max(0, Math.min(1, sampleY(guess)));
}

// Worklet: lerp between two normalized path number arrays and serialize to a path string.
function lerpPaths(from: number[], to: number[], t: number): string {
    'worklet';
    const cmdCount = (from.length - 2) / 6;
    let d = `M${from[0] + (to[0] - from[0]) * t} ${from[1] + (to[1] - from[1]) * t}`;
    for (let i = 0; i < cmdCount; i++) {
        const b = 2 + i * 6;
        d +=
            `C${from[b] + (to[b] - from[b]) * t}` +
            ` ${from[b + 1] + (to[b + 1] - from[b + 1]) * t}` +
            ` ${from[b + 2] + (to[b + 2] - from[b + 2]) * t}` +
            ` ${from[b + 3] + (to[b + 3] - from[b + 3]) * t}` +
            ` ${from[b + 4] + (to[b + 4] - from[b + 4]) * t}` +
            ` ${from[b + 5] + (to[b + 5] - from[b + 5]) * t}`;
    }
    return `${d}Z`;
}

const LoadingIndicator = ({
    animating = true,
    color: colorProp,
    size: sizeProp = 'md',
    style,
    variant = 'default',
    innerContainerProps,
    ...rest
}: Props) => {
    const progress = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    componentStyles.useVariants({ variant: variant as 'contained' });

    const { size, strokeColor } = useProcessProps({ variant, size: sizeProp, color: colorProp });

    useEffect(() => {
        if (animating) {
            progress.value = 0;
            progress.value = withRepeat(
                withTiming(1, { duration: ANIMATION_DURATION, easing: Easing.linear }),
                -1,
                false,
            );
            pulseScale.value = 1;
            pulseScale.value = withRepeat(
                withTiming(1.1, { duration: PULSE_DURATION, easing: Easing.inOut(Easing.ease) }),
                -1,
                true,
            );
        } else {
            cancelAnimation(progress);
            cancelAnimation(pulseScale);
            progress.value = 0;
            pulseScale.value = 1;
        }
        return () => {
            cancelAnimation(progress);
            cancelAnimation(pulseScale);
        };
    }, [animating, progress, pulseScale]);

    const animatedStyle = useAnimatedStyle(() => {
        const scaledP = progress.value * SEGMENT_COUNT;
        const segIdx = Math.min(Math.floor(scaledP), SEGMENT_COUNT - 1);
        const easedT = expressFastSpatialEase(scaledP - segIdx);
        const rotation = segIdx * ROTATION_PER_SEGMENT + easedT * ROTATION_PER_SEGMENT;
        return {
            transform: [{ scale: pulseScale.value }, { rotate: `${rotation}deg` }],
        };
    });

    const animatedProps = useAnimatedProps(() => {
        const scaledP = progress.value * SEGMENT_COUNT;
        const segIdx = Math.min(Math.floor(scaledP), SEGMENT_COUNT - 1);
        const easedT = expressFastSpatialEase(scaledP - segIdx);
        return {
            d: lerpPaths(SHAPE_NUMS[segIdx], SHAPE_NUMS[segIdx + 1], easedT),
        };
    });

    if (!animating) return null;

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
            accessibilityState={{ busy: animating }}
            {...rest}>
            <Animated.View
                {...innerContainerProps}
                style={[
                    { width: size, height: size },
                    componentStyles.innerContainer,
                    innerContainerProps?.style,
                    animatedStyle,
                ]}>
                <Svg width={size} height={size} viewBox="0 0 38 38">
                    <AnimatedPath animatedProps={animatedProps} fill={strokeColor} />
                </Svg>
            </Animated.View>
        </View>
    );
};

export default memo(LoadingIndicator);
