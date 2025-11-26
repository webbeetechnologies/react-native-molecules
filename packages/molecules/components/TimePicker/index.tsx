import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import TimePickerDefault from './TimePicker';

registerMoleculesComponents({
    TimePicker: TimePickerDefault,
});

export const TimePicker = getRegisteredComponentWithFallback('TimePicker', TimePickerDefault);

export type { Props as TimePickerProps } from './TimePicker';
export {
    timePickerAmPmSwitcherStyles,
    timePickerClockHoursStyles,
    timePickerClockMinutesStyles,
    timePickerClockStyles,
    timePickerInputsStyles,
    timePickerInputStyles,
    timePickerStyles,
} from './utils';
