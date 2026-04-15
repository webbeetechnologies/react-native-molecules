import { getRegisteredComponentWithFallback } from '../../core';
import SelectDefault from './Select';

export const Select = getRegisteredComponentWithFallback('Select', SelectDefault);

export * from './context';
export type * from './types';
export * from './utils';
