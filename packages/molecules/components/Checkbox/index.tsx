import { getRegisteredComponentWithFallback } from '../../core';
// @component ./Checkbox.tsx
import CheckboxBox, { CheckboxLabel, CheckboxRow as CheckboxRowComponent } from './Checkbox';

const CheckboxDefault = Object.assign(CheckboxBox, {
    Label: CheckboxLabel,
    Row: CheckboxRowComponent,
});

export const Checkbox = getRegisteredComponentWithFallback('Checkbox', CheckboxDefault);
export const CheckboxRow = CheckboxRowComponent;

export type { CheckboxLabelProps, CheckboxProps, CheckboxRowProps } from './types';
export { checkboxRowStyles, styles as checkboxStyles } from './utils';
