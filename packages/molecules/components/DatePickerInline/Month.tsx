import { memo, useMemo } from 'react';
import { View } from 'react-native';

import { format } from '../../utils/date-fns';
import { Text } from '../Text';
import { getCalendarHeaderHeight } from './DatePickerInlineHeader';
import {
    addMonths,
    beginOffset,
    estimatedMonthHeight,
    generateCalendarGrid,
    getGridCount,
    getRealIndex,
    gridCounts,
    startAtIndex,
    totalMonths,
    useRangeChecker,
} from './dateUtils';
import type { MonthMultiProps, MonthRangeProps, MonthSingleProps } from './types';
import {
    datePickerMonthStyles,
    dayNamesHeight,
    montHeaderHeight,
    monthHeaderSingleHeight,
    monthHeaderSingleMarginBottom,
    monthHeaderSingleMarginTop,
    weekSize,
} from './utils';
import Week from './Week';

export type Props = MonthSingleProps | MonthRangeProps | MonthMultiProps;

function Month(props: MonthSingleProps | MonthRangeProps | MonthMultiProps) {
    const {
        index,
        mode,
        date,
        dates,
        startDate,
        endDate,
        onPressDate,
        scrollMode,
        disableWeekDays,
        validRange,
        showOutsideDays,
        // customMonthStyles,
    } = props;
    const isHorizontal = scrollMode === 'horizontal';
    const { isDisabled, isWithinValidRange } = useRangeChecker(validRange);

    const { monthName, month, year } = useMemo(() => {
        const realIndex = getRealIndex(index);

        const md = addMonths(new Date(), realIndex);
        const y = md.getFullYear();
        const m = md.getMonth();

        return { monthName: format(md, 'LLLL'), month: m, year: y };
    }, [index]);

    const grid = useMemo(
        () =>
            generateCalendarGrid({
                year,
                month,
                index,
                isDisabled,
                mode,
                isWithinValidRange,
                startDate,
                endDate,
                dates,
                date,
                monthGrid,
            }),
        [year, month, index, isDisabled, mode, isWithinValidRange, startDate, endDate, dates, date],
    );

    const headerStyle = [
        datePickerMonthStyles.monthHeader,
        isHorizontal
            ? [
                  datePickerMonthStyles.dockedHeaderStyle,
                  {
                      marginTop: monthHeaderSingleMarginTop,
                      marginBottom: monthHeaderSingleMarginBottom,
                  },
              ]
            : null,
    ];

    return (
        <View>
            {!isHorizontal ? (
                <View style={headerStyle}>
                    <View
                        accessibilityLabel={`${monthName} ${year}`}
                        style={[datePickerMonthStyles.yearButton]}>
                        <View style={[datePickerMonthStyles.yearButtonInner]}>
                            <Text style={datePickerMonthStyles.monthLabel} selectable={false}>
                                {monthName} {year}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : null}
            {grid.map(({ weekIndex, generatedDays }) => (
                <Week
                    key={weekIndex}
                    weekIndex={weekIndex}
                    generatedDays={generatedDays}
                    disableWeekDays={disableWeekDays}
                    onPressDate={onPressDate}
                    showOutsideDays={showOutsideDays}
                    style={datePickerMonthStyles.weekContainerStyle}
                />
            ))}
        </View>
    );
}

const monthGrid = (index: number) => {
    return Array(getGridCount(index))
        .fill(null)
        .map((_, weekGrid) => {
            const days = Array(7).fill(null);
            return { weekGrid, days };
        });
};

function getIndexCount(index: number): number {
    if (index > startAtIndex) {
        return index - startAtIndex;
    }

    return -(startAtIndex - index);
}

function weeksOffset(index: number): number {
    if (index === startAtIndex) {
        return 0;
    }
    let off = 0;
    if (index > startAtIndex) {
        for (let i = 0; i < index - startAtIndex; i++) {
            const cIndex = startAtIndex + i;
            off += gridCounts[cIndex] || getGridCount(cIndex);
        }
    } else {
        for (let i = 0; i < startAtIndex - index; i++) {
            const cIndex = startAtIndex - i - 1;
            off -= gridCounts[cIndex] || getGridCount(cIndex);
        }
    }
    return off;
}

export function getIndexFromHorizontalOffset(offset: number, width: number): number {
    if (!Number.isFinite(offset) || !Number.isFinite(width) || width <= 1) {
        return startAtIndex;
    }

    const rawIndex = startAtIndex + Math.floor(offset / width);

    if (rawIndex < 0) {
        return 0;
    }

    if (rawIndex >= totalMonths) {
        return totalMonths - 1;
    }

    return rawIndex;
}

export function getIndexFromVerticalOffset(offset: number): number {
    let estimatedIndex = startAtIndex + Math.ceil(offset / estimatedMonthHeight);

    const realOffset = getVerticalMonthsOffset(estimatedIndex);
    const difference = (realOffset - beginOffset - offset) / estimatedMonthHeight;
    if (difference >= 1 || difference <= -1) {
        estimatedIndex -= Math.floor(difference);
    }
    return estimatedIndex;
}

export function getHorizontalMonthOffset(index: number, width: number) {
    if (index < 0) {
        return 0;
    }
    return width * index;
}

export function getVerticalMonthsOffset(index: number) {
    const count = getIndexCount(index);
    const ob = weeksOffset(index);
    const monthsHeight = weekSize * ob;
    const c = monthsHeight + count * (dayNamesHeight + montHeaderHeight);

    return (c || 0) + beginOffset;
}

export function getMonthHeight(scrollMode: 'horizontal' | 'vertical', index: number): number {
    const calendarHeight = getCalendarHeaderHeight(scrollMode);
    const gc = getGridCount(index);

    const currentMonthHeight = weekSize * gc;
    const extraHeight = scrollMode === 'horizontal' ? monthHeaderSingleHeight : montHeaderHeight;
    const c = calendarHeight + currentMonthHeight + extraHeight;
    return c || 0;
}

export default memo(Month);
