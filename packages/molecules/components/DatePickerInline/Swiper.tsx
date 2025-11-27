import {
    type CSSProperties,
    memo,
    type UIEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { StyleSheet, View } from 'react-native';

import { useLatest } from '../../hooks';
import AutoSizer from './AutoSizer';
import { beginOffset, estimatedMonthHeight, totalMonths } from './dateUtils';
import { getIndexFromVerticalOffset, getMonthHeight, getVerticalMonthsOffset } from './Month';
import type { SwiperProps } from './SwiperUtils';
import { montHeaderHeight } from './utils';

function Swiper({ scrollMode, renderItem, renderHeader, renderFooter, initialIndex }: SwiperProps) {
    const isHorizontal = scrollMode === 'horizontal';

    return (
        <>
            {renderHeader && renderHeader()}
            {isHorizontal ? (
                <View style={styles.flex1}>{renderItem(initialIndex)}</View>
            ) : (
                <AutoSizer>
                    {({ width, height }) => (
                        <VerticalScroller
                            width={width}
                            height={height}
                            initialIndex={initialIndex}
                            estimatedHeight={estimatedMonthHeight}
                            renderItem={renderItem}
                        />
                    )}
                </AutoSizer>
            )}
            {renderFooter && renderFooter()}
        </>
    );
}

const visibleArray = (i: number) => [i - 2, i - 1, i, i + 1, i + 2];

function VerticalScroller({
    width,
    height,
    initialIndex,
    estimatedHeight,
    renderItem,
}: {
    renderItem: (index: number) => any;
    width: number;
    height: number;
    initialIndex: number;
    estimatedHeight: number;
}) {
    const idx = useRef<number>(initialIndex);
    const [visibleIndexes, setVisibleIndexes] = useState<number[]>(visibleArray(initialIndex));

    const parentRef = useRef<HTMLDivElement | null>(null);

    useIsomorphicLayoutEffect(() => {
        const element = parentRef.current;
        if (!element) {
            return;
        }
        const top = getVerticalMonthsOffset(idx.current) - montHeaderHeight;

        element.scrollTo({
            top,
        });
    }, [parentRef, idx]);

    const setVisibleIndexesThrottled = useDebouncedCallback(setVisibleIndexes);

    const onScroll = useCallback(
        (e: UIEvent) => {
            const top = e.currentTarget.scrollTop;
            if (top === 0) {
                return;
            }

            const offset = top - beginOffset;
            const index = getIndexFromVerticalOffset(offset);

            if (idx.current !== index) {
                idx.current = index;
                setVisibleIndexesThrottled(visibleArray(index));
            }
        },
        [setVisibleIndexesThrottled],
    );

    const { containerStyle, innerContainerStyle, itemContainerStyle } = useMemo(() => {
        return {
            containerStyle: {
                height,
                width,
                overflow: 'auto',
            },
            innerContainerStyle: {
                height: estimatedHeight * totalMonths,
                position: 'relative',
            },
            itemContainerStyle: (vi: number) => ({
                willChange: 'transform',
                transform: `translateY(${getVerticalMonthsOffset(visibleIndexes[vi])}px)`,
                left: 0,
                right: 0,
                position: 'absolute',
                height: getMonthHeight('vertical', visibleIndexes[vi]),
                // transform: `translateY(${getMonthsOffset('vertical', vi)}px)`,
            }),
        };
    }, [estimatedHeight, height, visibleIndexes, width]);

    return (
        <div ref={parentRef} style={containerStyle} onScroll={onScroll}>
            <div style={innerContainerStyle as CSSProperties}>
                {[0, 1, 2, 3, 4].map(vi => (
                    <div key={vi} style={itemContainerStyle(vi) as CSSProperties}>
                        {renderItem(visibleIndexes[vi])}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
});

export function useDebouncedCallback(callback: any): any {
    const mounted = useRef<boolean>(true);
    const latest = useLatest(callback);
    const timerId = useRef<any>(null);

    useEffect(() => {
        return () => {
            mounted.current = false;
            if (timerId.current) {
                window.cancelAnimationFrame(timerId.current);
            }
        };
    }, [mounted, timerId]);

    return useCallback(
        (args: any) => {
            if (timerId.current) {
                window.cancelAnimationFrame(timerId.current);
            }
            timerId.current = window.requestAnimationFrame(function () {
                if (mounted.current) {
                    latest.current(args);
                }
            });
        },
        [mounted, timerId, latest],
    );
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default memo(Swiper);
