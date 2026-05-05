import { createFastContext } from '../../fast-context';
import { registerPortalContext } from '../Portal';
import type { DefaultListItemT, ListContextValue } from './types';

const listContextDefaultValue: ListContextValue<DefaultListItemT> = {
    value: null,
    multiple: false,
    onAdd: () => {},
    onRemove: () => {},
    disabled: false,
    error: false,
    items: [],
    searchQuery: '',
    setSearchQuery: () => {},
    filteredItems: [],
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
