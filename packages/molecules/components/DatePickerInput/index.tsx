import { getRegisteredComponentWithFallback } from '../../core';
import DatePickerInputDefault from './DatePickerInput';

export const DatePickerInput = getRegisteredComponentWithFallback(
    'DatePickerInput',
    DatePickerInputDefault,
);

export type { DatePickerInputProps } from './types';
export type { DatePickerInputContextType } from './utils';
export { DatePickerInputContext, datePickerInputStyles } from './utils';
