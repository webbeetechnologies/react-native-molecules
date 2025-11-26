import { memo } from 'react';

import DatePickerInlineBase from '../DatePickerInline/DatePickerInlineBase';
import { Popover } from '../Popover';
import DatePickerDockedHeader from './DatePickerDockedHeader';
import type { DatePickerDockedProps } from './types';
import { datePickerDockedMonthStyles } from './utils';

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
