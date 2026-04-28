import { DateCalendar } from './DateCalendar';
import { DatePickerActions } from './DatePickerActions';
import { DatePickerModal } from './DatePickerModal';
import { DatePickerPopover } from './DatePickerPopover';
import { DatePickerProvider } from './DatePickerProvider';
import { DatePickerTrigger } from './DatePickerTrigger';

export const DatePicker = {
    Provider: DatePickerProvider,
    Trigger: DatePickerTrigger,
    Actions: DatePickerActions,
    Calendar: DateCalendar,
    Modal: DatePickerModal,
    Popover: DatePickerPopover,
};

export type {
    DatePickerContextType,
    DatePickerLocale,
    DatePickerMode,
    DatePickerValue,
    DateValue,
    RangeValue,
} from './context';
export { DatePickerContext, useDatePickerContext, useOptionalDatePickerContext } from './context';
export type { DateCalendarProps } from './DateCalendar';
export type { DatePickerActionsProps } from './DatePickerActions';
export { DatePickerActions } from './DatePickerActions';
export type { DatePickerModalProps } from './DatePickerModal';
export { DatePickerModal } from './DatePickerModal';
export type { DatePickerPopoverProps } from './DatePickerPopover';
export { DatePickerPopover } from './DatePickerPopover';
export type { DatePickerProviderProps } from './DatePickerProvider';
export { DatePickerProvider } from './DatePickerProvider';
export { DatePickerTrigger } from './DatePickerTrigger';
export {
    datePickerHeaderItemStyles,
    datePickerModalContentHeaderStyles,
    datePickerModalEditStyles,
    datePickerModalHeaderBackgroundStyles,
    datePickerModalHeaderStyles,
    datePickerModalStyles,
    datePickerMonthItemStyles,
    datePickerMonthPickerStyles,
} from './utils';
