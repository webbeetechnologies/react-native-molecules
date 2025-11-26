import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
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

registerMoleculesComponents({
    RadioButton: RadioButtonDefault,
});

export const RadioButton = getRegisteredComponentWithFallback('RadioButton', RadioButtonDefault);

export { Props as RadioButtonProps } from './RadioButton';
export { Props as RadioButtonGroupProps } from './RadioButtonGroup';
export { Props as RadioButtonItemProps } from './RadioButtonItem';
export { radioButtonItemStyles, radioButtonStyles } from './utils';
