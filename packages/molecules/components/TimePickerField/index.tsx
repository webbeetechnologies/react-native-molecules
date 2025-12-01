import { getRegisteredComponentWithFallback } from '../../core';
import TimePickerFieldDefault from './TimePickerField';

export const TimePickerField = getRegisteredComponentWithFallback(
    'TimePickerField',
    TimePickerFieldDefault,
);

export { type Props as TimePickerFieldProps } from './TimePickerField';
export { sanitizeTimeString, styles } from './utils';
