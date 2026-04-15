import { createContext, useContext } from 'react';

import { registerPortalContext } from '../Portal';
import type { PossibleInputTypes } from './timeUtils';

export type TimePickerContextType = {
    inputType: PossibleInputTypes;
    setInputType: (next: PossibleInputTypes) => void;
};

export const TimePickerContext = createContext<TimePickerContextType | null>(null);

export function useOptionalTimePickerContext(): TimePickerContextType | null {
    return useContext(TimePickerContext);
}

registerPortalContext(TimePickerContext);
