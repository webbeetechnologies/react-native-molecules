import { getRegisteredComponentWithFallback } from '../../core';
import DatePickerModalDefault from './DatePickerModal';

export const DatePickerModal = getRegisteredComponentWithFallback(
    'DatePickerModal',
    DatePickerModalDefault,
);

export type { DatePickerModalProps } from './types';
export {
    datePickerModalContentHeaderStyles,
    datePickerModalEditStyles,
    datePickerModalHeaderBackgroundStyles,
    datePickerModalHeaderStyles,
    datePickerModalStyles,
} from './utils';
