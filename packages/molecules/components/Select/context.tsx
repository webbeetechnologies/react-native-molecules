import type { View } from 'react-native';

import { createFastContext } from '../../fast-context';
import { registerPortalContext } from '../Portal';
import type { DefaultItemT, SelectContextValue, SelectDropdownContextValue } from './types';

// SelectContext - holds value, onAdd, onRemove with fast-context for optimized rendering
const selectContextDefaultValue: SelectContextValue<DefaultItemT> = {
    value: null,
    multiple: false,
    onAdd: () => {},
    onRemove: () => {},
    disabled: false,
    error: false,
    labelKey: 'label',
    options: [],
    searchQuery: '',
    setSearchQuery: () => {},
    filteredOptions: [],
};

const {
    useStoreRef: useSelectStoreRef,
    Provider: SelectContextProvider,
    useContext: useSelectContext,
    useContextValue: useSelectContextValue,
    Context: SelectContext,
} = createFastContext<SelectContextValue<DefaultItemT>>(selectContextDefaultValue, true);

export {
    SelectContext,
    SelectContextProvider,
    useSelectContext,
    useSelectContextValue,
    useSelectStoreRef,
};

// SelectDropdownContext - holds isOpen, onClose, triggerRef with fast-context
export type SelectDropdownContextType = SelectDropdownContextValue & {
    triggerRef: React.RefObject<View> | null;
    contentRef: React.RefObject<any> | null;
    triggerLayout: { width: number; height: number } | null;
    setTriggerLayout: (layout: { width: number; height: number }) => void;
};

const selectDropdownContextDefaultValue: SelectDropdownContextType = {
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    triggerRef: null,
    contentRef: null,
    triggerLayout: null,
    setTriggerLayout: () => {},
};

const {
    useStoreRef: useSelectDropdownStoreRef,
    Provider: SelectDropdownContextProvider,
    useContext: useSelectDropdownContext,
    useContextValue: useSelectDropdownContextValue,
    Context: SelectDropdownContext,
} = createFastContext<SelectDropdownContextType>(selectDropdownContextDefaultValue, true);

export {
    SelectDropdownContext,
    SelectDropdownContextProvider,
    useSelectDropdownContext,
    useSelectDropdownContextValue,
    useSelectDropdownStoreRef,
};

registerPortalContext([SelectContext, SelectDropdownContext]);
