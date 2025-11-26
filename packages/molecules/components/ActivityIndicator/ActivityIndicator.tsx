import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    type ActivityIndicatorProps,
    Animated,
    Easing,
    Platform,
    View,
    type ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';
import AnimatedSpinner from './AnimatedSpinner';

export type Props = ActivityIndicatorProps & {
    /**
     * Whether to show the indicator or hide it.
     */
    animating?: boolean;
    /**
     * The color of the spinner.
     */
    color?: string;
    /**
     * Size of the indicator.
     */
    size?: 'small' | 'large' | number;
    /**
     * Whether the indicator should hide when not animating.
     */
    hidesWhenStopped?: boolean;
    style?: ViewStyle;
};

const DURATION = 2400;

const mapIndicatorSize = (indicatorSize: 'small' | 'large' | number | undefined) => {
    if (typeof indicatorSize === 'string') {
        return indicatorSize === 'small' ? 24 : 48;
    }
    return indicatorSize ? indicatorSize : 24;
};

/**
 * Activity indicator is used to present progress of some activity in the app.
 * It can be used as a drop-in for the ActivityIndicator shipped with React Native.
 *
 * <div class="screenshots">
 *   <img src="screenshots/activity-indicator.gif" style="width: 100px;" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ActivityIndicator, MD2Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ActivityIndicator animating={true} color={MD2Colors.red800} />
 * );
 *
 * export default MyComponent;
 * ```
 */
const ActivityIndicator = ({
    animating = true,
    color: indicatorColorProp,
    hidesWhenStopped = true,
    size: indicatorSize = 'small',
    style: styleProp,
    ...rest
}: Props) => {
    // const componentStyles = useComponentStyles('ActivityIndicator', [
    //     styleProp,
    //     { normalizedIndicatorColorProp: indicatorColorProp },
    // ]);
    const componentStyles = activityIndicatorStyles;
    const { current: timer } = useRef<Animated.Value>(new Animated.Value(0));
    const { current: fade } = useRef<Animated.Value>(
        new Animated.Value(!animating && hidesWhenStopped ? 0 : 1),
    );

    const rotation = useRef<Animated.CompositeAnimation | undefined>(undefined);

    const size = mapIndicatorSize(indicatorSize);

    const { color, viewStyle, animatedViewStyle } = useMemo(() => {
        return {
            color: indicatorColorProp,
            viewStyle: [componentStyles.container, styleProp],
            animatedViewStyle: [{ width: size, height: size, opacity: fade }],
        };
    }, [componentStyles.container, fade, indicatorColorProp, size, styleProp]);

    const startRotation = useCallback(() => {
        // Show indicator
        Animated.timing(fade, {
            duration: 200,
            toValue: 1,
            isInteraction: false,
            useNativeDriver: true,
        }).start();

        // Circular animation in loop
        if (rotation.current) {
            timer.setValue(0);
            // $FlowFixMe
            Animated.loop(rotation.current).start();
        }
    }, [fade, timer]);

    const stopRotation = () => {
        if (rotation.current) {
            rotation.current.stop();
        }
    };

    useEffect(() => {
        if (rotation.current === undefined) {
            // Circular animation in loop
            rotation.current = Animated.timing(timer, {
                duration: DURATION,
                easing: Easing.linear,
                // Animated.loop does not work if useNativeDriver is true on web
                useNativeDriver: Platform.OS !== 'web',
                toValue: 1,
                isInteraction: false,
            });
        }

        if (animating) {
            startRotation();
        } else if (hidesWhenStopped) {
            // Hide indicator first and then stop rotation
            Animated.timing(fade, {
                duration: 200,
                toValue: 0,
                useNativeDriver: true,
                isInteraction: false,
            }).start(stopRotation);
        } else {
            stopRotation();
        }

        return () => {
            if (animating) stopRotation();
        };
    }, [animating, fade, hidesWhenStopped, startRotation, timer]);

    // console.log({ layer: defaultStyles.layer });

    return (
        <View
            style={viewStyle}
            {...rest}
            accessible
            accessibilityRole="progressbar"
            accessibilityState={{ busy: animating }}>
            <Animated.View style={animatedViewStyle} collapsable={false}>
                {[0, 1].map(index => {
                    // Thanks to https://github.com/n4kz/react-native-indicators for the great work
                    return (
                        <AnimatedSpinner
                            key={index}
                            style={componentStyles.root}
                            index={index}
                            size={size}
                            color={color}
                            timer={timer}
                            // style={defaultStyles.layer}
                            duration={DURATION}
                        />
                    );
                })}
            </Animated.View>
        </View>
    );
};

export const activityIndicatorStylesDefault = StyleSheet.create(theme => ({
    spinner: {
        borderColor: theme.colors.primary,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    layer: {
        ...StyleSheet.absoluteFillObject,

        justifyContent: 'center',
        alignItems: 'center',
    },
}));

registerComponentStyles('ActivityIndicator', activityIndicatorStylesDefault);

export const activityIndicatorStyles = getRegisteredMoleculesComponentStyles('ActivityIndicator');

export default memo(ActivityIndicator);
