import { getRegisteredComponentWithFallback } from '../../core';
import BackdropDefault from './Backdrop';

export const Backdrop = getRegisteredComponentWithFallback('Backdrop', BackdropDefault);

export type { BackdropProps } from './types';
export { backdropStyles } from './utils'; // to import in ThemeProvider
