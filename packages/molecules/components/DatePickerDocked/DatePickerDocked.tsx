import { memo } from 'react';

import type { DatePickerDockedProps } from './types';
import DatePickerInlineBase from '../DatePickerInline/DatePickerInlineBase';
import DatePickerDockedHeader from './DatePickerDockedHeader';
import { datePickerDockedMonthStyles } from './utils';
import { Popover } from '../Popover';

const DatePickerDocked = (props: DatePickerDockedProps) => {
    const { triggerRef, isOpen, onToggle, onClose } = props;

    return (
        <Popover
            triggerRef={triggerRef}
            isOpen={isOpen}
            onClose={onClose}
            {...props.popoverContentProps}>
            <DatePickerInlineBase
                {...props}
                // TODO - fix ts issues
                // @ts-ignore
                HeaderComponent={DatePickerDockedHeader}
                onToggle={onToggle}
                monthStyle={datePickerDockedMonthStyles}
            />
        </Popover>
    );
};

export default memo(DatePickerDocked);
