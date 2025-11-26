import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import FABDefault from './FAB';

registerMoleculesComponents({
    FAB: FABDefault,
});

export const FAB = getRegisteredComponentWithFallback('FAB', FABDefault);

export type { Props as FABProps } from './FAB';
export type { States } from './utils';
export { fabStyles } from './utils';
