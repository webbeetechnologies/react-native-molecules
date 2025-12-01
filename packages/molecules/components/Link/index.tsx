import { getRegisteredComponentWithFallback } from '../../core';
import LinkDefault from './Link';

export const Link = getRegisteredComponentWithFallback('Link', LinkDefault);

export type { Props as LinkProps } from './Link';
export { linkStyles } from './utils';
