import type { View } from 'react-native';

import { createFastContext } from '../../fast-context';
import {
    ListContext,
    ListContextProvider,
    useListContext,
    useListContextValue,
    useListStoreRef,
} from '../List';
import { registerPortalContext } from '../Portal';
import type { SelectDropdownContextValue } from './types';

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
};

const selectDropdownContextDefaultValue: SelectDropdownContextType = {
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    triggerRef: null,
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

registerPortalContext([SelectDropdownContext]);
