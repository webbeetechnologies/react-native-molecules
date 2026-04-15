import type { ReactElement } from 'react';
import { memo, useCallback } from 'react';

import { getRegisteredComponentWithFallback } from '../../core';
import { Slot } from '../Slot';
import { useDatePickerContext } from './context';

const DatePickerTriggerDefault = memo(({ children }: { children: ReactElement }) => {
    const { open, setOpen, disabled, triggerRef } = useDatePickerContext();

    const onPress = useCallback(() => setOpen(!open), [open, setOpen]);

    return (
        <Slot ref={triggerRef} onPress={onPress} disabled={disabled}>
            {children}
        </Slot>
    );
});

export const DatePickerTrigger = getRegisteredComponentWithFallback(
    'DatePickerTrigger',
    DatePickerTriggerDefault,
);
