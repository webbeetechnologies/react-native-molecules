import { getRegisteredComponentWithFallback } from '../../core';
import SelectDefault from './Select';

export const Select = getRegisteredComponentWithFallback('Select', SelectDefault);

export type * from './types';
export * from './utils';
