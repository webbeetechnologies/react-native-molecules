import { memo, useCallback, useMemo } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';

import { typedMemo } from '../../hocs';
import { useActionState, useControlledValue, useLatest } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { StateLayer } from '../StateLayer';
import { TouchableRipple } from '../TouchableRipple';
import { ListContextProvider, useListContextValue } from './context';
import type {
    DefaultListItemT,
    ListContentProps,
    ListContextValue,
    ListItemId,
    ListItemProps,
    ListProps,
} from './types';
import { listItemStyles } from './utils';

const _ListItemBase = ({
    ref,
    children,
    style: styleProp,
    disabled = false,
    variant = 'menuItem',
    selected = false,
    onPress,
    hoverable: hoverableProp = false,
    hovered: hoveredProp = false,
    ...props
}: ListItemProps) => {
    const {
        hovered: _hovered,
        focused,
        actionsRef,
    } = useActionState({ ref, actionsToListen: ['hover', 'focus'] });
    const hoverable = hoverableProp || !!onPress;
    const hovered = hoveredProp || _hovered;

    const state = resolveStateVariant({
        selectedAndFocused: selected && focused,
        selected,
        disabled,
        hovered: hoverable && hovered,
        focused,
    });

    listItemStyles.useVariants({
        state: state as never,
        variant: variant as never,
    });

    const containerStyles = useMemo(
        () => [listItemStyles.root, styleProp],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [styleProp, state, variant],
    );

    return (
        <TouchableRipple
            {...props}
            style={containerStyles as StyleProp<ViewStyle>}
            disabled={disabled}
            onPress={onPress}
            ref={actionsRef}>
            <>
                {children}
                <StateLayer style={listItemStyles.stateLayer} />
            </>
        </TouchableRipple>
    );
};

const ListItemBase = memo(_ListItemBase);

const _ListItemSelectable = <Option extends object = DefaultListItemT>({
    value,
    children,
    onPress,
    onBeforeToggle,
    disabled: itemDisabledProp = false,
    shouldToggleOnPress = true,
    accessibilityRole,
    accessibilityState,
    variant,
    ...rest
}: ListItemProps<Option> & { value: ListItemId }) => {
    const {
        onAdd,
        onRemove,
        disabled: listDisabled,
        allowDeselect,
        isSelectedId,
    } = useListContextValue(state => ({
        onAdd: state.onAdd as (item: Option) => void,
        onRemove: state.onRemove as (item: Option) => void,
        disabled: state.disabled,
        allowDeselect: state.allowDeselect,
        isSelectedId: state.isSelectedId,
    }));

    const option = useMemo(
        () =>
            ({
                id: value,
                ...(itemDisabledProp ? { selectable: false } : {}),
            } as Option),
        [itemDisabledProp, value],
    );

    const isSelected = isSelectedId(value);

    const isSelectable = (option as Record<string, unknown>).selectable;
    const isOptionDisabled = Boolean(listDisabled || itemDisabledProp || isSelectable === false);

    const handlePress = useCallback(
        (
            event: NonNullable<ListItemProps<Option>['onPress']> extends (event: infer E) => void
                ? E
                : never,
        ) => {
            if (isOptionDisabled) return;
            onPress?.(event);

            if (!shouldToggleOnPress) return;
            onBeforeToggle?.(event);

            if (isSelected) {
                if (allowDeselect) onRemove(option);
                return;
            }
            onAdd(option);
        },
        [
            allowDeselect,
            isOptionDisabled,
            isSelected,
            onAdd,
            onBeforeToggle,
            onPress,
            onRemove,
            option,
            shouldToggleOnPress,
        ],
    );

    return (
        <ListItemBase
            {...(rest as ListItemProps)}
            selected={isSelected}
            disabled={isOptionDisabled}
            onPress={handlePress}
            variant={variant ?? 'menuItem'}
            accessibilityRole={accessibilityRole}
            accessibilityState={
                accessibilityState ?? { selected: isSelected, disabled: isOptionDisabled }
            }>
            {children}
        </ListItemBase>
    );
};

const ListItemSelectable = typedMemo(_ListItemSelectable);

const _ListItem = <Option extends object = DefaultListItemT>(props: ListItemProps<Option>) => {
    if (props.value !== undefined) {
        return <ListItemSelectable {...(props as ListItemProps<Option> & { value: ListItemId })} />;
    }
    return <ListItemBase {...(props as ListItemProps)} />;
};

const ListItem = typedMemo(_ListItem);

type ControlledListValue = ListItemId | ListItemId[] | null;

const emptyArr: ListItemId[] = [];

const ListProvider = typedMemo(
    <Option extends object = DefaultListItemT>({
        children,
        value: valueProp,
        defaultValue,
        onChange,
        multiple = false,
        disabled = false,
        error = false,
        allowDeselect: allowDeselectProp,
    }: ListProps<Option>) => {
        const [value, onValueChange] = useControlledValue<ControlledListValue>({
            value: valueProp,
            defaultValue: defaultValue ?? (multiple ? (emptyArr as ListItemId[]) : null),
            onChange: onChange as
                | ((value: ControlledListValue, item: Option, event?: unknown) => void)
                | undefined,
        });
        const valueRef = useLatest(value);

        const allowDeselect = allowDeselectProp !== undefined ? allowDeselectProp : multiple;
        const isSelectedId = useCallback(
            (id: ListItemId) => {
                if (multiple) {
                    const values = (value as ListItemId[] | null | undefined) ?? [];
                    return values.some(v => v === id);
                }
                return (value as ListItemId | null) === id;
            },
            [multiple, value],
        );

        const onAdd = useCallback(
            (item: Option) => {
                const id = (item as { id?: ListItemId }).id as ListItemId;
                if (multiple) {
                    const currentValue = (valueRef.current as ListItemId[]) || [];
                    if (!currentValue.find(v => v === id)) {
                        onValueChange([...currentValue, id], item);
                    }
                    return;
                }

                onValueChange(id, item);
            },
            [multiple, onValueChange, valueRef],
        );

        const onRemove = useCallback(
            (item: Option) => {
                const id = (item as { id?: ListItemId }).id as ListItemId;
                if (multiple) {
                    const currentValue = (valueRef.current as ListItemId[]) || [];
                    onValueChange(
                        currentValue.filter(v => v !== id),
                        item,
                    );
                    return;
                }

                onValueChange(null, item);
            },
            [multiple, onValueChange, valueRef],
        );

        const contextValue = {
            value,
            multiple,
            onAdd: onAdd as (item: DefaultListItemT) => void,
            onRemove: onRemove as (item: DefaultListItemT) => void,
            isSelectedId,
            disabled,
            error,
            allowDeselect,
        } as ListContextValue<DefaultListItemT>;

        return <ListContextProvider value={contextValue}>{children}</ListContextProvider>;
    },
);

const ListContent = typedMemo(
    ({ ref, children, style, ...rest }: ListContentProps & { ref?: React.ForwardedRef<any> }) => {
        return (
            <ScrollView style={style} {...rest} ref={ref}>
                {children}
            </ScrollView>
        );
    },
);

const List = Object.assign(ListProvider, {
    Content: ListContent,
    Item: ListItem,
});

export default List;

export { ListContent, ListItem, ListProvider };
