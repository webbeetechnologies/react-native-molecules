import { getRegisteredComponentWithFallback } from '../../core';
import TouchableRippleDefault from './TouchableRipple';

export const TouchableRipple = getRegisteredComponentWithFallback(
    'TouchableRipple',
    TouchableRippleDefault,
);

export type { Props as TouchableRippleProps } from './TouchableRipple';
export { touchableRippleStyles } from './utils';
