import { getRegisteredComponentWithFallback } from '../../core';
import RadioButtonComponent from './RadioButton';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonItem from './RadioButtonItem';

const RadioButtonDefault = Object.assign(
    // @component ./RadioButton.tsx
    RadioButtonComponent,
    {
        // @component ./RadioButtonGroup.tsx
        Group: RadioButtonGroup,
        // @component ./RadioButtonItem.tsx
        Item: RadioButtonItem,
    },
);

export const RadioButton = getRegisteredComponentWithFallback('RadioButton', RadioButtonDefault);

export type { Props as RadioButtonProps } from './RadioButton';
export type { Props as RadioButtonGroupProps } from './RadioButtonGroup';
export type { Props as RadioButtonItemProps } from './RadioButtonItem';
export { radioButtonItemStyles, radioButtonStyles } from './utils';
