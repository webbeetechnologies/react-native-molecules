import { getRegisteredComponentWithFallback } from '../../core';
import StateLayerDefault from './StateLayer';

export const StateLayer = getRegisteredComponentWithFallback('StateLayer', StateLayerDefault);

export type { Props as StateLayerProps } from './StateLayer';
export { stateLayerStyles } from './utils';
