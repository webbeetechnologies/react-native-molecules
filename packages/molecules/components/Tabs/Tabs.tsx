import {
    cloneElement,
    type ComponentType,
    type ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    type LayoutChangeEvent,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    ScrollView as RNScrollView,
    ScrollView,
    type StyleProp,
    View,
    type ViewProps,
    type ViewStyle,
} from 'react-native';

import { typedMemo } from '../../hocs';
import { useControlledValue, useSubcomponents } from '../../hooks';
import { noop } from '../../utils/lodash';
import type { TabItemProps } from './TabItem';
import { tabsStyles } from './utils';

export type TabsProps<T extends string | number> = ViewProps & {
    /**
     * child tab name
     * */
    value?: T;
    /**
     * defaultValue to preselected for uncontrolled mode
     * */
    defaultValue?: T;
    /**
     * to enable scroll
     * */
    scrollable?: boolean;
    /**
     * on name change callback.
     * */
    onChange?: (value: T) => void;
    /**
     * Disable the active indicator below.
     * */
    disableIndicator?: boolean;
    /**
     * Additional styling for tab indicator.
     * */
    indicatorStyle?: StyleProp<ViewStyle>;

    indicatorProps?: Omit<ViewStyle, 'style'>;

    /** Define the background Variant. */
    variant?: 'primary' | 'secondary';
    activeColor?: string;
};

const emptyObj = {};

