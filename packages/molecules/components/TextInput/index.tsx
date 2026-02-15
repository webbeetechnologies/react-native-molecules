import { getRegisteredComponentWithFallback } from '../../core';
import TextInputDefault, {
    TextInputIcon,
    TextInputLabel,
    TextInputLeft,
    TextInputOutline,
    TextInputRight,
    TextInputSupportingText,
} from './TextInput';

const TextInputBase = getRegisteredComponentWithFallback('TextInput', TextInputDefault);

export const TextInput = Object.assign(TextInputBase, {
    Label: TextInputLabel,
    Left: TextInputLeft,
    Right: TextInputRight,
    Icon: TextInputIcon,
    Outline: TextInputOutline,
    SupportingText: TextInputSupportingText,
});

export {
    type ElementProps as TextInputElementProps,
    type TextInputHandles,
    type Props as TextInputProps,
} from './TextInput';
export type * from './types';
export { TextInputContext, styles as textInputStyles } from './utils';
