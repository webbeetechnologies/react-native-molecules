import '../unistyles';

import { PortalProvider } from 'react-native-molecules/components/Portal';
import React from 'react';

export default function Root({ children }) {
    return <PortalProvider>{children}</PortalProvider>;
}
