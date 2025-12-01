import { getRegisteredComponentWithFallback } from '../../core';
import ButtonDefault from './Button';

export const Button = getRegisteredComponentWithFallback('Button', ButtonDefault);

export type { Props as ButtonProps } from './Button';
export { defaultStyles } from './utils';
