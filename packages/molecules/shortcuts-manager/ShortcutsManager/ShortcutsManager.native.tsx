import { memo } from 'react';

import type { ShortcutsManagerProps } from './utils';

const ShortcutsManager = ({ children }: ShortcutsManagerProps) => {
    return <>{children}</>;
};

export default memo(ShortcutsManager);
