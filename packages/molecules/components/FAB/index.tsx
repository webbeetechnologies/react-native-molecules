import { getRegisteredComponentWithFallback } from '../../core';
import FABDefault from './FAB';

export const FAB = getRegisteredComponentWithFallback('FAB', FABDefault);

export type { Props as FABProps } from './FAB';
export type { States } from './utils';
export { fabStyles } from './utils';
