import { getRegisteredComponentWithFallback } from '../../core';
import ButtonDefault, { ButtonActivityIndicator, ButtonIcon, ButtonText } from './Button';

const ButtonBase = getRegisteredComponentWithFallback('Button', ButtonDefault);

export const Button = Object.assign(ButtonBase, {
    Icon: ButtonIcon,
    Text: ButtonText,
    ActivityIndicator: ButtonActivityIndicator,
});

export type { Props as ButtonProps } from './Button';
export { ButtonContext, buttonIconStyles, buttonStyles, buttonTextStyles } from './utils';
