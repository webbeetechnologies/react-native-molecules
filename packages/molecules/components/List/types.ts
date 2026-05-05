import type { ComponentProps, ComponentType, ReactNode } from 'react';
import {
    type GestureResponderEvent,
    ScrollView,
    type TextInputProps,
    type ViewProps,
} from 'react-native';

import type { InternalListItemProps as ListItemProps } from './List';

export type DefaultListItemT = {
    id: string | number;
    label?: string;
    selectable?: boolean;
    [key: string]: any;
};

export type ListValue<
    Option extends DefaultListItemT,
    Multiple extends boolean,
> = Multiple extends true ? Option['id'][] : Option['id'] | null;

export type ListContextValue<Option extends DefaultListItemT = DefaultListItemT> = {
    value: Option['id'] | Option['id'][] | null;
    multiple: boolean;
    onAdd: (item: Option) => void;
    onRemove: (item: Option) => void;
    disabled?: boolean;
    error: boolean;
    items: Option[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredItems: Option[];
};

type ListPropsBase<Option extends DefaultListItemT = DefaultListItemT> = {
    children: ReactNode;
    items: Option[];
    disabled?: boolean;
    error?: boolean;
    searchKey?: string;
    onSearchChange?: (query: string) => void;
    hideSelected?: boolean;
};

type SingleListProps<Option extends DefaultListItemT = DefaultListItemT> = {
    multiple?: false | undefined;
    value?: ListValue<Option, false>;
    defaultValue?: ListValue<Option, false>;
    onChange?: (
        value: ListValue<Option, false>,
        item: Option,
        event?: GestureResponderEvent,
    ) => void;
};

type MultipleListProps<Option extends DefaultListItemT = DefaultListItemT> = {
    multiple: true;
    value?: ListValue<Option, true>;
    defaultValue?: ListValue<Option, true>;
    onChange?: (
        value: ListValue<Option, true>,
        item: Option,
        event?: GestureResponderEvent,
    ) => void;
};

export type ListProps<Option extends DefaultListItemT = DefaultListItemT> = ListPropsBase<Option> &
    (SingleListProps<Option> | MultipleListProps<Option>);

/**
 * Arguments passed to the `processProps` callback on `<List.Content>`.
 *
 * Use these to adapt `List` context state into the prop contract required by
 * a custom container (for example `FlatList`'s `data`/`renderItem` or
 * `SectionList`'s `sections`/`renderItem`).
 */
export type ListContentProcessPropsArgs<
    Option extends DefaultListItemT = DefaultListItemT,
    ContainerProps extends Record<string, any> = Record<string, any>,
> = {
    /** The user-provided props on `<List.Content>` minus `children`/`ref`. */
    props: ContainerProps;
    /** The current `filteredItems` from the List context. */
    items: Option[];
    /** True when there are no items to render after filtering. */
    isEmpty: boolean;
    /** Resolved empty state node (caller-provided or the default). */
    emptyState: ReactNode;
    /** Returns whether the given item is currently selected. */
    isSelected: (item: Option) => boolean;
};

type ListContentPropsShared<C extends ComponentType<any> = typeof ScrollView> = Partial<
    Omit<ComponentProps<C>, 'children' | 'ref'>
> & {
    /**
     * The component used to render the scrollable container. Defaults to ScrollView.
     * The rest of the props on `<List.Content>` are inferred from this component's props.
     *
     * Required props (e.g. `FlatList`'s `data`/`renderItem`) can be supplied
     * either directly or via `processProps`.
     */
    ContainerComponent?: C;
    emptyState?: ReactNode;
};

export type ListContentProps<
    Option extends DefaultListItemT = DefaultListItemT,
    C extends ComponentType<any> = typeof ScrollView,
> = ListContentPropsShared<C> &
    (
        | {
              /**
               * Optional when `processProps` renders rows/items itself (e.g. chunked grid rows).
               */
              processProps: (
                  args: ListContentProcessPropsArgs<
                      Option,
                      Omit<ComponentProps<C>, 'children' | 'ref'>
                  >,
              ) => ComponentProps<C>;
              children?: (item: Option, isSelected: boolean) => ReactNode;
          }
        | {
              processProps?: undefined;
              children: (item: Option, isSelected: boolean) => ReactNode;
          }
    );

export type ListGroupProps = ViewProps & {
    children: ReactNode;
    label?: string;
};

export type ListItemOptionProps<Option extends DefaultListItemT = DefaultListItemT> = Omit<
    ListItemProps,
    'children' | 'selected' | 'disabled' | 'onPress'
> & {
    value: Option['id'];
    children: ReactNode;
    onPress?: (item: Option, event: GestureResponderEvent) => void;
    disabled?: boolean;
    shouldToggleOnPress?: boolean;
    accessibilityRole?: any;
    accessibilityState?: Record<string, unknown>;
};

export type ListSearchInputProps = Omit<TextInputProps, 'value' | 'onChangeText'>;
