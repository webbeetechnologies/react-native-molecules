import { createFastContext } from '@react-native-molecules/utils/fast-context';

import { registerPortalContext } from '../Portal';
import type { DefaultListItemT, ListContextValue } from './types';

const listContextDefaultValue: ListContextValue<DefaultListItemT> = {
    value: null,
    multiple: false,
    onAdd: () => {},
    onRemove: () => {},
    isSelectedId: () => false,
    disabled: false,
    error: false,
    allowDeselect: false,
};

const {
    useStoreRef: useListStoreRef,
    Provider: ListContextProvider,
    useContext: useListContext,
    useContextValue: useListContextValue,
    Context: ListContext,
} = createFastContext<ListContextValue<DefaultListItemT>>(listContextDefaultValue, true);

export { ListContext, ListContextProvider, useListContext, useListContextValue, useListStoreRef };

registerPortalContext([ListContext]);
