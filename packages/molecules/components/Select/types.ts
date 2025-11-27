import type { ComponentType, ReactNode } from 'react';
import type {
    GestureResponderEvent,
    ScrollViewProps,
    TextInputProps,
    ViewProps,
} from 'react-native';

import type { PopoverProps } from '../Popover';

export type DefaultItemT = {
    id: string | number;
    label?: string;
    selectable?: boolean;
    [key: string]: any;
};

// SelectContext types
export type SelectContextValue<Option extends DefaultItemT = DefaultItemT> = {
    value: Option | Option[] | null;
    multiple: boolean;
    onAdd: (item: Option) => void;
    onRemove: (item: Option) => void;
    disabled?: boolean;
    error?: boolean;
    labelKey?: string;
    options: Option[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredOptions: Option[];
};

// SelectDropdownContext types
export type SelectDropdownContextValue = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
};

// SelectProvider props
export type SelectProviderProps<Option extends DefaultItemT = DefaultItemT> = {
    children: ReactNode;
    value?: Option['id'] | Option['id'][] | null;
    defaultValue?: Option['id'] | Option['id'][] | null;
    onChange?: (
        value: Option['id'] | Option['id'][] | null,
        item: Option,
        event?: GestureResponderEvent,
    ) => void;
    multiple?: boolean;
    disabled?: boolean;
    error?: boolean;
    labelKey?: string;
    options: Option[];
    searchKey?: string;
    onSearchChange?: (query: string) => void;
    hideSelected?: boolean;
};

// Select.Trigger props
export type SelectTriggerProps = ViewProps & {
    children?: ReactNode;
};

// Select.Value props
export type SelectValueProps = ViewProps & {
    placeholder?: string;
    renderValue?: (value: DefaultItemT | DefaultItemT[] | null) => ReactNode;
};

// Select.Dropdown props
export type SelectDropdownProps = Omit<
    PopoverProps,
    'isOpen' | 'onClose' | 'triggerRef' | 'children'
> & {
    children: ReactNode;
    WrapperComponent?: ComponentType<any>;
    wrapperComponentProps?: Record<string, any>;
};

// Select.Content props
export type SelectContentProps<Option extends DefaultItemT = DefaultItemT> = Omit<
    ScrollViewProps,
    'children'
> & {
    children: (item: Option, isSelected: boolean) => ReactNode;
    ContainerComponent?: ComponentType<any>;
    emptyState?: ReactNode;
};

// Select.Group props
export type SelectGroupProps = ViewProps & {
    children: ReactNode;
    label?: string;
};

// Select.Option props
export type SelectOptionProps<Option extends DefaultItemT = DefaultItemT> = ViewProps & {
    /**
     * Unique id for the option
     */
    value: Option['id'];
    children?: ReactNode;
    renderItem?: (item: Option, isSelected: boolean) => ReactNode;
    onPress?: (item: Option, event: GestureResponderEvent) => void;
    /**
     * When true, the option can't be selected (similar to HTML option disabled)
     */
    disabled?: boolean;
};

// Select.SearchInput props
export type SelectSearchInputProps = TextInputProps & {
    onQueryChange?: (query: string) => void;
};
