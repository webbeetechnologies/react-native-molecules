import type { ViewStyle } from 'react-native';

import type {
    BaseDatePickerProps,
    CalendarDate,
    CalendarDates,
    MultiChange,
    MultiConfirm,
    RangeChange,
    SingleChange,
} from '../DatePickerInline';
import type { HeaderPickProps } from './DatePickerModalContentHeader';

export type LocalState = LocalStateSingle | LocalStateMultiple | LocalStateRange;

export type LocalStateSingle = {
    date: CalendarDate;
};

export type LocalStateMultiple = {
    dates: CalendarDates;
};

export type LocalStateRange = {
    startDate: CalendarDate;
    endDate: CalendarDate;
};

interface DatePickerModalContentBaseProps {
    inputFormat?: string;
    locale?: string;
    onClose: () => any;
    disableSafeTop?: boolean;
    saveLabelDisabled?: boolean;
}

export interface DatePickerModalContentRangeProps
    extends HeaderPickProps,
        BaseDatePickerProps,
        DatePickerModalContentBaseProps {
    mode?: 'range';
    startDate?: CalendarDate;
    endDate?: CalendarDate;
    onChange?: RangeChange;
    onConfirm?: RangeChange;
}

export interface DatePickerModalContentSingleProps
    extends HeaderPickProps,
        BaseDatePickerProps,
        DatePickerModalContentBaseProps {
    mode?: 'single';
    date?: CalendarDate;
    onChange?: SingleChange;
    onConfirm?: SingleChange;
    dateMode?: 'start' | 'end';
}

export interface DatePickerModalContentMultiProps
    extends HeaderPickProps,
        BaseDatePickerProps,
        DatePickerModalContentBaseProps {
    mode?: 'multiple';
    dates?: CalendarDates;
    onChange?: MultiChange;
    onConfirm?: MultiConfirm;
}

interface BaseDatePickerModalProps {
    isOpen: boolean;
    animationType?: 'slide' | 'fade' | 'none';
    disableStatusBar?: boolean;
    disableStatusBarPadding?: boolean;
    style?: ViewStyle;
}

export interface DatePickerModalSingleProps
    extends DatePickerModalContentSingleProps,
        BaseDatePickerModalProps {}

export interface DatePickerModalMultiProps
    extends DatePickerModalContentMultiProps,
        BaseDatePickerModalProps {}

export interface DatePickerModalRangeProps
    extends DatePickerModalContentRangeProps,
        BaseDatePickerModalProps {}

export type DatePickerModalProps =
    | DatePickerModalRangeProps
    | DatePickerModalSingleProps
    | DatePickerModalMultiProps;
