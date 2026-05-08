import { Portal as GorhomPortal } from '@gorhom/portal';
import { createContextBridge } from '@react-native-molecules/utils/context-bridge';
import { type ComponentType, type ReactNode } from 'react';

const { BridgedComponent: Portal, registerContextToBridge: registerPortalContext } =
    createContextBridge<Omit<any, 'children'> & { children: ReactNode }>(
        'portal-context',
        GorhomPortal as ComponentType<any>,
    );

export { registerPortalContext };
export default Portal;
