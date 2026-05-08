import type { ComponentType, ReactNode } from 'react';
import type { GestureResponderEvent, TextInputProps, ViewProps } from 'react-native';

import type { ListContentProps, ListItemId, ListValue } from '../List';
import type { PopoverProps } from '../Popover';

export type { ListContextValue as SelectContextValue } from '../List';

export type DefaultItemT = {
    id: string | number;
    label?: string;
    selectable?: boolean;
    [key: string]: unknown;
};

// SelectDropdownContext types
export type SelectDropdownContextValue = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
};

export type SelectSearchMode = 'client' | 'external';

export type SelectSearchKey<Option extends object = DefaultItemT> =
    | string
    | string[]
    | ((item: Option, query: string) => boolean);

export type SelectSearchContextValue<Option extends DefaultItemT = DefaultItemT> = {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    allOptions: Option[];
    options: Option[];
    optionById: Map<ListItemId, Option>;
    getOptionId: (item: Option) => ListItemId;
};

// SelectProvider props
type SelectPropsBase<Option extends DefaultItemT = DefaultItemT> = {
    children: ReactNode;
    disabled?: boolean;
    error?: boolean;
    options: Option[];
    searchKey?: SelectSearchKey<Option>;
    searchQuery?: string;
    defaultSearchQuery?: string;
    onSearchChange?: (query: string) => void;
    searchMode?: SelectSearchMode;
    allowDeselect?: boolean;
    getItemId?: (item: Option) => ListItemId;
};

export type SelectSearchInputProps = Omit<TextInputProps, 'value' | 'onChangeText'>;

type SingleSelectProps<Option extends DefaultItemT = DefaultItemT> = {
    multiple?: false | undefined;
    value?: ListValue<false>;
    defaultValue?: ListValue<false>;
    onChange?: (value: ListValue<false>, item: Option, event?: GestureResponderEvent) => void;
};

type MultipleSelectProps<Option extends DefaultItemT = DefaultItemT> = {
    multiple: true;
    value?: ListValue<true>;
    defaultValue?: ListValue<true>;
    onChange?: (value: ListValue<true>, item: Option, event?: GestureResponderEvent) => void;
};

export type SelectProps<Option extends DefaultItemT = DefaultItemT> = SelectPropsBase<Option> &
    (SingleSelectProps<Option> | MultipleSelectProps<Option>);

export type SelectContentProps<Option extends DefaultItemT = DefaultItemT> = Omit<
    ListContentProps,
    'children'
> & {
    children?: ReactNode | ((item: Option, isSelected: boolean) => ReactNode);
};

// Select.Trigger props
export type SelectTriggerProps = ViewProps & {
    children?: ReactNode;
};

export type SelectTriggerOutlineProps = ViewProps;

// Select.Value props
export type SelectValueProps = ViewProps & {
    placeholder?: string;
    labelKey?: string;
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

// Select.Option props
// `accessibilityRole` and `role` are intentionally omitted: Select.Option forces them to
// "option" on web so the dropdown's keyboard navigator (which queries [role="option"]) can
// always find the rows. Allowing callers to override would silently break keyboard nav.
export type SelectOptionProps<Option extends DefaultItemT = DefaultItemT> = Omit<
    ViewProps,
    'accessibilityRole' | 'role'
> & {
    /**
     * Unique id for the option
     */
    value: Option['id'];
    children: ReactNode;
    onPress?: (item: Option, event: GestureResponderEvent) => void;
    /**
     * When true, the option can't be selected (similar to HTML option disabled)
     */
    disabled?: boolean;
};
