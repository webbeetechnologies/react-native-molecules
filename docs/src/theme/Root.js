import '../unistyles';

import React from 'react';
import { PortalProvider } from 'react-native-molecules/components/Portal';

import FontLoader from './FontLoader';

export default function Root({ children }) {
    return (
        <PortalProvider>
            <FontLoader />
            {children}
        </PortalProvider>
    );
}
