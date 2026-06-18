import { createContext } from 'react';

import type { Size } from './types';

export type RadioGroupContextType = {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    size?: Size;
};

export const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export type RadioItemContextType = {
    value: string;
    checked: boolean;
    onSelect: () => void;
    disabled?: boolean;
    size?: Size;
    labelId: string;
};

export const RadioItemContext = createContext<RadioItemContextType | null>(null);
