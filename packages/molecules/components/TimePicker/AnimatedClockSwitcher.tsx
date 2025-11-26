import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { clockTypes, type PossibleClockTypes } from './timeUtils';

export default function AnimatedClockSwitcher({
    focused,
    hours,
    minutes,
}: {
    focused: PossibleClockTypes;
    hours: any;
    minutes: any;
}) {
    const collapsed = focused === clockTypes.hours;
    const animatedCollapsed = useRef<Animated.Value>(new Animated.Value(collapsed ? 1 : 0));

    useEffect(() => {
        Animated.timing(animatedCollapsed.current, {
            toValue: collapsed ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [collapsed]);

    const { containerStyle, innerContainerStyle } = useMemo(() => {
        return {
            containerStyle: [
                StyleSheet.absoluteFill,
                {
                    opacity: animatedCollapsed.current,
                    transform: [
                        {
                            scale: animatedCollapsed.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.95, 1],
                            }),
                        },
                    ],
                },
            ],
            innerContainerStyle: [
                StyleSheet.absoluteFill,
                {
                    opacity: animatedCollapsed.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                    }),
                    transform: [
                        {
                            scale: animatedCollapsed.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.95],
                            }),
                        },
                    ],
                },
            ],
        };
    }, []);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Animated.View pointerEvents={collapsed ? 'auto' : 'none'} style={containerStyle}>
                {hours}
            </Animated.View>
            <Animated.View pointerEvents={collapsed ? 'none' : 'auto'} style={innerContainerStyle}>
                {minutes}
            </Animated.View>
        </View>
    );
}
