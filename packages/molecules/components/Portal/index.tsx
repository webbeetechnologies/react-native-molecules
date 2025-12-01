import { getRegisteredComponentWithFallback } from '../../core';
import PortalDefault from './Portal';

// @ts-ignore TODO - fix this error
export const Portal = getRegisteredComponentWithFallback('Portal', PortalDefault);

export { registerPortalContext } from './Portal';
export { PortalHost, PortalProvider } from '@gorhom/portal';
