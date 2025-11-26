import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import TimePickerModalDefault from './TimePickerModal';

registerMoleculesComponents({
    TimePickerModal: TimePickerModalDefault,
});

export const TimePickerModal = getRegisteredComponentWithFallback(
    'TimePickerModal',
    TimePickerModalDefault,
);

export type { Props as TimePickerModalProps } from './TimePickerModal';
export { styles } from './utils';
