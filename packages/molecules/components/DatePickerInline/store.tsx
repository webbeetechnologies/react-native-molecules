import { createFastContext } from '../../fast-context';
import { registerPortalContext } from '../Portal/Portal';

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
    useContext: useDatePickerInlineStore,
    useContextValue: useDatePickerInlineStoreValue,
    useStoreRef: useDatePickerInlineStoreRef,
    Context: DatePickerInlineStoreContext,
} = createFastContext<Store>();

registerPortalContext(DatePickerInlineStoreContext);
