import { getRegisteredComponentWithFallback } from '../../core';
import VerticalDividerDefault from './VerticalDivider';

export const VerticalDivider = getRegisteredComponentWithFallback(
    'VerticalDivider',
    VerticalDividerDefault,
);

export { type Props as VerticalDividerProps, verticalDividerStyles } from './VerticalDivider';
