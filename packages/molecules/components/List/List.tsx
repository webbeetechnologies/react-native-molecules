import {
    type ComponentType,
    memo,
    type RefObject,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { ScrollView, type StyleProp, View, type ViewStyle } from 'react-native';

import { typedMemo } from '../../hocs';
import { useActionState, useControlledValue, useLatest } from '../../hooks';
import type { WithElements } from '../../types';
import { resolveStateVariant } from '../../utils';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { StateLayer } from '../StateLayer';
import { Text } from '../Text';
import { TextInput, type TextInputHandles, type TextInputProps } from '../TextInput';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { ListContextProvider, useListContextValue } from './context';
import type {
    DefaultListItemT,
    ListContentProps,
    ListContextValue,
    ListGroupProps,
    ListItemOptionProps,
    ListProps,
    ListSearchInputProps,
} from './types';
import { listItemStyles, listStyles } from './utils';

const emptyArr: unknown[] = [];

type InternalListItemProps = Omit<TouchableRippleProps, 'children'> &
    WithElements<React.ReactNode | ((renderArgs: { hovered: boolean }) => React.ReactNode)> & {
        ref?: RefObject<any>;
        hovered?: boolean;
        children: React.ReactNode;
        style?: StyleProp<ViewStyle>;
        divider?: boolean;
        variant?: 'default' | 'menuItem';
        selected?: boolean;
        hoverable?: boolean;
        contentStyle?: StyleProp<ViewStyle>;
    };

const _InternalListItem = ({
    ref,
    left,
    right,
    children,
    style: styleProp,
    disabled = false,
    divider = false,
    variant = 'default',
    selected = false,
    onPress,
    hoverable: hoverableProp = false,
    hovered: hoveredProp = false,
    contentStyle: contentStyleProp,
    ...props
}: InternalListItemProps) => {
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
    }) as any;

    listItemStyles.useVariants({
        state,
        variant: variant as any,
    });

    const {
        containerStyles,
        innerContainerStyle,
        contentStyle,
        leftElementStyle,
        rightElementStyle,
    } = useMemo(() => {
        const { innerContainer, content, leftElement, rightElement } = listItemStyles;
        return {
            containerStyles: [listItemStyles.root, styleProp],
            innerContainerStyle: innerContainer,
            contentStyle: content,
            leftElementStyle: leftElement,
            rightElementStyle: rightElement,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [styleProp, state, variant]);

    return (
        <TouchableRipple
            {...props}
            style={containerStyles}
            disabled={disabled}
            onPress={onPress}
            ref={actionsRef}>
            <>
                <View style={innerContainerStyle}>
                    {left ? (
                        <View style={leftElementStyle}>
                            {typeof left === 'function' ? left({ hovered }) : left}
                        </View>
                    ) : null}
                    <View style={[contentStyle, contentStyleProp]}>{children}</View>
                    {right ? (
                        <View style={rightElementStyle}>
                            {typeof right === 'function' ? right({ hovered }) : right}
                        </View>
                    ) : null}
                </View>
                {divider ? <Divider /> : null}
                <StateLayer style={listItemStyles.stateLayer} />
            </>
        </TouchableRipple>
    );
};

const ListItem = memo(_InternalListItem);

const ListProvider = typedMemo(
    <Option extends DefaultListItemT = DefaultListItemT>({
        children,
        value: valueProp,
        defaultValue,
        onChange,
        multiple = false,
        disabled = false,
        error = false,
        items = emptyArr as Option[],
        searchKey,
        onSearchChange,
        hideSelected: hideSelectedProp,
    }: ListProps<Option>) => {
        type ControlledListValue = Option['id'] | Option['id'][] | null;
        const [value, onValueChange] = useControlledValue<Option['id'] | Option['id'][] | null>({
            value: valueProp,
            defaultValue: defaultValue ?? (multiple ? (emptyArr as Option['id'][]) : null),
            onChange: onChange as
                | ((value: ControlledListValue, item: Option, event?: any) => void)
                | undefined,
        });
        const valueRef = useLatest(value);
        const [searchQuery, setSearchQuery] = useState('');

        const handleSearchQueryChange = useCallback(
            (query: string) => {
                setSearchQuery(query);
                onSearchChange?.(query);
            },
            [onSearchChange],
        );

        const hideSelected = hideSelectedProp !== undefined ? hideSelectedProp : multiple;

        const filteredItems = useMemo(() => {
            let result = items;

            if (hideSelected) {
                result = result.filter(item => {
                    if (multiple) {
                        const values = (value as Option['id'][]) || [];
                        return !values.some(v => v === item.id);
                    }

                    const singleValue = value as Option['id'] | null;
                    return singleValue !== item.id;
                });
            }

            if (searchQuery) {
                const key = searchKey || 'label';
                const lowerQuery = searchQuery.toLowerCase();
                result = result.filter(item => {
                    const itemValue = item[key];
                    return String(itemValue || '')
                        .toLowerCase()
                        .includes(lowerQuery);
                });
            }

            return result;
        }, [hideSelected, items, multiple, searchKey, searchQuery, value]);

        const onAdd = useCallback(
            (item: Option) => {
                if (multiple) {
                    const currentValue = (valueRef.current as Option['id'][]) || [];
                    if (!currentValue.find(v => v === item.id)) {
                        onValueChange([...currentValue, item.id] as Option['id'][], item);
                    }
                    return;
                }

                onValueChange(item.id, item);
            },
            [multiple, onValueChange, valueRef],
        );

        const onRemove = useCallback(
            (item: Option) => {
                if (multiple) {
                    const currentValue = (valueRef.current as Option['id'][]) || [];
                    onValueChange(currentValue.filter(v => v !== item.id) as Option['id'][], item);
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
            disabled,
            error,
            items,
            searchQuery,
            setSearchQuery: handleSearchQueryChange,
            filteredItems,
        } as ListContextValue<DefaultListItemT>;

        return <ListContextProvider value={contextValue}>{children}</ListContextProvider>;
    },
);

const ListContent = typedMemo(
    <
        Option extends DefaultListItemT = DefaultListItemT,
        C extends ComponentType<any> = typeof ScrollView,
    >({
        ref,
        children,
        ContainerComponent,
        style,
        emptyState,
        processProps,
        ...rest
    }: ListContentProps<Option, C> & { ref?: React.ForwardedRef<any> }) => {
        const { filteredItems, value, multiple, searchQuery, items } = useListContextValue(
            state => ({
                filteredItems: state.filteredItems,
                value: state.value,
                multiple: state.multiple,
                searchQuery: state.searchQuery,
                items: state.items,
            }),
        );

        const selectedIds = useMemo(() => {
            const map: Record<string, true> = {};
            const values = multiple ? (value as any[]) ?? [] : value == null ? [] : [value];
            for (const v of values) {
                const id = v?.id ?? v;
                if (id != null) map[id] = true;
            }
            return map;
        }, [multiple, value]);

        const isSelected = useCallback(
            (item: DefaultListItemT) => selectedIds[item.id as any] === true,
            [selectedIds],
        );

        const content = useMemo(() => {
            if (children === undefined) {
                return null;
            }
            return filteredItems.map(item =>
                children(item as Option, isSelected(item as DefaultListItemT)),
            );
        }, [children, filteredItems, isSelected]);

        const defaultEmptyState = useMemo(() => {
            const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
            const hasNoItems = items.length === 0;

            if (hasNoItems) {
                return (
                    <View style={listStyles.emptyState}>
                        <Text style={listStyles.emptyStateText}>No items available</Text>
                    </View>
                );
            }

            if (hasSearchQuery) {
                return (
                    <View style={listStyles.emptyState}>
                        <Text style={listStyles.emptyStateText}>No results found</Text>
                    </View>
                );
            }

            return (
                <View style={listStyles.emptyState}>
                    <Text style={listStyles.emptyStateText}>No items</Text>
                </View>
            );
        }, [items.length, searchQuery]);

        const resolvedEmptyState = emptyState ?? defaultEmptyState;
        const isEmpty = filteredItems.length === 0;

        const Container = (ContainerComponent ?? ScrollView) as ComponentType<any>;

        if (processProps) {
            const baseProps = { style, ...rest, accessibilityRole: 'listbox' } as Record<
                string,
                any
            >;
            const processedProps = processProps({
                props: baseProps as any,
                items: filteredItems as Option[],
                isEmpty,
                emptyState: resolvedEmptyState,
                isSelected,
            });

            return <Container {...(processedProps as any)} ref={ref} />;
        }

        return (
            <Container style={style} {...rest} ref={ref} accessibilityRole="listbox">
                {isEmpty ? resolvedEmptyState : content}
            </Container>
        );
    },
);

const ListGroup = memo(({ children, label, style, ...rest }: ListGroupProps) => {
    return (
        <View style={style} {...rest}>
            {label ? <Text style={listStyles.groupLabel}>{label}</Text> : null}
            {children}
        </View>
    );
});

const ListOption = memo(
    <Option extends DefaultListItemT = DefaultListItemT>({
        value,
        children,
        onPress,
        disabled: itemDisabledProp = false,
        shouldToggleOnPress = true,
        accessibilityRole,
        accessibilityState,
        ...rest
    }: ListItemOptionProps<Option>) => {
        const {
            multiple,
            onAdd,
            onRemove,
            disabled: listDisabled,
            items,
        } = useListContextValue(state => ({
            multiple: state.multiple,
            onAdd: state.onAdd,
            onRemove: state.onRemove,
            disabled: state.disabled,
            items: state.items,
        }));

        const option = useMemo(() => {
            const foundItem = items.find(i => i.id === value);
            if (foundItem) return foundItem as Option;

            return {
                id: value,
                ...(itemDisabledProp ? { selectable: false } : {}),
            } as Option;
        }, [itemDisabledProp, items, value]);

        const isSelected = useListContextValue(state => {
            if (multiple) {
                const values = state.value as any[];
                return values?.some(v => (v?.id ?? v) === option.id) || false;
            }

            const singleValue = state.value as any;
            return (singleValue?.id ?? singleValue) === option.id || false;
        });

        const isOptionDisabled = Boolean(
            listDisabled || itemDisabledProp || option.selectable === false,
        );

        const handlePress = useCallback(
            (event: any) => {
                if (isOptionDisabled) return;
                onPress?.(option, event);

                if (shouldToggleOnPress) {
                    if (isSelected) {
                        onRemove(option);
                    } else {
                        onAdd(option);
                    }
                }
            },
            [isOptionDisabled, isSelected, onAdd, onPress, onRemove, option, shouldToggleOnPress],
        );

        return (
            <ListItem
                {...rest}
                selected={isSelected}
                disabled={isOptionDisabled}
                onPress={handlePress}
                variant={rest.variant || 'menuItem'}
                accessibilityRole={accessibilityRole}
                accessibilityState={
                    accessibilityState ?? { selected: isSelected, disabled: isOptionDisabled }
                }>
                {children}
            </ListItem>
        );
    },
);

const ListSearchInput = memo(({ children, ...textInputProps }: ListSearchInputProps) => {
    const { searchQuery, setSearchQuery } = useListContextValue(state => ({
        searchQuery: state.searchQuery,
        setSearchQuery: state.setSearchQuery,
    }));

    const textInputRef = useRef<TextInputHandles>(null);

    const handleChangeText = useCallback(
        (text: string) => {
            setSearchQuery(text);
        },
        [setSearchQuery],
    );

    const inputProps = {
        ...textInputProps,
        value: searchQuery,
        onChangeText: handleChangeText,
        placeholder: textInputProps.placeholder || 'Search...',
        inputStyle: listStyles.searchInputInput,
    } as TextInputProps;

    const onPressLeftIcon = useCallback(() => {
        textInputRef.current?.focus();
    }, []);

    const onClearSearchQuery = useCallback(() => {
        handleChangeText('');
    }, [handleChangeText]);

    return (
        <TextInput
            ref={textInputRef}
            style={listStyles.searchInput}
            size="sm"
            variant="outlined"
            {...inputProps}>
            <TextInput.Left>
                <Icon onPress={onPressLeftIcon} name="magnify" size={20} />
            </TextInput.Left>
            {searchQuery ? (
                <TextInput.Right>
                    <IconButton name="close" size={20} onPress={onClearSearchQuery} />
                </TextInput.Right>
            ) : null}
            {children}
        </TextInput>
    );
});

const List = Object.assign(ListProvider, {
    Content: ListContent,
    Item: ListOption,
    SearchInput: ListSearchInput,
    Group: ListGroup,
    Row: ListItem,
});

export default List;

export {
    type InternalListItemProps,
    ListContent,
    ListGroup,
    ListItem,
    ListOption,
    ListProvider,
    ListSearchInput,
};
