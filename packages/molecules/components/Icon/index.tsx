import { getRegisteredComponentWithFallback } from '../../core';
import IconDefault from './Icon';

export const Icon = getRegisteredComponentWithFallback('Icon', IconDefault);

export { registerCustomIconType } from './iconFactory';
export type { CustomIconTypes, IconProps, IconType } from './types';
