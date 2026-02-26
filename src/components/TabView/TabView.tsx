import React, { Children, FC, isValidElement, ReactElement, useMemo } from 'react';
import {
    Animated,
    Easing,
    PanResponder,
    View,
    StyleSheet,
    PanResponderGestureState,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { useControlledValue } from '../../hooks';

export interface TabViewProps {
    /** Child position index value. */
    value?: string;

    /** On Index Change Callback. */
    onChange?: (value: string) => any;

    /** Choose the animation type among `spring` and `timing`. This is visible when there is tab change. */
    animationType?: 'spring' | 'timing';

    /** Define the animation configurations.
     *
     * @type AnimationConfig
     */
    animationConfig?: Omit<
        Partial<Animated.SpringAnimationConfig & Animated.TimingAnimationConfig>,
        'toValue'
    >;

    /** Styling for Component container. */
    containerStyle?: StyleProp<ViewStyle>;

    /** Styling for TabView.Item Component container. */
    tabItemContainerStyle?: StyleProp<ViewStyle>;

    /** Swipe disabled or not */
    disableSwipe?: Boolean;

    /** Disables transition */
    disableTransition?: Boolean;

    /**
     * Handler when the user swipes the view.
     * @type (direction) => void
     */
    onSwipeStart?: (dir: 'left' | 'right') => void;

    /**
     * Minimum distance to swipe before the view changes.
     */
    minSwipeRatio?: number;

    /**
     * Minimum speed to swipe before the view changes.
     */
    minSwipeSpeed?: number;
    children: ReactElement[];
}

export const TabViewBase = ({
    value: valueProp,
    children,
    onChange: onChangeProp,
    onSwipeStart = () => {},
    animationType = 'spring',
    animationConfig = {},
    containerStyle,
    tabItemContainerStyle,
    disableSwipe = false,
    disableTransition = false,
    minSwipeRatio = 0.4,
    minSwipeSpeed = 1,
}: TabViewProps) => {
    const translateX = React.useRef(new Animated.Value(0));
    const [containerWidth, setContainerWidth] = React.useState(1);

    const validChildren = useMemo(
        () =>
            Children.toArray(children).filter(
                child =>
                    isValidElement(child) && (child?.type as FC).displayName === 'TabView_Item',
            ),
        [children],
    );

    const indexToNameMap = useMemo(
        () =>
            validChildren.reduce((acc, child, index) => {
                acc[index] = (child as ReactElement).props?.name;

                return acc;
            }, {} as Record<number, string>),
        [validChildren],
    );

    const nameToIndexMap = useMemo(
        () =>
            validChildren.reduce((acc, child, index) => {
                acc[(child as ReactElement).props?.name] = index;

                return acc;
            }, {} as Record<string, number>),
        [validChildren],
    );

    const childCount = validChildren.length;

    const [value, onChange] = useControlledValue({ value: valueProp, onChange: onChangeProp });

    const currentIndex = React.useRef(nameToIndexMap[value] || 0);
    const selectedName = indexToNameMap[currentIndex.current];

    const animate = React.useCallback(
        (toValue: number) => {
            Animated[animationType](translateX.current, {
                toValue,
                useNativeDriver: true,
                easing: Easing.ease,
                ...animationConfig,
            }).start();
        },
        [animationConfig, animationType],
    );

    const releaseResponder = React.useCallback(
        (_: GestureResponderEvent, { dx, vx }: PanResponderGestureState) => {
            const position = dx / -containerWidth;
            const shouldSwipe = Math.abs(position) > minSwipeRatio || Math.abs(vx) > minSwipeSpeed;
            currentIndex.current += shouldSwipe ? Math.sign(position) : 0;
            animate(currentIndex.current);

            onChange(indexToNameMap[currentIndex.current]);
        },
        [animate, containerWidth, indexToNameMap, minSwipeRatio, minSwipeSpeed, onChange],
    );

    const panResponder = React.useMemo(
        () =>
            PanResponder.create({
                onPanResponderGrant: (_, { vx }) => {
                    onSwipeStart(vx > 0 ? 'left' : 'right');
                },
                onMoveShouldSetPanResponder: (_, { dx, dy, vx, vy }) => {
                    const panXInt = Math.floor(currentIndex.current);
                    return (
                        !((dx > 0 && panXInt <= 0) || (dx < 0 && panXInt >= childCount - 1)) &&
                        Math.abs(dx) > Math.abs(dy) * 2 &&
                        Math.abs(vx) > Math.abs(vy) * 2.5
                    );
                },
                onPanResponderMove: (_, { dx }) => {
                    const position = dx / -containerWidth;
                    translateX.current.setValue(Math.floor(currentIndex.current) + position);
                },
                onPanResponderRelease: releaseResponder,
                onPanResponderTerminate: releaseResponder,
            }),
        [childCount, containerWidth, onSwipeStart, releaseResponder],
    );

    React.useEffect(() => {
        if (Number.isInteger(value) && value !== indexToNameMap[currentIndex.current]) {
            animate(nameToIndexMap[value]);
            currentIndex.current = nameToIndexMap[value];
        }
    }, [animate, indexToNameMap, nameToIndexMap, selectedName, value]);

    return (
        <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={[styles.container, { minHeight: 300, overflow: 'hidden' }, containerStyle]}
            onLayout={({ nativeEvent: { layout } }) => {
                setContainerWidth(layout.width);
            }}>
            <Animated.View
                testID="RNE__TabView"
                style={StyleSheet.flatten([
                    StyleSheet.absoluteFillObject,
                    styles.container,
                    {
                        width: containerWidth * childCount,
                        transform: [
                            {
                                translateX: disableTransition
                                    ? -value * containerWidth
                                    : translateX.current.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [0, -containerWidth],
                                      }),
                            },
                        ],
                    },
                ])}
                {...(!disableSwipe && panResponder.panHandlers)}>
                {React.Children.toArray(children).map((child, index) => (
                    <View
                        key={index}
                        style={StyleSheet.flatten([
                            styles.container,
                            tabItemContainerStyle,
                            { width: containerWidth },
                        ])}>
                        {child}
                    </View>
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
});

TabViewBase.displayName = 'TabView';
