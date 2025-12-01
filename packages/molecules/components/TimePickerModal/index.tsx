import { getRegisteredComponentWithFallback } from '../../core';
import TimePickerModalDefault from './TimePickerModal';

export const TimePickerModal = getRegisteredComponentWithFallback(
    'TimePickerModal',
    TimePickerModalDefault,
);

export type { Props as TimePickerModalProps } from './TimePickerModal';
export { styles } from './utils';
