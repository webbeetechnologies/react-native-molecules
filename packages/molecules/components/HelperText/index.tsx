import { getRegisteredComponentWithFallback } from '../../core';
import HelperTextDefault from './HelperText';

export const HelperText = getRegisteredComponentWithFallback('HelperText', HelperTextDefault);

export { type Props as HelperTextProps } from './HelperText';
export { helperTextStylesDefault } from './utils';
