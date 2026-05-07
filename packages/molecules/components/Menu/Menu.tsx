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
    disabled?: boolean;
    allowDeselect?: boolean;
};

type SingleMenuProps = {
    multiple?: false | undefined;
    value?: ListValue<false>;
    defaultValue?: ListValue<false>;
    onChange?: (
        value: ListValue<false>,
        item: DefaultListItemT,
        event?: GestureResponderEvent,
    ) => void;
};

type MultipleMenuProps = {
    multiple: true;
    value?: ListValue<true>;
    defaultValue?: ListValue<true>;
    onChange?: (
        value: ListValue<true>,
        item: DefaultListItemT,
        event?: GestureResponderEvent,
    ) => void;
};

export type Props = MenuBaseProps & (SingleMenuProps | MultipleMenuProps);

const Menu = ({
    children,
    style: styleProp,
    closeOnSelect = true,
    value,
    defaultValue,
    onChange,
    multiple,
    disabled,
    allowDeselect,
    ...rest
}: Props) => {
    const { isOpen, onClose, triggerRef } = useContext(MenuRootContext);

    const { style } = useMemo(() => {
        return {
            style: [menuStyles.root, styleProp] as unknown as ViewStyle,
        };
    }, [styleProp]);

    const contextValue = useMemo(
        () => ({
            closeOnSelect,
            onClose,
        }),
        [closeOnSelect, onClose],
    );

    const listProps = {
        multiple,
        value,
        defaultValue,
        onChange,
        disabled,
        allowDeselect,
    } as ListProps<DefaultListItemT>;

    return (
        <Popover isOpen={isOpen} onClose={onClose} style={style} triggerRef={triggerRef} {...rest}>
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
        <List.Item variant="menuItem" {...rest} onPress={handlePress}>
            {children}
        </List.Item>
    );
});

MenuItem.displayName = 'Menu_Item';

export default memo(Menu);
