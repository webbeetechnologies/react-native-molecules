import { getRegisteredComponentWithFallback } from '../../core';
import SurfaceDefault from './Surface';

export const Surface = getRegisteredComponentWithFallback('Surface', SurfaceDefault);

export * from './BackgroundContextWrapper';
export type { Props as SurfaceProps } from './Surface';
export { defaultStyles as surfaceStyles } from './utils';
