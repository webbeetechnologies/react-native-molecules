import { Portal as GorhomPortal } from '@gorhom/portal';
import { type ComponentType, type ReactNode } from 'react';

import { createContextBridge } from '../../context-bridge';

const { BridgedComponent: Portal, registerContextToBridge: registerPortalContext } =
    createContextBridge<Omit<any, 'children'> & { children: ReactNode }>(
        'portal-context',
        GorhomPortal as ComponentType<any>,
    );

export { registerPortalContext };
export default Portal;
