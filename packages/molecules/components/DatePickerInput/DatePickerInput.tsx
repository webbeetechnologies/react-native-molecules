import { forwardRef, memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { useLatest, useToggle } from '../../hooks';
import { noop } from '../../utils/lodash';
import { DatePickerDocked } from '../DatePickerDocked';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import DatePickerInputModal from './DatePickerInputModal';
import DatePickerInputWithoutModal from './DatePickerInputWithoutModal';
import type { DatePickerInputProps } from './types';
import { DatePickerInputContext } from './utils';

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
        children,
        //locale = 'en',
        ...rest
    }: DatePickerInputProps,
    ref: any,
) {
    const triggerRef = useRef(null);
    const { state: isOpen, onToggle, handleOpen, handleClose } = useToggle(false);

    const onDismiss = useCallback(() => {
        handleClose();
    }, [handleClose]);

    const onChangeRef = useLatest(onChange);

    const onInnerConfirm = useCallback(
        ({ date }: any) => {
            handleClose();
            onChangeRef.current(date);
        },
        [handleClose, onChangeRef],
    );

    const onPressCalendarIcon = useCallback(() => {
        if (pickerMode === 'docked') {
            onToggle();
        } else {
            handleOpen();
        }
    }, [pickerMode, onToggle, handleOpen]);

    const renderers = {
        modal: (
            <DatePickerInputModal
                date={value}
                mode="single"
                isOpen={isOpen}
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

    const contextValue = useMemo(
        () => ({ isOpen, onPressTrigger: onPressCalendarIcon }),
        [isOpen, onPressCalendarIcon],
    );

    return (
        <DatePickerInputContext value={contextValue}>
            <DatePickerInputWithoutModal
                ref={ref}
                {...rest}
                disabled={disabled}
                value={value}
                inputMode={inputMode}
                validRange={validRange}
                onChange={onChange}
                // locale={locale}
            >
                <TextInput.Right>
                    {withModal || pickerMode === 'docked' ? (
                        <>
                            <IconButton
                                ref={triggerRef}
                                style={styles.calendarButton}
                                name={calendarIcon}
                                onPress={onPressCalendarIcon}
                                disabled={disabled}
                            />
                        </>
                    ) : null}
                </TextInput.Right>
                {children}
                {renderers[pickerMode]}
            </DatePickerInputWithoutModal>
        </DatePickerInputContext>
    );
}

const styles = StyleSheet.create({
    calendarButton: {
        marginRight: -4,
    },
});

export default memo(forwardRef(DatePickerInput));
