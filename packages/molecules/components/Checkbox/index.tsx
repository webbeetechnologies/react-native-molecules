import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import CheckboxComponent from './Checkbox';

registerMoleculesComponents({
    Checkbox: CheckboxComponent,
});

export const Checkbox = getRegisteredComponentWithFallback('Checkbox', CheckboxComponent);

export type { Props as CheckboxProps } from './Checkbox';
export { styles as checkboxStyles } from './utils';
