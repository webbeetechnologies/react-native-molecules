import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import SurfaceDefault from './Surface';

registerMoleculesComponents({
    Surface: SurfaceDefault,
});

export const Surface = getRegisteredComponentWithFallback('Surface', SurfaceDefault);

export * from './BackgroundContextWrapper';
export type { Props as SurfaceProps } from './Surface';
export { defaultStyles as surfaceStyles } from './utils';
