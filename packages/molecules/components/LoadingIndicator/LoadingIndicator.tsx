import { interpolate as flubberInterpolate } from 'flubber';
import { memo, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useDerivedValue,
    useFrameCallback,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import {
    cookie4Path,
    cookie9Path,
    loadingIndicatorStyles as componentStyles,
    ovalPath,
    pentagonPath,
    pillPath,
    type Props,
    softBurstPath,
    sunnyPath,
    useProcessProps,
} from './utils';

// Animation constants matching the web version
const ANIMATION_DURATION = 4550; // 4.55 seconds total cycle
const PULSE_DURATION = 2275; // 2.275 seconds for pulse

const SHAPE_PATHS = [
    softBurstPath,
    cookie9Path,
    pentagonPath,
    pillPath,
    sunnyPath,
    cookie4Path,
    ovalPath,
];

// Number of pre-computed frames per transition for smooth animation
const FRAMES_PER_TRANSITION = 30;
const TOTAL_FRAMES = SHAPE_PATHS.length * FRAMES_PER_TRANSITION;

// Material 3 Express Fast Spatial easing function
// Original: cubic-bezier(0.42, 1.67, 0.21, 0.90)
const expressFastSpatialEase = (t: number): number => {
    'worklet';
    // Approximate cubic-bezier(0.42, 1.67, 0.21, 0.90) using a simplified function
    // This creates the characteristic overshoot and fast settle
    const p1x = 0.42,
        p1y = 1.67,
        p2x = 0.21,
        p2y = 0.9;

    // Simple cubic bezier approximation
    const cx = 3.0 * p1x;
    const bx = 3.0 * (p2x - p1x) - cx;
    const ax = 1.0 - cx - bx;

    const cy = 3.0 * p1y;
    const by = 3.0 * (p2y - p1y) - cy;
    const ay = 1.0 - cy - by;

    // Sample the bezier curve
    const sampleX = (x: number) => ((ax * x + bx) * x + cx) * x;
    const sampleY = (x: number) => ((ay * x + by) * x + cy) * x;

    // Newton-Raphson to find t for given x
    let guess = t;
    for (let i = 0; i < 4; i++) {
        const currentX = sampleX(guess) - t;
        const currentSlope = (3.0 * ax * guess + 2.0 * bx) * guess + cx;
        if (Math.abs(currentSlope) < 1e-6) break;
        guess -= currentX / currentSlope;
    }

    return sampleY(guess);
};

/**
 * Pre-compute all animation frames at initialization for smooth playback.
 * This avoids runtime flubber calls which can cause jank.
 */
const precomputeFrames = (): string[] => {
    const frames: string[] = [];

    for (let i = 0; i < SHAPE_PATHS.length; i++) {
        const fromPath = SHAPE_PATHS[i];
        const toPath = SHAPE_PATHS[(i + 1) % SHAPE_PATHS.length];

        // Create interpolator with higher precision
        const interpolator = flubberInterpolate(fromPath, toPath, {
            maxSegmentLength: 1, // Higher precision for smoother morphing
        });

        for (let j = 0; j < FRAMES_PER_TRANSITION; j++) {
            const t = j / FRAMES_PER_TRANSITION;
            // Apply easing to match CSS animation
            const easedT = expressFastSpatialEase(t);
            frames.push(interpolator(Math.max(0, Math.min(1, easedT))));
        }
    }

    return frames;
};

const frames = precomputeFrames();

const LoadingIndicator = ({
    animating = true,
    color: colorProp,
    size: sizeProp = 'md',
    style,
    variant = 'default',
    innerContainerProps,
    ...rest
}: Props) => {
    const [currentPath, setCurrentPath] = useState(frames[0]);

    const progress = useSharedValue(0);
    const pulseScale = useSharedValue(1);
    // Track last frame to avoid redundant updates
    const lastFrameRef = useSharedValue(-1);

    componentStyles.useVariants({
        variant: variant as 'contained',
    });

    const { size, strokeColor } = useProcessProps({
        variant,
        size: sizeProp,
        color: colorProp,
    });

    const updatePathFromFrame = useCallback((frameIndex: number) => {
        const safeIndex = Math.max(0, Math.min(frameIndex, frames.length - 1));
        setCurrentPath(prevPath => {
            const newPath = frames[safeIndex];
            return prevPath === newPath ? prevPath : newPath;
        });
    }, []);

    useFrameCallback(() => {
        'worklet';
        const frameIndex = Math.floor(progress.value * TOTAL_FRAMES) % TOTAL_FRAMES;
        if (frameIndex !== lastFrameRef.value) {
            lastFrameRef.value = frameIndex;
            updatePathFromFrame(frameIndex);
        }
    });

    useEffect(() => {
        if (animating) {
            // Main morphing and rotation animation
            progress.value = 0;
            progress.value = withRepeat(
                withTiming(1, {
                    duration: ANIMATION_DURATION,
                    easing: Easing.linear,
                }),
                -1, // Infinite repeat
                false, // Don't reverse
            );

            // Pulse animation
            pulseScale.value = 1;
            pulseScale.value = withRepeat(
                withTiming(1.1, {
                    duration: PULSE_DURATION,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1, // Infinite repeat
                true, // Reverse (ping-pong effect)
            );
        } else {
            cancelAnimation(progress);
            cancelAnimation(pulseScale);
            progress.value = 0;
            pulseScale.value = 1;
            updatePathFromFrame(0);
        }

        return () => {
            cancelAnimation(progress);
            cancelAnimation(pulseScale);
        };
    }, [animating, progress, pulseScale, updatePathFromFrame]);

    // Derived value for rotation with per-segment easing (matches CSS animation-timing-function per keyframe)
    const rotation = useDerivedValue(() => {
        'worklet';
        const p = progress.value;
        const segmentCount = SHAPE_PATHS.length;

        // Determine which segment we're in
        const scaledProgress = p * segmentCount;
        const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1);
        const segmentProgress = scaledProgress - segmentIndex;

        // Apply easing to this segment's progress
        const easedSegmentProgress = expressFastSpatialEase(segmentProgress);

        // Calculate rotation: base rotation for completed segments + eased progress within current segment
        const rotationPerSegment = 1080 / segmentCount; // ~154.29 degrees per segment
        const baseRotation = segmentIndex * rotationPerSegment;
        const segmentRotation = easedSegmentProgress * rotationPerSegment;

        return baseRotation + segmentRotation;
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseScale.value }, { rotate: `${rotation.value}deg` }],
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
                    <Path d={currentPath} fill={strokeColor} />
                </Svg>
            </Animated.View>
        </View>
    );
};

export default memo(LoadingIndicator);
