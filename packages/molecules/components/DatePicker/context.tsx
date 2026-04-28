import type { RefObject } from 'react';
import { createContext, useContext } from 'react';

import type { ValidRangeType } from '../DatePickerInline';
import { registerPortalContext } from '../Portal';

export type DatePickerMode = 'date' | 'time' | 'datetime' | 'range';
export type DatePickerLocale = Intl.LocalesArgument;

export type DateValue = Date | null;
export type RangeValue = { start: Date | null; end: Date | null };
export type DatePickerValue = DateValue | RangeValue;

export type DatePickerContextType = {
    mode: DatePickerMode;

    // Raw state shared across layers.
    value: DatePickerValue;
    draftBuffer: DatePickerValue;
    setCommittedValue: (value: DatePickerValue) => void;
    setDraftBuffer: (value: DatePickerValue) => void;

    // User's explicit `draft` prop on <DatePicker.Provider>. Undefined if not passed.
    providerDraft: boolean | undefined;

    // Resolved for this layer — surfaces override these via withDraftLayer.
    draft: boolean;
    draftValue: DatePickerValue;
    setValue: (value: DatePickerValue) => void;
    commit: () => void;
    cancel: () => void;

    // Bypass setter for typed-entry fields — always commits, ignores draft.
    commitValue: (value: DatePickerValue) => void;

    open: boolean;
    setOpen: (open: boolean) => void;
    triggerRef: RefObject<any>;
    locale?: DatePickerLocale;
    validRange?: ValidRangeType;
    is24Hour: boolean;
    dateFormat: string;
    disabled?: boolean;
};

/** Rebuilds draft-derived fields on top of a base context for a specific layer's draft mode. */
export function withDraftLayer(base: DatePickerContextType, draft: boolean): DatePickerContextType {
    return {
        ...base,
        draft,
        draftValue: draft ? base.draftBuffer : base.value,
        setValue: next => {
            if (draft) base.setDraftBuffer(next);
            else base.setCommittedValue(next);
        },
        commit: () => {
            if (draft) base.setCommittedValue(base.draftBuffer);
            base.setOpen(false);
        },
        cancel: () => {
            base.setDraftBuffer(base.value);
            base.setOpen(false);
        },
    };
}

export const DatePickerContext = createContext<DatePickerContextType | null>(null);

export function useDatePickerContext(): DatePickerContextType {
    const ctx = useContext(DatePickerContext);
    if (!ctx) {
        throw new Error(
            'useDatePickerContext must be used within a <DatePickerProvider>. Wrap your date/time components with <DatePickerProvider>.',
        );
    }
    return ctx;
}

export function useOptionalDatePickerContext(): DatePickerContextType | null {
    return useContext(DatePickerContext);
}

registerPortalContext(DatePickerContext);
