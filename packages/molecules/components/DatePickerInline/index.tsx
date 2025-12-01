import { getRegisteredComponentWithFallback } from '../../core';
import DatePickerInlineDefault from './DatePickerInline';

export const DatePickerInline = getRegisteredComponentWithFallback(
    'DatePickerInline',
    DatePickerInlineDefault,
);

export { type DatePickerInlineProps, getStateValue } from './DatePickerInline';
export { default as DatePickerInlineBase } from './DatePickerInlineBase';
export type {
    BaseDatePickerProps,
    CalendarDate,
    CalendarDates,
    DatePickerInlineBaseProps,
    DatePickerMultiProps,
    DatePickerRangeProps,
    DatePickerSingleProps,
    ModeType,
    MultiChange,
    MultiConfirm,
    RangeChange,
    SingleChange,
    ValidRangeType,
} from './types';
export {
    dateDayNameStyles,
    datePickerDayEmptyStyles,
    datePickerDayRangeStyles,
    datePickerDayStyles,
    datePickerHeaderStyles,
    datePickerMonthStyles,
    datePickerStyles,
    datePickerWeekStyles,
    datePickerYearItemStyles,
    datePickerYearPickerStyles,
} from './utils';
