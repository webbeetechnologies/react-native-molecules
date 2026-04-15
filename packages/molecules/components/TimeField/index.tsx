import { getRegisteredComponentWithFallback } from '../../core';
import TimeFieldDefault from './TimeField';

export const TimeField = getRegisteredComponentWithFallback('TimeField', TimeFieldDefault);

export type { TimeFieldProps } from './TimeField';
