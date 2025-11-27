import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import SwitchDefault from './Switch';

registerMoleculesComponents({
    Switch: SwitchDefault,
});

export const Switch = getRegisteredComponentWithFallback('Switch', SwitchDefault);

export { type Props as SwitchProps } from './Switch';
export { switchStyles as defaultSwitchStyles } from './utils';
