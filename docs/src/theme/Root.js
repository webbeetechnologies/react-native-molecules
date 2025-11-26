import '../unistyles';

import { PortalProvider } from '@bambooapp/bamboo-molecules/components/Portal';
import React from 'react';

export default function Root({ children }) {
    return <PortalProvider>{children}</PortalProvider>;
}
