import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import IconButtonDefault from './IconButton';

registerMoleculesComponents({
    IconButton: IconButtonDefault,
});

export const IconButton = getRegisteredComponentWithFallback('IconButton', IconButtonDefault);

export type { Props as IconButtonProps } from './IconButton';
export { defaultStyles } from './utils';
