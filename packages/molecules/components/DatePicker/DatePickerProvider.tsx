import type { ReactNode } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { getRegisteredComponentWithFallback } from '../../core';
import { useControlledValue } from '../../hooks';
import type { ValidRangeType } from '../DatePickerInline';
import type {
    DatePickerContextType,
    DatePickerLocale,
    DatePickerMode,
    DatePickerValue,
    RangeValue,
} from './context';
import { DatePickerContext, withDraftLayer } from './context';

const DATE_FORMAT_BY_MODE: Record<DatePickerMode, string> = {
    date: 'dd/MM/yyyy',
    time: 'HH:mm',
    datetime: 'dd/MM/yyyy HH:mm',
    range: 'dd/MM/yyyy',
};

const emptyRange: RangeValue = { start: null, end: null };

const nullValueFor = (mode: DatePickerMode): DatePickerValue =>
    mode === 'range' ? emptyRange : null;

export type DatePickerProviderProps = {
    mode?: DatePickerMode;
    value?: DatePickerValue;
    defaultValue?: DatePickerValue;
    onChange?: (value: DatePickerValue) => void;

    draft?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;

    locale?: DatePickerLocale;
    validRange?: ValidRangeType;
    is24Hour?: boolean;
    dateFormat?: string;
    disabled?: boolean;

    children: ReactNode;
};

function DatePickerProviderInner({
    mode = 'date',
    value: valueProp,
    defaultValue,
    onChange,
    draft: draftProp,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    locale,
    validRange,
    is24Hour = false,
    dateFormat,
    disabled,
    children,
}: DatePickerProviderProps) {
    const triggerRef = useRef<any>(null);

    const [value, setCommittedValue] = useControlledValue<DatePickerValue>({
        value: valueProp,
        defaultValue: defaultValue ?? nullValueFor(mode),
        onChange,
    });

    const [open, setOpen] = useControlledValue<boolean>({
        value: openProp,
        defaultValue: defaultOpen,
        onChange: onOpenChange,
    });

    const [draftBuffer, setDraftBuffer] = useState<DatePickerValue>(value);

    const prevOpenRef = useRef(open);
    const prevValueRef = useRef(value);

    if (open && !prevOpenRef.current && draftBuffer !== value) {
        setDraftBuffer(value);
    }
    if (prevValueRef.current !== value && draftBuffer !== value) {
        setDraftBuffer(value);
    }
    prevOpenRef.current = open;
    prevValueRef.current = value;

    const commitValue = useCallback(
        (next: DatePickerValue) => {
            setCommittedValue(next);
            setDraftBuffer(next);
        },
        [setCommittedValue],
    );

    const resolvedFormat = dateFormat ?? DATE_FORMAT_BY_MODE[mode];
    const defaultDraft = draftProp ?? true;

    const ctx = useMemo<DatePickerContextType>(() => {
        const base: DatePickerContextType = {
            mode,
            value,
            draftBuffer,
            setCommittedValue,
            setDraftBuffer,
            providerDraft: draftProp,

            // Placeholders — withDraftLayer rebuilds these.
            draft: defaultDraft,
            draftValue: value,
            setValue: () => {},
            commit: () => {},
            cancel: () => {},

            commitValue,

            open,
            setOpen,
            triggerRef,
            locale,
            validRange,
            is24Hour,
            dateFormat: resolvedFormat,
            disabled,
        };
        return withDraftLayer(base, defaultDraft);
    }, [
        mode,
        value,
        draftBuffer,
        setCommittedValue,
        draftProp,
        defaultDraft,
        commitValue,
        open,
        setOpen,
        locale,
        validRange,
        is24Hour,
        resolvedFormat,
        disabled,
    ]);

    return <DatePickerContext value={ctx}>{children}</DatePickerContext>;
}

const DatePickerProviderDefault = memo(DatePickerProviderInner);

export default DatePickerProviderDefault;

export const DatePickerProvider = getRegisteredComponentWithFallback(
    'DatePickerProvider',
    DatePickerProviderDefault,
);
