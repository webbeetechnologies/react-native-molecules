import { getRegisteredComponentWithFallback } from '../../core';
import SwitchDefault from './Switch';

export const Switch = getRegisteredComponentWithFallback('Switch', SwitchDefault);

export { type Props as SwitchProps } from './Switch';
export { switchStyles as defaultSwitchStyles } from './utils';
