import type { ComponentType, ReactNode } from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';

import type { ListValue } from '../List';
import type { PopoverProps } from '../Popover';

export type {
    ListContentProps as SelectContentProps,
    ListContextValue as SelectContextValue,
    ListGroupProps as SelectGroupProps,
    ListSearchInputProps as SelectSearchInputProps,
} from '../List';

export type DefaultItemT = {
    id: string | number;
    label?: string;
    selectable?: boolean;
    [key: string]: any;
};

// SelectDropdownContext types
export type SelectDropdownContextValue = {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
};

// SelectProvider props
type SelectPropsBase<Option extends DefaultItemT = DefaultItemT> = {
    children: ReactNode;
    disabled?: boolean;
    error?: boolean;
    options: Option[];
    searchKey?: string;
    onSearchChange?: (query: string) => void;
    hideSelected?: boolean;
};

type SingleSelectProps<Option extends DefaultItemT = DefaultItemT> = {
    multiple?: false | undefined;
    value?: ListValue<Option, false>;
    defaultValue?: ListValue<Option, false>;
    onChange?: (
        value: ListValue<Option, false>,
        item: Option,
        event?: GestureResponderEvent,
    ) => void;
};

type MultipleSelectProps<Option extends DefaultItemT = DefaultItemT> = {
    multiple: true;
    value?: ListValue<Option, true>;
    defaultValue?: ListValue<Option, true>;
    onChange?: (
        value: ListValue<Option, true>,
        item: Option,
        event?: GestureResponderEvent,
    ) => void;
};

export type SelectProps<Option extends DefaultItemT = DefaultItemT> = SelectPropsBase<Option> &
    (SingleSelectProps<Option> | MultipleSelectProps<Option>);

// Select.Trigger props
export type SelectTriggerProps = ViewProps & {
    children?: ReactNode;
};

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
