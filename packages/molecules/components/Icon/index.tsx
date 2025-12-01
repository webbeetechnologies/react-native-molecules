import { getRegisteredComponentWithFallback } from '../../core';
import IconDefault from './Icon';

export const Icon = getRegisteredComponentWithFallback('Icon', IconDefault);

export { registerCustomIconType } from './iconFactory';
export type { IconPacks, IconProps, IconType } from './types';
