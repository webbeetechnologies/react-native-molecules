import { getRegisteredComponentWithFallback } from '../../core';
import TextInputDefault from './TextInput';

export const TextInput = getRegisteredComponentWithFallback('TextInput', TextInputDefault);

export {
    type ElementProps as TextInputElementProps,
    type TextInputHandles,
    type Props as TextInputProps,
} from './TextInput';
export type * from './types';
export { styles as textInputStyles } from './utils';
