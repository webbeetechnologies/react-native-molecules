import { createContext } from 'react';

import type { Size } from './types';

export type CheckboxItemContextType = {
    checked: boolean;
    onToggle: () => void;
    disabled?: boolean;
    indeterminate?: boolean;
    size?: Size;
    labelId: string;
};

export const CheckboxItemContext = createContext<CheckboxItemContextType | null>(null);
