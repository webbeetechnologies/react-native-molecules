import { getRegisteredComponentWithFallback } from '../../core';
import IconButtonDefault from './IconButton';

export const IconButton = getRegisteredComponentWithFallback('IconButton', IconButtonDefault);

export type { Props as IconButtonProps } from './IconButton';
export type * from './types';
export { defaultStyles } from './utils';
