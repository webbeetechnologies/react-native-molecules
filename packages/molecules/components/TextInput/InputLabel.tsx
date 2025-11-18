import { memo, useCallback, useMemo, useState } from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';

import { StyleSheet } from 'react-native-unistyles';
import type { InputLabelProps } from './types';

const InputLabel = (props: InputLabelProps) => {
    const {
        labelAnimation,
        errorAnimation,
        hasValue,
        focused,
        labelLayout,
        style,
        label,
        floatingLabelVerticalOffset,
        error,
        onLayoutAnimatedText,
        baseLabelTranslateX,
        wiggleOffsetX,
        labelScale,
        paddingOffset,
        labelTranslationXOffset,
        maxFontSizeMultiplier,
        required,
        testID,
        floatingStyle,
    } = props;

    const [containerLayout, setContainerLayout] = useState<{
        measured: boolean;
        width: number;
        height: number;
    }>({
        measured: false,
        width: 0,
        height: 0,
    });

    const handleLayoutContainer = useCallback((e: LayoutChangeEvent) => {
        setContainerLayout({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            measured: true,
        });
    }, []);

    const { containerStyle, minimizedLabelStyle, normalLabelStyle } = useMemo(() => {
        const isLabelFloating = hasValue || focused;

        const labelStyle = {
            transform: [
                {
                    // Wiggle the label when there's an error
                    translateX: errorAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, hasValue && error ? wiggleOffsetX : 0, 0],
                    }),
                },
                {
                    // Move label to top
                    translateY: labelAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            (floatingLabelVerticalOffset || 0) - containerLayout.height / 2,
                            0,
                        ],
                    }),
                },
                {
                    // Make label smaller
                    scale: labelAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [labelScale, 1],
                    }),
                },
            ],
        };
        const labelTranslationX = {
            transform: [
                {
                    // Offset label scale since RN doesn't support transform origin
                    translateX: labelAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [baseLabelTranslateX, labelTranslationXOffset || 0],
                    }),
                },
            ],
        };

        return {
            containerStyle: [
                StyleSheet.absoluteFill,
                {
                    zIndex: 3,
                    justifyContent: 'center' as const,
                },
                {
                    opacity:
                        // Hide the label in minimized state until we measure it's width
                        !isLabelFloating || labelLayout.measured ? 1 : 0,
                },
                labelTranslationX,
            ],
            minimizedLabelStyle: [
                // {
                //     color: theme.colors.onSurface,
                // },
                labelStyle,
                paddingOffset || {},
                {
                    opacity: labelAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [isLabelFloating ? 1 : 0, 0],
                    }),
                },
                style,
                isLabelFloating ? floatingStyle : {},
            ],
            normalLabelStyle: [
                // {
                //     color: theme.colors.onSurface,
                // },
                labelStyle,
                paddingOffset || {},
                {
                    opacity: isLabelFloating ? 0 : 1,
                },
                style,
            ],
        };
    }, [
        hasValue,
        focused,
        errorAnimation,
        error,
        wiggleOffsetX,
        labelAnimation,
        floatingLabelVerticalOffset,
        containerLayout.height,
        labelScale,
        baseLabelTranslateX,
        labelTranslationXOffset,
        labelLayout.measured,
        paddingOffset,
        style,
        floatingStyle,
    ]);

    // Position colored placeholder and gray placeholder on top of each other and crossfade them
    // This gives the effect of animating the color, but allows us to use native driver
    return (
        <>
            {label && (
                <Animated.View
                    pointerEvents="none"
                    style={containerStyle}
                    onLayout={handleLayoutContainer}>
                    <Animated.Text
                        onLayout={onLayoutAnimatedText}
                        style={minimizedLabelStyle}
                        numberOfLines={1}
                        maxFontSizeMultiplier={maxFontSizeMultiplier}
                        testID={`${testID}-label-active`}>
                        {label}
                    </Animated.Text>
                    <Animated.Text
                        // variant={parentState.focused ? 'bodyLarge' : 'bodySmall'}
                        style={normalLabelStyle}
                        numberOfLines={1}
                        maxFontSizeMultiplier={maxFontSizeMultiplier}
                        testID={`${testID}-label-inactive`}>
                        {typeof label === 'string' ? `${label}${required ? '*' : ''}` : label}
                    </Animated.Text>
                </Animated.View>
            )}
        </>
    );
};

export default memo(InputLabel);
