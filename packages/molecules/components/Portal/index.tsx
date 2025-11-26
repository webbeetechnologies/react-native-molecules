import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import PortalDefault from './Portal';

registerMoleculesComponents({
    Portal: PortalDefault,
});

// @ts-ignore TODO - fix this error
export const Portal = getRegisteredComponentWithFallback('Portal', PortalDefault);

export { registerPortalContext } from './Portal';
export { PortalHost, PortalProvider } from '@gorhom/portal';
