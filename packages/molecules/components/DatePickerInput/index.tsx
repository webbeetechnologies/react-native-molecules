import { getRegisteredComponentWithFallback } from '../../core';
import DatePickerInputDefault from './DatePickerInput';

export const DatePickerInput = getRegisteredComponentWithFallback(
    'DatePickerInput',
    DatePickerInputDefault,
);

export type { DatePickerInputProps } from './types';
export { DatePickerInputContext, datePickerInputStyles } from './utils';
export type { DatePickerInputContextType } from './utils';
