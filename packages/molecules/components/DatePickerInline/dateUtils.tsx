import { useCallback } from 'react';

import { useLatest } from '../../hooks';
import type { CalendarDate, CalendarDates, ValidRangeType } from './types';

export type DisableWeekDaysType = number[];

export function showWeekDay(dayIndex: number, disableWeekDays?: DisableWeekDaysType): boolean {
    return !(disableWeekDays && disableWeekDays.some(di => di === dayIndex));
}

export function dateToUnix(d: Date): number {
    return Math.round(d.getTime() / 1000);
}

export function addMonths(date: Date, count: number) {
    const n = date.getDate();
    const n2 = new Date(date.getTime());
    n2.setDate(1);
    n2.setMonth(n2.getMonth() + count);
    n2.setDate(Math.min(n, getDaysInMonth({ year: n2.getFullYear(), month: n2.getMonth() })));

    return n2;
}

// https://stackoverflow.com/a/1185068/2508481
// pass in any date as parameter anyDateInMonth based on dayjs
export function getDaysInMonth({ year, month }: { year: number; month: number }): number {
    return [31, isLeapYear({ year }) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

export function getFirstDayOfMonth({ year, month }: { year: number; month: number }): number {
    return new Date(year, month, 1).getDay();
}

export function useRangeChecker(validRange: ValidRangeType | undefined) {
    const validStart = validRange?.startDate;
    const validEnd = validRange?.endDate;
    const startUnix =
        validStart instanceof Date ? dateToUnix(getStartOfDay(validStart)) : undefined;

    const endUnix = validEnd instanceof Date ? dateToUnix(getEndOfDay(validEnd)) : undefined;

    const validDisabledDatesRef = useLatest(validRange?.disabledDates);

    const isWithinValidRange = useCallback(
        (day: Date) => {
            return isDateWithinOptionalRange(day, {
                startUnix: startUnix,
                endUnix: endUnix,
            });
        },
        [startUnix, endUnix],
    );

    const isDisabled = useCallback(
        (day: Date) => {
            return validDisabledDatesRef.current
                ? validDisabledDatesRef.current.some(disabledDate =>
                      areDatesOnSameDay(disabledDate, day),
                  )
                : false;
        },
        [validDisabledDatesRef],
    );

    return { isDisabled, isWithinValidRange, validStart, validEnd };
}

export function areDatesOnSameDay(a: Date, b?: Date | null | undefined) {
    if (!b) {
        return false;
    }

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function isDateBetween(
    date: Date,
    {
        startDate,
        endDate,
    }: {
        startDate?: Date | null | undefined;
        endDate?: Date | null | undefined;
    },
): boolean {
    if (!startDate || !endDate) {
        return false;
    }
    return date <= endDate && date >= startDate;
}

/**
 * Check if a date is within an optional range.
 *
 * If the range doesn't exist, it defaults to `true`.
 */
export function isDateWithinOptionalRange(
    date: Date,
    { startUnix, endUnix }: { startUnix: number | undefined; endUnix: number | undefined },
) {
    const dateUnix = dateToUnix(date);
    // if startUnix is provided and date is before start
    if (startUnix && dateUnix < startUnix) {
        return false;
    }

    // if endUnix is provided and date is after end
    if (endUnix && dateUnix > endUnix) {
        return false;
    }

    return true;
}

export function isLeapYear({ year }: { year: number }) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const daySize = 40;
export const estimatedMonthHeight = 360;
// TODO This number startAtIndex is not adding any significance to the date picker, So we probably will change the logic.
export const startAtIndex = 1200;
export const totalMonths = startAtIndex * 2;
export const beginOffset = estimatedMonthHeight * startAtIndex;
export const gridCounts = new Array<number | undefined>(totalMonths);

export function getGridCount(index: number) {
    const cHeight = gridCounts[index];
    if (cHeight) {
        return cHeight + 1;
    }
    const monthDate = addMonths(new Date(), getRealIndex(index));
    const h = getGridCountForDate(monthDate);
    gridCounts[index] = h;
    return h;
}

export function getGridCountForDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth({ year, month });
    const dayOfWeek = getFirstDayOfMonth({ year, month });
    return Math.ceil((daysInMonth + dayOfWeek) / 7);
}

export function getRealIndex(index: number) {
    return index - startAtIndex;
}

export function getInitialIndex(date: Date | undefined) {
    if (!date) {
        return startAtIndex;
    }

    const today = new Date();
    const months = differenceInMonths(today, date);

    return startAtIndex + months;
}

export function getStartOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
}

export function getEndOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}

