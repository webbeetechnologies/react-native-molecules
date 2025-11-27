import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import InputAddonDefault from './InputAddon';

registerMoleculesComponents({
    InputAddon: InputAddonDefault,
});

export const InputAddon = getRegisteredComponentWithFallback('InputAddon', InputAddonDefault);

export type { Props as InputAddonProps } from './InputAddon';
export { inputAddonStyles } from './utils';
