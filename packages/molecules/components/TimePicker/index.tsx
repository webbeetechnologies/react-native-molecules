import { DatePickerProvider, DatePickerTrigger } from '../DatePicker';
import { TimePickerClock } from './TimePicker';
import { TimePickerModal } from './TimePickerModal';

export const TimePicker = {
    Provider: DatePickerProvider,
    Trigger: DatePickerTrigger,
    Clock: TimePickerClock,
    Modal: TimePickerModal,
};

export type { TimePickerContextType } from './context';
export { TimePickerContext, useOptionalTimePickerContext } from './context';
export type { Props as TimePickerProps } from './TimePicker';
export { TimePickerClock } from './TimePicker';
export type { TimePickerModalProps } from './TimePickerModal';
export { TimePickerModal } from './TimePickerModal';
export {
    timePickerAmPmSwitcherStyles,
    timePickerClockHoursStyles,
    timePickerClockMinutesStyles,
    timePickerClockStyles,
    timePickerInputsStyles,
    timePickerInputStyles,
    timePickerModalStyles,
    timePickerStyles,
} from './utils';