export function differenceInMonths(firstDate: Date, secondDate: Date) {
    let diffMonths = (secondDate.getFullYear() - firstDate.getFullYear()) * 12;
    diffMonths -= firstDate.getMonth();
    diffMonths += secondDate.getMonth();
    return diffMonths;
}

type GenerateCalendarGridArgs = {
    year: number;
    month: number;
    monthGrid: (index: number) => { days: any[]; weekGrid: number }[];
    index: number;
    isDisabled: (day: Date) => boolean;
    startDate: CalendarDate;
    endDate: CalendarDate;
    mode: 'single' | 'range' | 'multiple';
    dates: CalendarDates;
    date: CalendarDate;
    isWithinValidRange: (day: Date) => boolean;
};

export const generateCalendarGrid = ({
    year,
    month,
    monthGrid,
    index,
    isDisabled,
    startDate,
    endDate,
    mode,
    dates,
    date,
    isWithinValidRange,
}: GenerateCalendarGridArgs) => {
    const today = new Date();

    const daysInMonth = getDaysInMonth({ year, month });
    const dayOfWeek = getFirstDayOfMonth({ year, month });
    const emptyDays = dayOfWeek;

    return monthGrid(index).map(({ days, weekGrid }) => {
        return {
            weekIndex: weekGrid,
            generatedDays: days.map((_, dayIndex) => {
                const isFirstWeek = weekGrid === 0;
                const realDayIndex = emptyDays - dayIndex;
                const beforeWeekDay = isFirstWeek && realDayIndex > 0;
                const dayOfMonth = weekGrid * 7 + dayIndex - emptyDays + 1;
                const afterWeekDay = dayOfMonth > daysInMonth;

                const day = new Date(year, month, dayOfMonth);
                const isToday = areDatesOnSameDay(day, today);

                let inRange = false;
                let disabled = isDisabled(day);
                let selected = false;

                let leftCrop = dayOfMonth === 1;
                let rightCrop = dayOfMonth === daysInMonth;

                const isFirstDayOfMonth = dayOfMonth === 1;
                const isLastDayOfMonth = dayOfMonth === daysInMonth;

                if (mode === 'range') {
                    const selectedStartDay = areDatesOnSameDay(day, startDate);
                    const selectedEndDay = areDatesOnSameDay(day, endDate);
                    selected = selectedStartDay || selectedEndDay;
                    inRange = isDateBetween(day, {
                        startDate,
                        endDate,
                    });
                    if (selectedStartDay) {
                        leftCrop = true;
                    }
                    if (selectedEndDay) {
                        rightCrop = true;
                    }
                    if (dayIndex === 0 && !selectedStartDay) {
                        leftCrop = false;
                    }

                    if (dayIndex === 6 && !selectedEndDay) {
                        rightCrop = false;
                    }

                    if (
                        (isFirstDayOfMonth && selectedEndDay) ||
                        (isLastDayOfMonth && selectedStartDay)
                    ) {
                        inRange = false;
                    }
                } else if (mode === 'multiple') {
                    const safeDates = dates || [];
                    selected = safeDates.some(d => areDatesOnSameDay(day, d));

                    const yesterday = new Date(year, month, dayOfMonth - 1);
                    const tomorrow = new Date(year, month, dayOfMonth + 1);

                    const yesterdaySelected = safeDates.some(d => areDatesOnSameDay(d, yesterday));
                    const tomorrowSelected = safeDates.some(d => areDatesOnSameDay(d, tomorrow));

                    if (selected) {
                        if (tomorrowSelected && yesterdaySelected) {
                            inRange = true;
                        }
                        if (tomorrowSelected && !yesterdaySelected) {
                            inRange = true;
                            leftCrop = true;
                        }

                        if (yesterdaySelected && !tomorrowSelected) {
                            inRange = true;
                            rightCrop = true;
                        }

                        if (isFirstDayOfMonth && !tomorrowSelected) {
                            inRange = false;
                        }

                        if (isLastDayOfMonth && !yesterdaySelected) {
                            inRange = false;
                        }

                        if (inRange && !leftCrop && !rightCrop) {
                            selected = false;
                        }
                    }
                } else if (mode === 'single') {
                    selected = areDatesOnSameDay(day, date);
                }

                const isWithinOptionalValidRange = isWithinValidRange(day);

                if (inRange && !disabled) {
                    disabled = false;
                }

                if (!isWithinOptionalValidRange) {
                    disabled = true;
                }

                return {
                    beforeWeekDay,
                    afterWeekDay,
                    year,
                    month,
                    dayOfMonth,
                    dayIndex,
                    mode,
                    selected,
                    inRange,
                    leftCrop,
                    rightCrop,
                    isToday,
                    disabled,
                };
            }),
        };
    });
};
