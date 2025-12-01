import { getRegisteredComponentWithFallback } from '../../core';
import AvatarDefault from './Avatar';

export const Avatar = getRegisteredComponentWithFallback('Avatar', AvatarDefault);

export type { Props as AvatarProps } from './Avatar';
export { avatarStyles } from './utils';
