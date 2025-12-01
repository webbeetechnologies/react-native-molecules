import { getRegisteredComponentWithFallback } from '../../core';
import DatePickerDockedDefault from './DatePickerDocked';

export const DatePickerDocked = getRegisteredComponentWithFallback(
    'DatePickerDocked',
    DatePickerDockedDefault,
);

export type { DatePickerDockedProps } from './types';
export {
    datePickerDockedHeaderStyles,
    datePickerDockedMonthItemStyles,
    datePickerDockedMonthStyles,
    datePickerDockedStyles,
    datePickerHeaderItemStyles,
    datePickerMonthPickerStyles,
} from './utils';
