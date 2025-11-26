import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import HelperTextDefault from './HelperText';

registerMoleculesComponents({
    HelperText: HelperTextDefault,
});

export const HelperText = getRegisteredComponentWithFallback('HelperText', HelperTextDefault);

export { type Props as HelperTextProps } from './HelperText';
export { helperTextStylesDefault } from './utils';
