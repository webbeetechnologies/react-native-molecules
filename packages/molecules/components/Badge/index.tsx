import { getRegisteredComponentWithFallback } from '../../core';
import BadgeDefault from './Badge';

export const Badge = getRegisteredComponentWithFallback('Badge', BadgeDefault);

export type { Props as BadgeProps } from './Badge';
export { badgeStyles } from './utils';