export const TabBase = <T extends string | number>({
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
    activeColor: activeColorProp,
    testID,
    ...rest
}: TabsProps<T>) => {
    tabsStyles.useVariants({
        variant,
    });

    const { Tabs_Item: tabItems } = useSubcomponents({
        children,
        allowedChildren: ['Tabs_Item'],
    });

    // Get ordered list of tab names for current children
    const tabNames = useMemo(
        () => tabItems.map(child => (child as ReactElement<TabItemProps<T>>).props?.name),
        [tabItems],
    );

    const [value, onChange] = useControlledValue({
        value: valueProp,
        onChange: onChangeProp,
        defaultValue: defaultValue || tabNames[0],
    });

    const valueIndex = useMemo(() => tabNames.indexOf(value), [value, tabNames]);
    const previousTabCountRef = useRef(tabNames.length);

    const positionAnimationRef = useRef(new Animated.Value(0));
    const widthAnimationRef = useRef(new Animated.Value(0));
    const scrollViewRef = useRef<RNScrollView>(null);
    const scrollViewPosition = useRef(0);

    const tabItemPositions = useRef<Map<T, { width: number; contentWidth: number }>>(new Map());
    const [tabContainerWidth, setTabContainerWidth] = useState(0);
    const [layoutVersion, setLayoutVersion] = useState(0);

    const itemPositionsMap = useMemo(() => {
        // Build positions based on current render order
        let accumulatedWidth = 0;
        return tabNames.reduce((acc, name, index) => {
            const itemData = tabItemPositions.current.get(name);
            if (!itemData) return acc;

            acc[index] =
                variant === 'primary'
                    ? accumulatedWidth + (itemData.width - itemData.contentWidth) / 2
                    : accumulatedWidth;

            accumulatedWidth += itemData.width || 0;
            return acc;
        }, {} as Record<number, number>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, tabNames, layoutVersion]);

    const itemWidthsMap = useMemo(() => {
        return tabNames.reduce((acc, name, index) => {
            const itemData = tabItemPositions.current.get(name);
            if (!itemData) return acc;

            acc[index] = variant === 'primary' ? itemData.contentWidth : itemData.width;
            return acc;
        }, {} as Record<number, number>);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant, tabNames, layoutVersion]);

    const scrollHandler = useCallback(
        (currValue: number) => {
            if (tabItemPositions.current.size > currValue) {
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

    // Animate indicator position and width when value changes
    useEffect(() => {
        Animated.parallel([
            Animated.timing(positionAnimationRef.current, {
                toValue: valueIndex,
                useNativeDriver: false,
                duration: 170,
            }),
            Animated.timing(widthAnimationRef.current, {
                toValue: valueIndex,
                useNativeDriver: false,
                duration: 170,
            }),
        ]).start();

        if (scrollable) {
            requestAnimationFrame(() => scrollHandler(valueIndex));
        }
    }, [scrollHandler, valueIndex, scrollable]);

    // Handle tab count changes
    useEffect(() => {
        const currentTabCount = tabNames.length;

        if (currentTabCount !== previousTabCountRef.current) {
            // Clean up positions for removed tabs
            const currentTabNamesSet = new Set(tabNames);
            tabItemPositions.current.forEach((_, name) => {
                if (!currentTabNamesSet.has(name)) {
                    tabItemPositions.current.delete(name);
                }
            });

            // Trigger re-calculation
            setLayoutVersion(v => v + 1);

            // Clamp animated values when tabs are removed
            if (currentTabCount < previousTabCountRef.current) {
                const maxValidIndex = Math.max(0, currentTabCount - 1);
                positionAnimationRef.current.setValue(Math.min(valueIndex, maxValidIndex));
                widthAnimationRef.current.setValue(Math.min(valueIndex, maxValidIndex));
            }
        }

        previousTabCountRef.current = currentTabCount;
    }, [tabNames, valueIndex]);

    const onScrollHandler = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollViewPosition.current = event.nativeEvent.contentOffset.x;
    }, []);

    const transitionInterpolateWithMap = useCallback((obj: Record<number, number>) => {
        const entries = Object.entries(obj);
        const countItems = entries.length;

        if (countItems < 2 || !tabItemPositions.current.size) {
            // If there's only one item or no layout data, use the first value
            return Object.values(obj)[0] || 0;
        }

        // Use indices from the map entries to ensure inputRange matches outputRange
        const inputRange = entries.map(([key]) => Number(key));
        const outputRange = entries.map(([, val]) => val);

        return positionAnimationRef.current.interpolate({
            inputRange,
            outputRange,
            extrapolate: 'clamp',
        });
    }, []);

    const indicatorTransitionInterpolate = useMemo(() => {
        return transitionInterpolateWithMap(itemPositionsMap);
    }, [transitionInterpolateWithMap, itemPositionsMap]);

    const widthTransitionInterpolate = useMemo(() => {
        return transitionInterpolateWithMap(itemWidthsMap);
    }, [transitionInterpolateWithMap, itemWidthsMap]);

    const { containerStyle, indicatorStyle } = useMemo(() => {
        const { indicator, itemsContainer } = tabsStyles;
        const { activeColor, ...restStyle } = tabsStyles.root;

        return {
            containerStyle: [restStyle, itemsContainer, style],
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
          }
        : {};

    const onLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        setTabContainerWidth(layout.width);
    }, []);

    const onLayoutItem = useCallback((event: LayoutChangeEvent, name: T) => {
        const { width } = event.nativeEvent.layout;

        const currentItemPosition = tabItemPositions.current.get(name) || {
            width: 0,
            contentWidth: 0,
        };

        tabItemPositions.current.set(name, {
            ...currentItemPosition,
            width: width,
        });
        setLayoutVersion(v => v + 1);
    }, []);

    const onLayoutText = useCallback((event: LayoutChangeEvent, name: T) => {
        const { width } = event.nativeEvent.layout;

        const currentItemPosition = tabItemPositions.current.get(name) || {
            width: 0,
            contentWidth: 0,
        };

        tabItemPositions.current.set(name, {
            ...currentItemPosition,
            contentWidth: width,
        });
        setLayoutVersion(v => v + 1);
    }, []);

    return (
        <Container
            {...rest}
            testID={testID}
            {...containerProps}
            style={containerStyle}
            accessibilityRole="tablist"
            onLayout={onLayout}>
            {tabItems.map(child => (
                <ChildItem
                    key={(child as ReactElement<TabItemProps<T>>).props?.name}
                    testID={testID && `${testID}--tab-item`}
                    value={value}
                    child={child as ReactElement<TabItemProps<T>>}
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
    );
};

type ChildItemProps<T extends string | number> = {
    variant: TabsProps<T>['variant'];
    child: ReactElement<TabItemProps<T>>;
    onChange: TabsProps<T>['onChange'];
    onLayout: (event: LayoutChangeEvent, name: T) => void;
    onLayoutContent: (event: LayoutChangeEvent, name: T) => void;
    value: string | number;
    testID?: string;
};

const ChildItem = typedMemo(
    <T extends string | number>({
        value,
        child,
        onChange,
        onLayout: onLayoutProp,
        onLayoutContent: onLayoutContentProp,
        variant,
        testID,
    }: ChildItemProps<T>) => {
        const name = child.props?.name;

        const onPress = useCallback(() => {
            onChange?.(name);
        }, [name, onChange]);

        const onLayout = useCallback(
            (e: LayoutChangeEvent) => {
                onLayoutProp(e, name);
            },
            [name, onLayoutProp],
        );

        const onLayoutContent = useCallback(
            (e: LayoutChangeEvent) => {
                onLayoutContentProp(e, name);
            },
            [name, onLayoutContentProp],
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

(ChildItem as ComponentType).displayName = 'Tabs_ChildItem';
TabBase.displayName = 'Tabs';
