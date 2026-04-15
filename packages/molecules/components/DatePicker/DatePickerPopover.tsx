import type { ReactNode, RefObject } from 'react';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentWithFallback } from '../../core';
import { Popover, type PopoverProps } from '../Popover';
import { DatePickerContext, useOptionalDatePickerContext, withDraftLayer } from './context';
import { DatePickerActions } from './DatePickerActions';

export type DatePickerPopoverProps = Omit<
    PopoverProps,
    'children' | 'triggerRef' | 'isOpen' | 'onClose'
> & {
    children: ReactNode;
    triggerRef?: RefObject<any>;
    isOpen?: boolean;
    onClose?: () => void;
    /** Override the surface default draft mode. Popover defaults to `false` (auto-save). */
    draft?: boolean;
};

function DatePickerPopoverInner({
    children,
    triggerRef: triggerRefProp,
    isOpen: isOpenProp,
    onClose: onCloseProp,
    draft: draftProp,
    ...rest
}: DatePickerPopoverProps) {
    const base = useOptionalDatePickerContext();

    const effectiveDraft = draftProp ?? base?.providerDraft ?? false;
    const ctx = useMemo(
        () => (base ? withDraftLayer(base, effectiveDraft) : null),
        [base, effectiveDraft],
    );

    const triggerRef = triggerRefProp ?? ctx?.triggerRef;
    const isOpen = isOpenProp ?? ctx?.open ?? false;
    const onClose = onCloseProp ?? (() => ctx?.setOpen(false));

    if (!triggerRef || !ctx) return null;

    return (
        <DatePickerContext value={ctx}>
            <Popover
                align="end"
                position="bottom"
                offset={20}
                {...rest}
                style={[styles.popover, rest.style]}
                triggerRef={triggerRef}
                isOpen={isOpen}
                onClose={onClose}>
                <View>
                    {children}
                    <DatePickerActions />
                </View>
            </Popover>
        </DatePickerContext>
    );
}

const styles = StyleSheet.create(theme => ({
    popover: {
        borderRadius: theme.shapes.corner.large,
        overflow: 'hidden',
    },
}));

const DatePickerPopoverDefault = memo(DatePickerPopoverInner);

export default DatePickerPopoverDefault;

export const DatePickerPopover = getRegisteredComponentWithFallback(
    'DatePickerPopover',
    DatePickerPopoverDefault,
);
