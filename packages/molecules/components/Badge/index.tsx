import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import BadgeDefault from './Badge';

registerMoleculesComponents({
    Badge: BadgeDefault,
});

export const Badge = getRegisteredComponentWithFallback('Badge', BadgeDefault);

export type { Props as BadgeProps } from './Badge';
export { badgeStyles } from './utils';
