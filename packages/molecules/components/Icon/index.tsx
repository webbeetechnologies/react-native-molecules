import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import IconDefault from './Icon';

registerMoleculesComponents({
    Icon: IconDefault,
});

export const Icon = getRegisteredComponentWithFallback('Icon', IconDefault);

export { registerCustomIconType } from './iconFactory';
export type { IconPacks, IconProps, IconType } from './types';
