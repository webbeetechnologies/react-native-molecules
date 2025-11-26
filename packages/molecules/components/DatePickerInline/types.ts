import type { MemoExoticComponent } from 'react';
import type { ViewStyle } from 'react-native';

import type { CalendarHeaderProps } from './DatePickerInlineHeader';
import type { DisableWeekDaysType } from './dateUtils';

export interface BaseMonthProps {
    locale: undefined | string;
    scrollMode: 'horizontal' | 'vertical';
    disableWeekDays?: DisableWeekDaysType;
    mode: ModeType;
    index: number;
    onPressDate: (date: Date) => any;
    validRange?: ValidRangeType;
    customMonthStyles?: Record<string, any>;

    // some of these should be required in final implementation
    date?: CalendarDate;
    dates?: CalendarDates;
    startDate?: CalendarDate;
    endDate?: CalendarDate;
}

export interface MonthRangeProps extends BaseMonthProps {
    mode: 'range';
    startDate: CalendarDate;
    endDate: CalendarDate;
}

export interface MonthSingleProps extends BaseMonthProps {
    mode: 'single';
    date: CalendarDate;
}

export interface MonthMultiProps extends BaseMonthProps {
    mode: 'multiple';
    dates: CalendarDates;
}

export type ModeType = 'single' | 'range' | 'multiple';

export type ValidRangeType = {
    startDate?: Date;
    endDate?: Date;
    disabledDates?: Date[];
};

export type BaseDatePickerProps = {
    locale?: string;
    disableWeekDays?: DisableWeekDaysType;
    validRange?: ValidRangeType;
    startYear?: number;
    endYear?: number;
    HeaderComponent?: MemoExoticComponent<CalendarHeaderProps | any>;
    monthStyle?: Record<string, any>;

    // here they are optional but in final implemenation they are required
    date?: CalendarDate;
    dates?: CalendarDates;
    startDate?: CalendarDate;
    endDate?: CalendarDate;
    dateMode?: 'start' | 'end';
    style?: ViewStyle;
    onToggle?: () => void;
};

export type CalendarDate = Date | null | undefined;
export type CalendarDates = Date[] | undefined | null;

export type RangeChange = (params: { startDate: CalendarDate; endDate: CalendarDate }) => any;

export type SingleChange = (params: { date: CalendarDate }) => void;

export type MultiChange = (params: {
    dates: CalendarDates;
    datePressed: Date;
    change: 'added' | 'removed';
}) => any;

export type MultiConfirm = (params: { dates: Date[] }) => void;

export interface DatePickerSingleProps extends BaseDatePickerProps {
    mode?: 'single';
    date?: CalendarDate;
    onChange?: SingleChange;
}

export interface DatePickerRangeProps extends BaseDatePickerProps {
    mode?: 'range';
    startDate?: CalendarDate;
    endDate?: CalendarDate;
    onChange?: RangeChange;
}

export interface DatePickerMultiProps extends BaseDatePickerProps {
    mode?: 'multiple';
    dates?: CalendarDates;
    onChange?: MultiChange;
}

export type DatePickerInlineBaseProps =
    | DatePickerSingleProps
    | DatePickerRangeProps
    | DatePickerMultiProps;
