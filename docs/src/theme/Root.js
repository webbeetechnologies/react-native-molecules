import '../unistyles';

import React from 'react';
import { PortalProvider } from 'react-native-molecules/components/Portal';

export default function Root({ children }) {
    return <PortalProvider>{children}</PortalProvider>;
}
