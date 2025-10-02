import {
    ComponentProps,
    ComponentType,
    memo,
    PropsWithoutRef,
    ReactElement,
    ReactNode,
    RefAttributes,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { GestureResponderEvent, Platform, SectionList, useWindowDimensions } from 'react-native';

import { useControlledValue } from '../../hooks';
import type { PopoverProps } from '../Popover';
import { OptionList, type OptionListProps } from '../OptionList';
import { ActionSheet, type ActionSheetProps } from '../ActionSheet';
import { Dialog, type DialogProps } from '../Dialog';
import { DropdownListPopover } from '../DropdownListPopover';
import { dropdownListStyles } from './utils';

enum DropdownListMode {
    Auto = 'auto',
    Popover = 'popover', // mobile only
    Fullscreen = 'fullscreen', // mobile only
    ActionSheet = 'actionsheet', // mobile only
    Dialog = 'dialog', // large screen only
}

type DefaultItemT = {
    id: string | number;
    [key: string]: any;
};

type DefaultSectionT<TItem> = {
    data: TItem[];
    [key: string]: any;
};

export type IDropdownList = <
    ItemType extends DefaultItemT = DefaultItemT,
    TSectionType extends DefaultSectionT<ItemType> = DefaultSectionT<ItemType>,
>(
    props: PropsWithoutRef<Props<ItemType, TSectionType>> & RefAttributes<SectionList<ItemType>>,
) => ReactElement;

export type Props<
    TItem extends DefaultItemT = DefaultItemT,
    TSectionType extends DefaultSectionT<TItem> = DefaultSectionT<TItem>,
> = OptionListProps<TItem, TSectionType> & {
    mode?: `${DropdownListMode}`;
    // optionsThreshhold: configuration to show maximum number of options in popover/actionsheet when mode == DropdownListMode.auto (default: 5).
    // on reaching threshold, switches to a full screen view in smaller devices.
    optionsThreshold?: number;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    hideOnSelect?: boolean;

    popoverProps?: Omit<PopoverProps, 'triggerRef' | 'onOpen' | 'onClose' | 'isOpen' | 'children'>;
    actionSheetProps?: Omit<ActionSheetProps, 'children' | 'isOpen' | 'onClose' | 'onOpen'>;
    dialogProps?: Omit<DialogProps, 'isOpen' | 'children'>;
    triggerRef: any;

    maxHeight?: number;
    WrapperComponent?: ComponentType<{
        isOpen: boolean;
        onClose: () => void;
        onOpen: () => void;
        children: ReactNode;
        [key: string]: any;
    }>;
    wrapperComponentProps?: ComponentProps<any>;
};

const DropdownList = <TItem extends DefaultItemT = DefaultItemT>({
    mode = 'auto',
    popoverProps,
    actionSheetProps,
    dialogProps = {},
    isOpen: isOpenProp,
    setIsOpen: setIsOpenProp,
    onSelectionChange: onSelectionChangeProp,
    records,
    optionsThreshold,
    containerStyle,
    triggerRef,
    hideOnSelect = true,
    maxHeight,
    style,
    onQueryChange,
    onCancel,
    WrapperComponent: Wrapper,
    wrapperComponentProps,
    ...optionListProps
}: Props<TItem>) => {
    const scrollRef = useRef(null);

    const resolvedMode = useResolvedMode(mode, records, optionsThreshold);

    const listStyles = useMemo(() => {
        return [
            resolvedMode === DropdownListMode.Popover ? dropdownListStyles.popoverContainer : {},
            style,
            containerStyle,
            maxHeight ? { maxHeight } : {},
        ];
    }, [resolvedMode, style, containerStyle, maxHeight]);

    const [isOpen, setIsOpen] = useControlledValue({
        value: isOpenProp,
        onChange: setIsOpenProp,
    });

    const onClose = useCallback(() => {
        if (isOpen) {
            onCancel?.();
            setIsOpen(false);
            onQueryChange?.('');
        }
    }, [isOpen, onQueryChange, setIsOpen, onCancel]);

    const onOpen = useCallback(() => {
        if (!isOpen) setIsOpen(true);
    }, [isOpen, setIsOpen]);

    const onSelectionChange = useCallback(
        (selection: TItem | TItem[] | null, item: TItem, event?: GestureResponderEvent) => {
            onSelectionChangeProp?.(selection, item, event);

            if (hideOnSelect) {
                setIsOpen(false);
                onQueryChange?.('');
            }
        },
        [onSelectionChangeProp, hideOnSelect, setIsOpen, onQueryChange],
    );

    const [WrapperComponent, props] = useMemo(() => {
        if (Wrapper)
            return [Wrapper, { ...wrapperComponentProps, isOpen, onClose, onOpen, scrollRef }];
        switch (resolvedMode) {
            case DropdownListMode.ActionSheet:
                return [ActionSheet, { ...actionSheetProps, isOpen, onClose, onOpen }];
            case DropdownListMode.Dialog:
                return [Dialog, { ...dialogProps, isOpen, onClose }];
            default:
                return [
                    DropdownListPopover,
                    { offset: 4, ...popoverProps, triggerRef, isOpen, onClose },
                ];
        }
    }, [
        Wrapper,
        isOpen,
        onClose,
        onOpen,
        resolvedMode,
        actionSheetProps,
        dialogProps,
        popoverProps,
        triggerRef,
        wrapperComponentProps,
    ]);

    return (
        <WrapperComponent {...(props as any)}>
            <OptionList
                ref={scrollRef}
                enableKeyboardNavigation
                onCancel={onClose}
                {...optionListProps}
                style={listStyles}
                records={records}
                onSelectionChange={onSelectionChange}
                onQueryChange={onQueryChange}
            />
        </WrapperComponent>
    );
};

const useResolvedMode = (
    mode: `${DropdownListMode}`,
    options: { data: any[] }[],
    optionsThreshold: number | undefined,
) => {
    const { width } = useWindowDimensions();

    if (mode !== DropdownListMode.Auto) return mode;

    if (width > 920 || optionsThreshold === undefined) {
        return DropdownListMode.Popover;
    }

    // to avoid looping over all the items, we check if the length of the sections is greater than threshold
    if (options.length > optionsThreshold) return DropdownListMode.Dialog;

    let itemsLength = 0;

    for (const t of options) {
        // we want to stop the loop if the length is already greater than threshold
        if (itemsLength > optionsThreshold) return;

        itemsLength += t?.data.length;
    }

    if (itemsLength > optionsThreshold) return DropdownListMode.Dialog;

    // if less than threshold
    if (Platform.OS === 'ios') return DropdownListMode.ActionSheet;

    return DropdownListMode.Popover;
};

export default memo(DropdownList);
