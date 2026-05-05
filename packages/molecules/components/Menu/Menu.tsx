import {
    Children,
    cloneElement,
    memo,
    type ReactElement,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { GestureResponderEvent, ViewStyle } from 'react-native';

import {
    type DefaultListItemT,
    List,
    type ListItemProps,
    type ListProps,
    type ListValue,
} from '../List';
import { Popover, type PopoverProps } from '../Popover';
import { MenuContext, MenuRootContext, menuStyles } from './utils';

type MenuBaseProps = Omit<
    PopoverProps,
    'setIsOpen' | 'onClose' | 'isOpen' | 'triggerRef' | 'children'
> & {
    style?: ViewStyle;
    closeOnSelect?: boolean;
    children: ReactElement | ReactElement[];
    backdropStyles?: ViewStyle;
    items?: DefaultListItemT[];
    disabled?: boolean;
    searchKey?: string;
    onSearchChange?: (query: string) => void;
    hideSelected?: boolean;
};

type SingleMenuProps = {
    multiple?: false | undefined;
    value?: ListValue<DefaultListItemT, false>;
    defaultValue?: ListValue<DefaultListItemT, false>;
    onChange?: (
        value: ListValue<DefaultListItemT, false>,
        item: DefaultListItemT,
        event?: GestureResponderEvent,
    ) => void;
};

type MultipleMenuProps = {
    multiple: true;
    value?: ListValue<DefaultListItemT, true>;
    defaultValue?: ListValue<DefaultListItemT, true>;
    onChange?: (
        value: ListValue<DefaultListItemT, true>,
        item: DefaultListItemT,
        event?: GestureResponderEvent,
    ) => void;
};

export type Props = MenuBaseProps & (SingleMenuProps | MultipleMenuProps);

const emptyObj = {} as ViewStyle;

const emptyArr = [] as DefaultListItemT[];

const Menu = ({
    children,
    style: styleProp,
    backdropStyles = emptyObj,
    closeOnSelect = true,
    items,
    value,
    defaultValue,
    onChange,
    multiple,
    disabled,
    searchKey,
    onSearchChange,
    hideSelected,
    ...rest
}: Props) => {
    const { isOpen, onClose, triggerRef } = useContext(MenuRootContext);

    const { backdropStyle, style } = useMemo(() => {
        return {
            backdropStyle: [menuStyles.backdrop, backdropStyles] as unknown as ViewStyle,
            style: [menuStyles.root, styleProp] as unknown as ViewStyle,
        };
    }, [backdropStyles, styleProp]);

    const contextValue = useMemo(
        () => ({
            closeOnSelect,
            onClose,
        }),
        [closeOnSelect, onClose],
    );

    const listProps = {
        items: items ?? emptyArr,
        multiple,
        value,
        defaultValue,
        onChange,
        disabled,
        searchKey,
        onSearchChange,
        hideSelected,
    } as ListProps<DefaultListItemT>;

    return (
        <Popover isOpen={isOpen} onClose={onClose} style={style} triggerRef={triggerRef} {...rest}>
            <Popover.Overlay style={backdropStyle} />
            <List {...listProps}>
                <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
            </List>
        </Popover>
    );
};

export type MenuRootProps = {
    children: ReactNode;
};

export const MenuRoot = memo(({ children }: MenuRootProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);

    const onOpen = useCallback(() => setIsOpen(true), []);
    const onClose = useCallback(() => setIsOpen(false), []);

    const contextValue = useMemo(
        () => ({ isOpen, onOpen, onClose, triggerRef }),
        [isOpen, onOpen, onClose],
    );

    return <MenuRootContext.Provider value={contextValue}>{children}</MenuRootContext.Provider>;
});

MenuRoot.displayName = 'Menu_Root';

export type MenuTriggerProps = {
    children: ReactElement;
};

export const MenuTrigger = memo(({ children }: MenuTriggerProps) => {
    const { onOpen, triggerRef } = useContext(MenuRootContext);

    const onPress = useCallback(
        (e: unknown) => {
            // @ts-ignore
            children?.props?.onPress?.(e);
            onOpen();
        },
        [children?.props, onOpen],
    );

    return useMemo(
        () =>
            cloneElement(Children.only(children), {
                // @ts-ignore
                ref: triggerRef,
                onPress,
            }),
        [children, triggerRef, onPress],
    );
});

MenuTrigger.displayName = 'Menu_Trigger';

export type MenuItemProps = Omit<ListItemProps, 'children' | 'onPress'> & {
    children: ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
};

export const MenuItem = memo(({ onPress, children, ...rest }: MenuItemProps) => {
    const { closeOnSelect, onClose } = useContext(MenuContext);

    const handlePress = useCallback(
        (event: GestureResponderEvent) => {
            onPress?.(event);
            if (closeOnSelect) onClose();
        },
        [closeOnSelect, onClose, onPress],
    );

    return (
        <List.Row {...rest} variant="menuItem" onPress={handlePress}>
            {children}
        </List.Row>
    );
});

MenuItem.displayName = 'Menu_Item';

export default memo(Menu);
