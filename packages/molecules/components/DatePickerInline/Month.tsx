import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { format } from '../../utils/date-fns';
import { Text } from '../Text';
import { useDatePickerStoreValue } from './DatePickerContext';
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
        // customMonthStyles,
    } = props;
    const { localDate } = useDatePickerStoreValue(state => ({ localDate: state.localDate }));
    // const monthStyles = useComponentStyles('DatePicker_Month', customMonthStyles);

    const isHorizontal = scrollMode === 'horizontal';
    const { isDisabled, isWithinValidRange } = useRangeChecker(validRange);

    const { monthName, month, year } = useMemo(() => {
        const realIndex = getRealIndex(index);

        const md = addMonths(new Date(), realIndex);
        const y = mode === 'single' ? localDate.getFullYear() : md.getFullYear();
        const m = mode === 'single' ? localDate.getMonth() : md.getMonth();

        return { monthName: format(md, 'LLLL'), month: m, year: y };
    }, [index, localDate, mode]);

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

    const { headerStyle, yearButtonStyle, yearInnerStyle, monthLabelStyle, weekContainerStyle } =
        useMemo(() => {
            // const {
            //     monthLabel: _monthLabel,
            //     yearButton,
            //     yearButtonInner,
            //     month: _monthStyle,
            //     monthHeader,
            //     dockedHeaderStyle,
            //     weekContainerStyle: weekContainer,
            // } = monthStyles;
            // const { typescale, ...monthLabel } = _monthLabel;

            return {
                headerStyle: [
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
                ],
                yearButtonStyle: datePickerMonthStyles.yearButton,
                yearInnerStyle: datePickerMonthStyles.yearButtonInner,
                monthLabelStyle: [datePickerMonthStyles.monthLabel],
                weekContainerStyle: datePickerMonthStyles.weekContainerStyle,
            };
        }, [isHorizontal]);

    const renderHeader = useCallback(() => {
        if (!isHorizontal) {
            return (
                <View style={headerStyle}>
                    <View accessibilityLabel={`${monthName} ${year}`} style={yearButtonStyle}>
                        <View style={yearInnerStyle}>
                            <Text style={monthLabelStyle} selectable={false}>
                                {monthName} {year}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    }, [
        headerStyle,
        isHorizontal,
        monthLabelStyle,
        monthName,
        year,
        yearButtonStyle,
        yearInnerStyle,
    ]);

    return (
        <View>
            {renderHeader()}
            {grid.map(({ weekIndex, generatedDays }) => (
                <Week
                    key={weekIndex}
                    weekIndex={weekIndex}
                    generatedDays={generatedDays}
                    disableWeekDays={disableWeekDays}
                    onPressDate={onPressDate}
                    style={weekContainerStyle}
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
    return startAtIndex + Math.floor(offset / width);
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
