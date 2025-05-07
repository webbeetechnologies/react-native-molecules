import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import AvatarDefault from './Avatar';

registerMoleculesComponents({
    Avatar: AvatarDefault,
});

export const Avatar = getRegisteredComponentWithFallback('Avatar', AvatarDefault);

export type { Props as AvatarProps } from './Avatar';
export { avatarStyles } from './utils';
