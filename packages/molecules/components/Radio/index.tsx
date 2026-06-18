import { getRegisteredComponentWithFallback } from '../../core';
// @component ./Radio.tsx
import RadioControl, {
    RadioGroup as RadioGroupComponent,
    RadioLabel,
    RadioRow as RadioRowComponent,
} from './Radio';

const RadioDefault = Object.assign(RadioControl, {
    Label: RadioLabel,
    Group: RadioGroupComponent,
    Row: RadioRowComponent,
});

export const Radio = getRegisteredComponentWithFallback('Radio', RadioDefault);
export const RadioGroup = RadioGroupComponent;
export const RadioRow = RadioRowComponent;

export type { RadioGroupProps, RadioLabelProps, RadioProps, RadioRowProps } from './types';
export { radioRowStyles, radioStyles } from './utils';
