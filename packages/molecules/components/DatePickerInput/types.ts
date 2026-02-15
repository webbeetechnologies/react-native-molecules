import type { ViewProps } from 'react-native';

import type { ValidRangeType } from '../DatePickerInline';
import type { TextInputProps } from '../TextInput';

export interface DatePickerInputProps
    extends Omit<TextInputProps, 'value' | 'onChange' | 'onChangeText' | 'inputMode'> {
    inputMode: 'start' | 'end';
    locale?: string;
    onChange?: (date: Date | null) => void;
    value?: Date | null;
    validRange?: ValidRangeType | undefined;
    withModal?: boolean;
    calendarIcon?: string;
    /**
     * date format of the input
     * should be date-fns accepted format
     * We currently only accept the variations of dd MM yyyy
     * */
    dateFormat?: string;
    pickerMode?: 'docked' | 'modal';
    startYear?: number;
    endYear?: number;
    dockedPopoverContentProps?: ViewProps;
}
export interface DatePickerInputWithoutModalProps extends Omit<DatePickerInputProps, 'withModal'> {}
