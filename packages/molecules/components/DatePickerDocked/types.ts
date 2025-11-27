import type { ViewProps } from 'react-native';

import type { DatePickerSingleProps } from '../DatePickerInline';

export type DatePickerDockedProps = DatePickerSingleProps & {
    triggerRef: any;
    onToggle: () => void;
    onClose: () => void;
    isOpen: boolean;
    popoverContentProps?: ViewProps;
};
