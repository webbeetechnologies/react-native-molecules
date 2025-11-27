import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import TextInputWithMaskDefault from './TextInputMask';

registerMoleculesComponents({
    TextInputWithMask: TextInputWithMaskDefault,
});

export const TextInputWithMask = getRegisteredComponentWithFallback(
    'TextInputWithMask',
    TextInputWithMaskDefault,
);
