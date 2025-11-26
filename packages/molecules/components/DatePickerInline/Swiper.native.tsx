import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
    type ViewStyle,
} from 'react-native';

import AutoSizer from './AutoSizer';
import { beginOffset, estimatedMonthHeight, totalMonths } from './dateUtils';
import {
    getHorizontalMonthOffset,
    getIndexFromVerticalOffset,
    getMonthHeight,
    getVerticalMonthsOffset,
} from './Month';
import type { SwiperProps } from './SwiperUtils';
import { montHeaderHeight } from './utils';

function getVisibleArray(
    i: number,
    { isHorizontal, height }: { isHorizontal: boolean; height: number },
) {
    if (isHorizontal || height < 700) {
        return [i - 1, i, i + 1];
    }
    return [i - 2, i - 1, i, i + 1, i + 2];
}

function Swiper(props: SwiperProps) {
    return (
        <AutoSizer>
            {({ width, height }) => <SwiperInner {...props} width={width} height={height} />}
        </AutoSizer>
    );
}

function SwiperInner({
    scrollMode,
    renderItem,
    renderHeader,
    renderFooter,
    initialIndex,
    width,
    height,
}: SwiperProps & { width: number; height: number }) {
    const idx = useRef<number>(initialIndex);
    const isHorizontal = scrollMode === 'horizontal';

    const [visibleIndexes, setVisibleIndexes] = useState<number[]>(
        getVisibleArray(initialIndex, { isHorizontal, height }),
    );

    const parentRef = useRef<ScrollView | null>(null);

    const scrollTo = useCallback(
        (index: number, animated: boolean) => {
            idx.current = index;
            setVisibleIndexes(getVisibleArray(index, { isHorizontal, height }));

            if (!parentRef.current) {
                return;
            }
            const offset = isHorizontal
                ? getHorizontalMonthOffset(index, width)
                : getVerticalMonthsOffset(index) - montHeaderHeight;

            if (isHorizontal) {
                parentRef.current.scrollTo({
                    y: 0,
                    x: offset,
                    animated,
                });
            } else {
                parentRef.current.scrollTo({
                    y: offset,
                    x: 0,
                    animated,
                });
            }
        },
        [parentRef, isHorizontal, width, height],
    );

    const scrollToInitial = useCallback(() => {
        scrollTo(idx.current, false);
    }, [scrollTo]);

    const onMomentumScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const contentOffset = e.nativeEvent.contentOffset;
            const viewSize = e.nativeEvent.layoutMeasurement;
            const newIndex = isHorizontal
                ? Math.floor(contentOffset.x / viewSize.width)
                : getIndexFromVerticalOffset(contentOffset.y - beginOffset);

            if (newIndex === 0) {
                return;
            }

            if (idx.current !== newIndex) {
                idx.current = newIndex;
                setVisibleIndexes(getVisibleArray(newIndex, { isHorizontal, height }));
            }
        },
        [idx, height, isHorizontal],
    );

    const { innerContainerStyle, itemContainerStyle } = useMemo(() => {
        return {
            innerContainerStyle: [
                styles.inner,
                {
                    height: isHorizontal ? height : estimatedMonthHeight * totalMonths,
                    width: isHorizontal ? width * totalMonths : width,
                },
            ],
            itemContainerStyle: (vi: number) => ({
                top: isHorizontal ? 0 : getVerticalMonthsOffset(visibleIndexes[vi]),
                left: isHorizontal ? getHorizontalMonthOffset(visibleIndexes[vi], width) : 0,
                right: isHorizontal ? undefined : 0,
                bottom: isHorizontal ? 0 : undefined,
                position: 'absolute',
                width: isHorizontal ? width : undefined,
                height: isHorizontal ? undefined : getMonthHeight(scrollMode, visibleIndexes[vi]),
            }),
        };
    }, [height, isHorizontal, scrollMode, visibleIndexes, width]);

    return (
        <>
            {renderHeader && renderHeader()}
            <ScrollView
                scrollsToTop={false}
                ref={parentRef}
                horizontal={isHorizontal}
                pagingEnabled={isHorizontal}
                style={styles.viewPager}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScrollEndDrag={onMomentumScrollEnd}
                onLayout={scrollToInitial}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={10}>
                <View style={innerContainerStyle}>
                    {visibleIndexes
                        ? new Array(visibleIndexes.length).fill(undefined).map((_, vi) => (
                              <View key={vi} style={itemContainerStyle(vi) as ViewStyle}>
                                  {renderItem(visibleIndexes[vi])}
                              </View>
                          ))
                        : null}
                </View>
            </ScrollView>
            {renderFooter && renderFooter()}
        </>
    );
}

const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
    },
    inner: {
        position: 'relative',
    },
});

export default memo(Swiper);
