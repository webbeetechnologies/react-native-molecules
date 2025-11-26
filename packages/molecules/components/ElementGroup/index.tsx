import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import ElementGroupDefault from './ElementGroup';

registerMoleculesComponents({
    ElementGroup: ElementGroupDefault,
});

export const ElementGroup = getRegisteredComponentWithFallback('ElementGroup', ElementGroupDefault);

export type { Props as ElementGroupProps } from './ElementGroup';
export { elementGroupStyles } from './utils';
