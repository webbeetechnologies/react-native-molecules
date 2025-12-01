import { getRegisteredComponentWithFallback } from '../../core';
import InputAddonDefault from './InputAddon';

export const InputAddon = getRegisteredComponentWithFallback('InputAddon', InputAddonDefault);

export type { Props as InputAddonProps } from './InputAddon';
export { inputAddonStyles } from './utils';
