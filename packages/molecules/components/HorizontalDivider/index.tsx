import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import HorizontalDividerDefault from './HorizontalDivider';

registerMoleculesComponents({
    HorizontalDivider: HorizontalDividerDefault,
});

export const HorizontalDivider = getRegisteredComponentWithFallback(
    'HorizontalDivider',
    HorizontalDividerDefault,
);

export { type Props as HorizontalDividerProps, horizontalDividerStyles } from './HorizontalDivider';
