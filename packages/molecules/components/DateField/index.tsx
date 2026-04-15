import { getRegisteredComponentWithFallback } from '../../core';
import DateFieldDefault from './DateField';

export const DateField = getRegisteredComponentWithFallback('DateField', DateFieldDefault);

export type { DateFieldInputMode, DateFieldProps } from './DateField';
