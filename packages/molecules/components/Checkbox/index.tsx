import { getRegisteredComponentWithFallback } from '../../core';
import CheckboxComponent from './Checkbox';

export const Checkbox = getRegisteredComponentWithFallback('Checkbox', CheckboxComponent);

export type { Props as CheckboxProps } from './Checkbox';
export { styles as checkboxStyles } from './utils';
