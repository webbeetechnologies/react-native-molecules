import { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useLatest, useToggle } from '../../hooks';
import { noop } from '../../utils/lodash';
import { DatePickerDocked } from '../DatePickerDocked';
import { IconButton } from '../IconButton';
import DatePickerInputModal from './DatePickerInputModal';
import DatePickerInputWithoutModal from './DatePickerInputWithoutModal';
import type { DatePickerInputProps } from './types';

function DatePickerInput(
    {
        withModal = true,
        calendarIcon = 'calendar',
        value,
        locale,
        inputMode,
        validRange,
        onChange = noop,
        disabled = false,
        pickerMode = 'modal',
        startYear,
        endYear,
        dockedPopoverContentProps,
        //locale = 'en',
        ...rest
    }: DatePickerInputProps,
    ref: any,
) {
    const triggerRef = useRef(null);
    const { state: isOpen, onToggle } = useToggle(false);
    const [visible, setVisible] = useState<boolean>(false);

    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onChangeRef = useLatest(onChange);

    const onInnerConfirm = useCallback(
        ({ date }: any) => {
            setVisible(false);
            onChangeRef.current(date);
        },
        [setVisible, onChangeRef],
    );

    const onPressCalendarIcon = useCallback(() => {
        if (pickerMode === 'docked') {
            onToggle();
        }
        setVisible(true);
    }, [pickerMode, onToggle]);

    const renderers = useMemo(() => {
        return {
            modal: (
                <DatePickerInputModal
                    date={value}
                    mode="single"
                    isOpen={visible}
                    onClose={onDismiss}
                    onConfirm={onInnerConfirm}
                    locale={locale}
                    validRange={validRange}
                />
            ),
            docked: (
                <DatePickerDocked
                    date={value}
                    locale={locale}
                    startYear={startYear}
                    endYear={endYear}
                    onChange={onInnerConfirm}
                    isOpen={isOpen}
                    onClose={onDismiss}
                    onToggle={onToggle}
                    triggerRef={triggerRef}
                    popoverContentProps={dockedPopoverContentProps}
                />
            ),
        };
    }, [
        dockedPopoverContentProps,
        endYear,
        isOpen,
        locale,
        onDismiss,
        onInnerConfirm,
        onToggle,
        startYear,
        validRange,
        value,
        visible,
    ]);

    const rightElement = useMemo(
        () => (
            <>
                {withModal || pickerMode === 'docked' ? (
                    <>
                        <IconButton
                            ref={triggerRef}
                            style={styles.calendarButton}
                            name={calendarIcon}
                            onPress={onPressCalendarIcon}
                            disabled={disabled}
                        />
                        {renderers[pickerMode]}
                    </>
                ) : null}
            </>
        ),
        [calendarIcon, disabled, onPressCalendarIcon, pickerMode, renderers, withModal],
    );

    return (
        <DatePickerInputWithoutModal
            ref={ref}
            {...rest}
            disabled={disabled}
            value={value}
            inputMode={inputMode}
            validRange={validRange}
            onChange={onChange}
            // locale={locale}
            inputButtons={rightElement}
        />
    );
}

const styles = StyleSheet.create({
    calendarButton: {
        marginRight: -4,
    },
});

export default memo(forwardRef(DatePickerInput));
