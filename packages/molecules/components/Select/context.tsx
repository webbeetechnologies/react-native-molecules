import { createFastContext } from '@react-native-molecules/utils/fast-context';
import type { View } from 'react-native';

import {
    ListContext,
    ListContextProvider,
    useListContext,
    useListContextValue,
    useListStoreRef,
} from '../List';
import { registerPortalContext } from '../Portal';
import type { DefaultItemT, SelectDropdownContextValue, SelectSearchContextValue } from './types';

export {
    ListContext as SelectContext,
    ListContextProvider as SelectContextProvider,
    useListContext as useSelectContext,
    useListContextValue as useSelectContextValue,
    useListStoreRef as useSelectStoreRef,
};

// SelectDropdownContext - holds isOpen, onClose, triggerRef with fast-context
export type SelectDropdownContextType = SelectDropdownContextValue & {
    triggerRef: React.RefObject<View> | null;
    triggerLayout: { width: number; height: number } | null;
    setTriggerLayout: (layout: { width: number; height: number }) => void;
    triggerHovered?: boolean;
};

const selectDropdownContextDefaultValue: SelectDropdownContextType = {
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    triggerRef: null,
    triggerLayout: null,
    setTriggerLayout: () => {},
    triggerHovered: false,
};

const {
    useStoreRef: useSelectDropdownStoreRef,
    Provider: SelectDropdownContextProvider,
    useContext: useSelectDropdownContext,
    useContextValue: useSelectDropdownContextValue,
    Context: SelectDropdownContext,
} = createFastContext<SelectDropdownContextType>(selectDropdownContextDefaultValue, true);

const selectSearchContextDefaultValue: SelectSearchContextValue<DefaultItemT> = {
    searchQuery: '',
    setSearchQuery: () => {},
    allOptions: [],
    options: [],
    optionById: new Map(),
    getOptionId: item => item.id,
};

const {
    useStoreRef: useSelectSearchStoreRef,
    Provider: SelectSearchContextProvider,
    useContext: useSelectSearchContext,
    useContextValue: useSelectSearchContextValue,
    Context: SelectSearchContext,
} = createFastContext<SelectSearchContextValue<DefaultItemT>>(
    selectSearchContextDefaultValue,
    true,
);

export {
    SelectDropdownContext,
    SelectDropdownContextProvider,
    SelectSearchContext,
    SelectSearchContextProvider,
    useSelectDropdownContext,
    useSelectDropdownContextValue,
    useSelectDropdownStoreRef,
    useSelectSearchContext,
    useSelectSearchContextValue,
    useSelectSearchStoreRef,
};

registerPortalContext([SelectDropdownContext, SelectSearchContext]);
