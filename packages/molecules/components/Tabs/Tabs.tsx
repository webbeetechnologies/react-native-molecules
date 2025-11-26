import {
    Children,
    cloneElement,
    FC,
    isValidElement,
    memo,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView as RNScrollView,
    ScrollView,
    StyleProp,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

import { useControlledValue } from '../../hooks';
import { noop } from '../../utils/lodash';
import { HorizontalDivider, type HorizontalDividerProps } from '../HorizontalDivider';
import type { TabItemProps } from './TabItem';
import { tabsStyles } from './utils';

export type TabsProps = ViewProps & {
    /**
     * child tab name
     * */
    value?: string;
    /**
     * defaultValue to preselected for uncontrolled mode
     * */
    defaultValue?: string;
    /**
     * to enable scroll
     * */
    scrollable?: boolean;
    /**
     * on name change callback.
     * */
    onChange?: (value: string) => void;
    /**
     * Disable the active indicator below.
     * */
    disableIndicator?: boolean;
    /**
     * Additional styling for tab indicator.
     * */
    indicatorStyle?: StyleProp<ViewStyle>;

    indicatorProps?: Omit<ViewStyle, 'style'>;

    dividerStyle?: ViewStyle;

    dividerProps?: Omit<HorizontalDividerProps, 'style'>;

    /** Define the background Variant. */
    variant?: 'primary' | 'secondary';
    activeColor?: string;
};

const emptyObj = {};

export const TabBase = ({
    children,
    value: valueProp,
    defaultValue,
    scrollable = false,
    onChange: onChangeProp = noop,
    indicatorStyle: indicatorStyleProp = emptyObj,
    disableIndicator,
    style,
    variant = 'primary',
    indicatorProps,
    dividerStyle: dividerStyleProp = emptyObj,
    dividerProps,
    activeColor: activeColorProp,
    testID,
    ...rest
}: TabsProps) => {
    tabsStyles.useVariants({
        variant,
    });

    const validChildren = useMemo(
        () =>
            Children.toArray(children).filter(
                child => isValidElement(child) && (child?.type as FC).displayName === 'Tabs_Item',
            ),
        [children],
    );

    const nameToIndexMap = useMemo(
        () =>
            validChildren.reduce((acc, child, currentIndex) => {
                acc[(child as ReactElement).props?.name] = currentIndex;

                return acc;
            }, {} as Record<string, number>),
        [validChildren],
    );

    const [value, onChange] = useControlledValue({
        value: valueProp,
        onChange: onChangeProp,
        defaultValue: defaultValue || (validChildren[0] as ReactElement)?.props?.name,
    });

    const valueIndex = nameToIndexMap[value];

    const positionAnimationRef = useRef(new Animated.Value(0));
    const widthAnimationRef = useRef(new Animated.Value(0));
    const scrollViewRef = useRef<RNScrollView>(null);
    const scrollViewPosition = useRef(0);

    const tabItemPositions = useRef<Array<{ width: number; contentWidth: number }>>([]);
    const [tabContainerWidth, setTabContainerWidth] = useState(0);

    const itemPositionsMap = useMemo(() => {
        return tabItemPositions.current.reduce((acc, item, index) => {
            const previousItemsWidth = tabItemPositions.current
                .slice(0, index)
                .reduce((totalWidth, _item) => {
                    totalWidth += _item.width || 0;

                    return totalWidth;
                }, 0);

            acc[index] =
                variant === 'primary'
                    ? previousItemsWidth + (item.width - item.contentWidth) / 2
                    : previousItemsWidth;

            return acc;
        }, {} as Record<number, number>);
        // to make useMemo in sync with the ref
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, tabItemPositions.current.length]);

    const itemWidthsMap = useMemo(() => {
        return tabItemPositions.current.reduce((acc, item, index) => {
            acc[index] = variant === 'primary' ? item.contentWidth : item.width;

            return acc;
        }, {} as Record<number, number>);
        // to make useMemo in sync with the ref
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, tabItemPositions.current.length]);

    const scrollHandler = useCallback(
        (currValue: number) => {
            if (tabItemPositions.current.length > currValue) {
                const itemStartPosition = currValue === 0 ? 0 : itemPositionsMap[currValue - 1];
                const itemEndPosition = itemPositionsMap[currValue];

                const scrollCurrentPosition = scrollViewPosition.current;
                const tabContainerCurrentWidth = tabContainerWidth;

                let scrollX = scrollCurrentPosition;

                if (itemStartPosition < scrollCurrentPosition) {
                    scrollX += itemStartPosition - scrollCurrentPosition;
                } else if (scrollCurrentPosition + tabContainerCurrentWidth < itemEndPosition) {
                    scrollX += itemEndPosition - (scrollCurrentPosition + tabContainerCurrentWidth);
                }

                scrollViewRef.current!.scrollTo({
                    x: scrollX,
                    y: 0,
                    animated: true,
                });
            }
        },
        [itemPositionsMap, tabContainerWidth],
    );

    useEffect(() => {
        Animated.timing(positionAnimationRef.current, {
            toValue: valueIndex,
            useNativeDriver: false,
            duration: 170,
        }).start();

        scrollable && requestAnimationFrame(() => scrollHandler(valueIndex));
    }, [positionAnimationRef, scrollHandler, valueIndex, scrollable]);

    useEffect(() => {
        Animated.timing(widthAnimationRef.current, {
            toValue: valueIndex,
            useNativeDriver: false,
            duration: 170,
        }).start();
    }, [positionAnimationRef, scrollHandler, valueIndex]);

    const onScrollHandler = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollViewPosition.current = event.nativeEvent.contentOffset.x;
    }, []);

    const transitionInterpolateWithMap = useCallback(
        (obj: Record<any, number>) => {
            const countItems = validChildren.length;
            if (countItems < 2 || !tabItemPositions.current.length) {
                // if there's only one item, use the value of that
                return Object.values(obj)[0] || 0;
            }
            const inputRange = Array.from(Array(countItems).keys());
            const outputRange = Object.values(obj);

            return positionAnimationRef.current.interpolate({
                inputRange,
                outputRange,
            });
        },
        [validChildren.length],
    );

    const indicatorTransitionInterpolate = useMemo(() => {
        return transitionInterpolateWithMap(itemPositionsMap);
    }, [transitionInterpolateWithMap, itemPositionsMap]);

    const widthTransitionInterpolate = useMemo(() => {
        return transitionInterpolateWithMap(itemWidthsMap);
    }, [transitionInterpolateWithMap, itemWidthsMap]);

    const { containerStyle, itemsContainerStyle, dividerStyle, indicatorStyle } = useMemo(() => {
        const { indicator, itemsContainer, divider } = tabsStyles;
        const { activeColor, ...restStyle } = tabsStyles.root;

        return {
            containerStyle: [restStyle, style],
            itemsContainerStyle: itemsContainer,
            dividerStyle: [divider, dividerStyleProp],
            indicatorStyle: [
                indicator,
                {
                    backgroundColor: activeColorProp || activeColor,
                    transform: [
                        {
                            translateX: indicatorTransitionInterpolate,
                        },
                    ],
                    width: widthTransitionInterpolate,
                },
                indicatorStyleProp,
            ],
        };
    }, [
        style,
        dividerStyleProp,
        activeColorProp,
        indicatorTransitionInterpolate,
        widthTransitionInterpolate,
        indicatorStyleProp,
    ]);

    const Container = scrollable ? ScrollView : View;
    const containerProps = scrollable
        ? {
              horizontal: true,
              ref: scrollViewRef,
              onScroll: onScrollHandler,
              showsHorizontalScrollIndicator: false,
              style: itemsContainerStyle,
          }
        : {};

    const onLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        setTabContainerWidth(layout.width);
    }, []);

    const onLayoutItem = useCallback((event: LayoutChangeEvent, index: number) => {
        const { width } = event.nativeEvent.layout;

        const currentItemPosition = tabItemPositions.current[index];

        tabItemPositions.current[index] = {
            ...currentItemPosition,
            width: width,
        };
    }, []);

    const onLayoutText = useCallback((event: LayoutChangeEvent, index: number) => {
        const { width } = event.nativeEvent.layout;

        const currentItemPosition = tabItemPositions.current[index];

        tabItemPositions.current[index] = {
            ...currentItemPosition,
            contentWidth: width,
        };
    }, []);

    return (
        <View
            {...rest}
            testID={testID}
            style={containerStyle}
            accessibilityRole="tablist"
            onLayout={onLayout}>
            <>
                <Container
                    testID={testID && `${testID}--inner-container`}
                    {...containerProps}
                    style={itemsContainerStyle}>
                    {validChildren.map((child, index) => (
                        <ChildItem
                            key={(child as ReactElement).props?.name}
                            testID={testID && `${testID}--tab-item`}
                            index={index}
                            value={value}
                            child={child as ReactElement<TabItemProps>}
                            onChange={onChange}
                            onLayout={onLayoutItem}
                            onLayoutContent={onLayoutText}
                            variant={variant}
                        />
                    ))}

                    {!disableIndicator && (
                        <Animated.View
                            testID={testID && `${testID}--active-indicator`}
                            {...indicatorProps}
                            style={indicatorStyle}
                        />
                    )}
                </Container>

                <HorizontalDivider
                    testID={testID && `${testID}--divider`}
                    {...dividerProps}
                    style={dividerStyle}
                />
            </>
        </View>
    );
};

type ChildItemProps = {
    variant: TabsProps['variant'];
    child: ReactElement<TabItemProps>;
    onChange: TabsProps['onChange'];
    onLayout: (event: LayoutChangeEvent, index: number) => void;
    onLayoutContent: (event: LayoutChangeEvent, index: number) => void;
    value: string;
    index: number;
    testID?: string;
};

const ChildItem = memo(
    ({
        value,
        child,
        onChange,
        onLayout: onLayoutProp,
        onLayoutContent: onLayoutContentProp,
        variant,
        index,
        testID,
    }: ChildItemProps) => {
        const name = child.props?.name;

        const onPress = useCallback(() => {
            onChange?.(name);
        }, [name, onChange]);

        const onLayout = useCallback(
            (e: LayoutChangeEvent) => {
                onLayoutProp(e, index);
            },
            [index, onLayoutProp],
        );

        const onLayoutContent = useCallback(
            (e: LayoutChangeEvent) => {
                onLayoutContentProp(e, index);
            },
            [index, onLayoutContentProp],
        );

        return cloneElement(child, {
            onPress,
            onLayout,
            active: name === value,
            onLayoutContent,
            variant,
            testID: child.props.testID ?? testID,
        });
    },
);

TabBase.displayName = 'Tabs';
