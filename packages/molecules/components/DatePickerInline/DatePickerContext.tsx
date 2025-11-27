import { createFastContext } from '../../fast-context';

export type Store = {
    localDate: Date;
    startDateYear: number;
    endDateYear: number;
    pickerType: 'month' | 'year' | undefined;
};

export const defaultValue = {
    localDate: new Date(),
    startDateYear: 1800,
    endDateYear: 2200,
    pickerType: undefined,
};

export const {
    Provider,
    useContext: useDatePickerStore,
    useContextValue: useDatePickerStoreValue,
} = createFastContext<Store>();
