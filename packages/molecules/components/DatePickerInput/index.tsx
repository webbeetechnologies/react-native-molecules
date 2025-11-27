import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import DatePickerInputDefault from './DatePickerInput';

registerMoleculesComponents({
    DatePickerInput: DatePickerInputDefault,
});

export const DatePickerInput = getRegisteredComponentWithFallback(
    'DatePickerInput',
    DatePickerInputDefault,
);

export type { DatePickerInputProps } from './types';
export { datePickerInputStyles } from './utils';
