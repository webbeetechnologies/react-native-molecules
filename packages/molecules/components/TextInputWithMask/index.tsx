import { getRegisteredComponentWithFallback } from '../../core';
import TextInputWithMaskDefault from './TextInputMask';

export const TextInputWithMask = getRegisteredComponentWithFallback(
    'TextInputWithMask',
    TextInputWithMaskDefault,
);
