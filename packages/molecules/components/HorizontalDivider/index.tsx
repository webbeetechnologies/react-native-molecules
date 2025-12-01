import { getRegisteredComponentWithFallback } from '../../core';
import HorizontalDividerDefault from './HorizontalDivider';

export const HorizontalDivider = getRegisteredComponentWithFallback(
    'HorizontalDivider',
    HorizontalDividerDefault,
);

export { type Props as HorizontalDividerProps, horizontalDividerStyles } from './HorizontalDivider';
