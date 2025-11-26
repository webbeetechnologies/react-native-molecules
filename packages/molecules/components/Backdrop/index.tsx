import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import BackdropDefault from './Backdrop';

registerMoleculesComponents({
    Backdrop: BackdropDefault,
});

export const Backdrop = getRegisteredComponentWithFallback('Backdrop', BackdropDefault);

export type { BackdropProps } from './types';
export { backdropStyles } from './utils'; // to import in ThemeProvider
