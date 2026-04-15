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

import { useLatest } from '../../hooks';
import AutoSizer from './AutoSizer';
import { useDatePickerStore } from './DatePickerContext';
import { beginOffset, estimatedMonthHeight, getInitialIndex, totalMonths } from './dateUtils';
import { addMonths, getRealIndex } from './dateUtils';
import { getIndexFromVerticalOffset, getMonthHeight, getVerticalMonthsOffset } from './Month';
import type { SwiperProps } from './SwiperUtils';
import { montHeaderHeight } from './utils';

function Swiper({ scrollMode, renderItem, renderHeader, renderFooter, initialIndex }: SwiperProps) {
    const isHorizontal = scrollMode === 'horizontal';

    return (
        <>
            {renderHeader && renderHeader()}
            {isHorizontal ? (
                <AutoSizer>
                    {({ width, height }) => (
                        <HorizontalScroller
                            width={width}
                            height={height}
                            initialIndex={initialIndex}
                            renderItem={renderItem}
                        />
                    )}
                </AutoSizer>
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
const visibleHorizontalArray = (i: number) => [i - 1, i, i + 1];

function HorizontalScroller({
    width,
    height,
    initialIndex,
    renderItem,
}: {
    renderItem: (index: number) => any;
    width: number;
    height: number;
    initialIndex: number;
}) {
    const idx = useRef<number>(initialIndex);
    const [visibleIndexes, setVisibleIndexes] = useState<number[]>(
        visibleHorizontalArray(initialIndex),
    );
    const parentRef = useRef<HTMLDivElement | null>(null);
    const [{ localDate }, setStore] = useDatePickerStore(state => state);
    const settleTimerRef = useRef<number | null>(null);
    const isRecenteringRef = useRef(false);

    const syncIndex = useCallback(
        (index: number) => {
            idx.current = index;
            setVisibleIndexes(visibleHorizontalArray(index));
            setStore(prev => ({
                ...prev,
                localDate: addMonths(new Date(), getRealIndex(index)),
            }));
        },
        [setStore],
    );

    const scrollToCenter = useCallback(
        (behavior: ScrollBehavior = 'auto') => {
            const element = parentRef.current;
            if (!element) return;

            isRecenteringRef.current = true;
            element.scrollTo({
                left: width,
                top: 0,
                behavior,
            });
            window.requestAnimationFrame(() => {
                isRecenteringRef.current = false;
            });
        },
        [width],
    );

    useIsomorphicLayoutEffect(() => {
        scrollToCenter();
    }, [scrollToCenter, visibleIndexes]);

    useEffect(() => {
        const targetIndex = getInitialIndex(localDate);
        if (targetIndex === idx.current) return;
        idx.current = targetIndex;
        setVisibleIndexes(visibleHorizontalArray(targetIndex));
    }, [localDate]);

    useEffect(() => {
        return () => {
            if (settleTimerRef.current) {
                window.clearTimeout(settleTimerRef.current);
            }
        };
    }, []);

    const onScroll = useCallback(
        (e: UIEvent) => {
            if (isRecenteringRef.current) {
                return;
            }

            const left = e.currentTarget.scrollLeft;

            if (settleTimerRef.current) {
                window.clearTimeout(settleTimerRef.current);
            }

            settleTimerRef.current = window.setTimeout(() => {
                const direction = left > width * 1.5 ? 1 : left < width * 0.5 ? -1 : 0;

                if (direction !== 0) {
                    syncIndex(idx.current + direction);
                }

                scrollToCenter(direction === 0 ? 'smooth' : 'auto');
            }, 120);
        },
        [scrollToCenter, syncIndex, width],
    );

    const { containerStyle, innerContainerStyle, itemContainerStyle } = useMemo(() => {
        return {
            containerStyle: {
                height,
                width,
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            },
            innerContainerStyle: {
                width: width * 3,
                height,
                position: 'relative',
            },
            itemContainerStyle: (vi: number) => ({
                left: width * vi,
                top: 0,
                bottom: 0,
                position: 'absolute',
                width,
                scrollSnapAlign: 'start',
            }),
        };
    }, [height, width]);

    return (
        <div ref={parentRef} style={containerStyle as CSSProperties} onScroll={onScroll}>
            <div style={innerContainerStyle as CSSProperties}>
                {[0, 1, 2].map(vi => (
                    <div key={vi} style={itemContainerStyle(vi) as CSSProperties}>
                        {renderItem(visibleIndexes[vi])}
                    </div>
                ))}
            </div>
        </div>
    );
}

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
    const [{ localDate }, setStore] = useDatePickerStore(state => state);

    useIsomorphicLayoutEffect(() => {
        const element = parentRef.current;
        if (!element) {
            return;
        }
        element.scrollTo({
            top: getVerticalMonthsOffset(idx.current) - montHeaderHeight,
        });
    }, [parentRef, idx]);

    useEffect(() => {
        const targetIndex = getInitialIndex(localDate);
        if (targetIndex === idx.current) return;
        idx.current = targetIndex;
        setVisibleIndexes(visibleArray(targetIndex));
        const element = parentRef.current;
        if (!element) return;
        element.scrollTo({
            top: getVerticalMonthsOffset(targetIndex) - montHeaderHeight,
        });
    }, [localDate]);

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
                setStore(prev => ({
                    ...prev,
                    localDate: addMonths(new Date(), getRealIndex(index)),
                }));
            }
        },
        [setStore, setVisibleIndexesThrottled],
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
