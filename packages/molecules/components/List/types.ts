import type { ReactNode, RefObject } from 'react';
import {
    type AccessibilityRole,
    type GestureResponderEvent,
    type ScrollViewProps,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import type { TouchableRippleProps } from '../TouchableRipple';

export type ListItemId = string | number;

export type DefaultListItemT = {
    id?: ListItemId;
    label?: string;
    selectable?: boolean;
    [key: string]: unknown;
};

export type ListValue<Multiple extends boolean = false> = Multiple extends true
    ? ListItemId[]
    : ListItemId | null;

export type ListEmptyStateRender = (ctx: {
    /** True when `items` (the raw input) has at least one entry. */
    hasItems: boolean;
}) => ReactNode;

export type ListContextValue<Option extends object = DefaultListItemT> = {
    value: ListItemId | ListItemId[] | null;
    multiple: boolean;
    onAdd: (item: Option) => void;
    onRemove: (item: Option) => void;
    isSelectedId: (id: ListItemId) => boolean;
    disabled?: boolean;
    error: boolean;
    allowDeselect: boolean;
};

type ListPropsBase = {
    children: ReactNode;
    disabled?: boolean;
    error?: boolean;
    /**
     * Whether re-clicking the currently-selected row should remove it. Defaults
     * to `true` for multiple, `false` for single (re-clicking the picked row
     * in a "pick one and close" flow shouldn't clear the value).
     */
    allowDeselect?: boolean;
};

type SingleListProps<Option extends object = DefaultListItemT> = {
    multiple?: false | undefined;
    value?: ListValue<false>;
    defaultValue?: ListValue<false>;
    onChange?: (value: ListValue<false>, item: Option, event?: GestureResponderEvent) => void;
};

type MultipleListProps<Option extends object = DefaultListItemT> = {
    multiple: true;
    value?: ListValue<true>;
    defaultValue?: ListValue<true>;
    onChange?: (value: ListValue<true>, item: Option, event?: GestureResponderEvent) => void;
};

export type ListProps<Option extends object = DefaultListItemT> = ListPropsBase &
    (SingleListProps<Option> | MultipleListProps<Option>);

export type ListContentProps = Omit<ScrollViewProps, 'children'> & {
    children?: ReactNode;
};

/**
 * Props for `<List.Item>`. When `value` is provided, the item participates in the
 * surrounding `<List>` context — it derives its `selected` state from the context's
 * value and toggles selection on press (unless `shouldToggleOnPress` is false).
 *
 * Without `value`, the item is a plain styled row (use it for menu-style entries
 * that don't represent a selectable option).
 *
 * Note: when `value` is set, both `onPress` and the selection toggle fire on press,
 * in that order. For most cases that's fine — pass `onPress` for side effects
 * (e.g. closing a menu) and let the toggle drive `onChange`. Pass
 * `onBeforeToggle` for side effects that should only run when the built-in
 * toggle will happen. Set `shouldToggleOnPress={false}` to suppress the toggle entirely.
 *
 * Deselection: by default, single-select rows do **not** deselect on re-click
 * (use `<List allowDeselect>` to opt in or out at the list level).
 */
export type ListItemProps<Option extends object = DefaultListItemT> = Omit<
    TouchableRippleProps,
    'children' | 'onPress'
> & {
    ref?: RefObject<unknown>;
    children?: ReactNode;
    value?: ListItemId;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'menuItem';
    selected?: boolean;
    disabled?: boolean;
    hovered?: boolean;
    hoverable?: boolean;
    shouldToggleOnPress?: boolean;
    /** Runs after `onPress`, before the built-in selection toggle. */
    onBeforeToggle?: (event: GestureResponderEvent) => void;
    onPress?: (event: GestureResponderEvent) => void;
    accessibilityRole?: AccessibilityRole;
    accessibilityState?: Record<string, unknown>;
    /** Reserved for generic item shape; not consumed directly. */
    __optionType?: Option;
};

export type ListItemElementProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
};
