import { getRegisteredComponentWithFallback } from '../../core';
import RatingDefault from './Rating';

export const Rating = getRegisteredComponentWithFallback('Rating', RatingDefault);

export type { Props as RatingProps } from './Rating';
export type { Props as RatingItemProps } from './RatingItem';
export type { States } from './utils';
export { ratingItemStyles, ratingStyles } from './utils';
