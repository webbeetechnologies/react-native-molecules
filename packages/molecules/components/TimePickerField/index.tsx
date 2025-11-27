import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import TimePickerFieldDefault from './TimePickerField';

registerMoleculesComponents({
    TimePickerField: TimePickerFieldDefault,
});

export const TimePickerField = getRegisteredComponentWithFallback(
    'TimePickerField',
    TimePickerFieldDefault,
);

export { type Props as TimePickerFieldProps } from './TimePickerField';
export { sanitizeTimeString, styles } from './utils';
