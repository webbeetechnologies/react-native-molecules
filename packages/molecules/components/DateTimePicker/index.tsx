import { getRegisteredComponentWithFallback } from '../../core';
import DateTimePickerDefault from './DateTimePicker';

export const DateTimePicker = getRegisteredComponentWithFallback(
    'DateTimePicker',
    DateTimePickerDefault,
);

export type { Props as DateTimePickerProps } from './DateTimePicker';
export { dateTimePickerStyles } from './utils';
