import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    type AccessibilityRole,
    type GestureResponderEvent,
    type LayoutChangeEvent,
    Platform,
    Pressable,
    View,
} from 'react-native';

import { typedMemo } from '../../hocs';
import { useActionState } from '../../hooks';
import { useToggle } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import { List } from '../List';
import { Popover } from '../Popover';
import { Text } from '../Text';
import {
    SelectDropdownContextProvider,
    useSelectContextValue,
    useSelectDropdownContextValue,
} from './context';
import type {
    DefaultItemT,
    SelectDropdownProps,
    SelectOptionProps,
    SelectProps,
    SelectTriggerProps,
    SelectValueProps,
} from './types';
import { collectWebSelectKeyboardOptionElements, styles, triggerStyles } from './utils';

const emptyArr: unknown[] = [];

const SelectDropdownProvider = memo(
    ({
        children,
        isOpen: isOpenProp,
        onClose: onCloseProp,
    }: {
        children: React.ReactNode;
        isOpen?: boolean;
        onClose?: () => void;
    }) => {
        const { state: isOpen, handleOpen, handleClose } = useToggle(false);
        const triggerRef = useRef<View>(null);
        const [triggerLayout, setTriggerLayout] = useState<{
            width: number;
            height: number;
        } | null>(null);
        const isControlled = isOpenProp !== undefined;

        const onClose = useCallback(() => {
            if (isControlled) {
                onCloseProp?.();
            } else {
                handleClose();
            }
        }, [isControlled, onCloseProp, handleClose]);

        const onOpen = useCallback(() => {
            if (!isControlled) {
                handleOpen();
            }
        }, [handleOpen, isControlled]);

        const contextValue = useMemo(
            () => ({
                isOpen: isControlled ? isOpenProp! : isOpen,
                onClose,
                onOpen,
                triggerRef: triggerRef as React.RefObject<View>,
                triggerLayout,
                setTriggerLayout,
            }),
            [isControlled, isOpenProp, isOpen, onClose, onOpen, triggerLayout],
        );

        return (
            <SelectDropdownContextProvider value={contextValue}>
                {children}
            </SelectDropdownContextProvider>
        );
    },
);

const Select = typedMemo(
    <Option extends DefaultItemT = DefaultItemT>({
        children,
        options = emptyArr as Option[],
        ...listProps
    }: SelectProps<Option>) => {
        return (
            <List {...listProps} items={options}>
                <SelectDropdownProvider>{children}</SelectDropdownProvider>
            </List>
        );
    },
);

const SelectTrigger = ({ children, style, ...rest }: SelectTriggerProps) => {
    const { onOpen, isOpen, triggerRef, setTriggerLayout } = useSelectDropdownContextValue(
        state => ({
            onOpen: state.onOpen,
            isOpen: state.isOpen,
            triggerRef: state.triggerRef,
            setTriggerLayout: state.setTriggerLayout,
        }),
    );

    const { disabled, error } = useSelectContextValue(state => ({
        disabled: state.disabled,
        error: state.error,
    }));

    const { hovered } = useActionState({ ref: triggerRef, actionsToListen: ['hover'] });

    triggerStyles.useVariants({
        state: resolveStateVariant({
            focused: isOpen,
            hovered,
            disabled: !!disabled,
            error: !!error,
            hoveredAndFocused: hovered && isOpen,
            errorFocused: !!error && isOpen,
            errorHovered: !!error && hovered,
            errorFocusedAndHovered: !!error && isOpen && hovered,
            errorDisabled: !!error && !!disabled,
        }) as any,
    });

    const handleLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const { width, height } = event.nativeEvent.layout;
            setTriggerLayout({ width, height });
        },
        [setTriggerLayout],
    );

    const handlePress = useCallback(() => {
        if (!isOpen && !disabled) {
            onOpen();
        }
    }, [isOpen, onOpen, disabled]);

    return (
        <Pressable
            ref={triggerRef}
            onPress={handlePress}
            onLayout={handleLayout}
            style={[triggerStyles.trigger, style]}
            accessibilityRole="combobox"
            accessibilityState={{ expanded: isOpen, disabled: !!disabled }}
            disabled={disabled}
            {...rest}>
            {children}
            <Icon
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                style={triggerStyles.triggerIcon}
            />
            <View style={triggerStyles.outline} />
        </Pressable>
    );
};

SelectTrigger.displayName = 'Select_Trigger';

const SelectValue = memo(
    ({ placeholder, labelKey, renderValue, style, ...rest }: SelectValueProps) => {
        const { value, multiple, onRemove, options } = useSelectContextValue(state => ({
            value: state.value,
            multiple: state.multiple,
            onRemove: state.onRemove,
            options: state.items,
        }));

        const resolvedValue = useMemo(() => {
            const resolve = (item: any) => {
                if (item === null || item === undefined) return null;
                const id = typeof item === 'object' ? item.id : item;
                const found = options.find(o => o.id === id);
                return found || item;
            };

            if (multiple) {
                return (Array.isArray(value) ? value : []).map(resolve).filter(Boolean);
            }
            return resolve(value);
        }, [value, multiple, options]);

        const displayValue = useMemo(() => {
            if (!resolvedValue) return placeholder || '';
            if (multiple && (resolvedValue as any[]).length === 0) return placeholder || '';

            if (renderValue) {
                return renderValue(resolvedValue as any);
            }

            if (multiple) {
                const values = resolvedValue as DefaultItemT[];
                // For multi-select, show chips
                return values.map(item => item[labelKey || 'label'] || String(item.id)).join(', ');
            } else {
                const singleValue = resolvedValue as DefaultItemT;
                return singleValue[labelKey || 'label'] || String(singleValue.id || singleValue);
            }
        }, [resolvedValue, multiple, labelKey, placeholder, renderValue]);

        if (multiple && Array.isArray(resolvedValue) && resolvedValue.length > 0) {
            // Render chips for multi-select
            return (
                <View style={[styles.chipContainer, style]} {...rest}>
                    {(resolvedValue as DefaultItemT[]).map(item => (
                        <SelectValueItem
                            key={item.id || String(item)}
                            item={item}
                            onRemoveItem={onRemove}
                        />
                    ))}
                </View>
            );
        }

        return (
            <Text style={style} {...rest}>
                {displayValue}
            </Text>
        );
    },
);

const SelectValueItem = typedMemo(
    ({
        item,
        onRemoveItem,
    }: {
        item: DefaultItemT;
        onRemoveItem: (item: DefaultItemT) => void;
    }) => {
        const onRemove = useCallback(() => {
            onRemoveItem(item);
        }, [item, onRemoveItem]);

        return (
            <Chip.Input
                label={item[item.labelKey || 'label'] || String(item.id || item)}
                size="sm"
                selected
                left={<></>}
                onClose={onRemove}
            />
        );
    },
);

SelectValue.displayName = 'Select_Value';

// Select.Dropdown - popover with keyboard navigation
const SelectDropdown = memo(
    ({
        children,
        WrapperComponent,
        wrapperComponentProps,
        enableKeyboardNavigation = true,
        style: popoverStyleProp,
        ...popoverProps
    }: SelectDropdownProps & { enableKeyboardNavigation?: boolean }) => {
        const { isOpen, onClose, triggerRef, triggerLayout } = useSelectDropdownContextValue(
            state => ({
                isOpen: state.isOpen,
                onClose: state.onClose,
                triggerRef: state.triggerRef,
                triggerLayout: state.triggerLayout,
            }),
        );

        const popoverStyle = useMemo(() => {
            const baseStyle = popoverStyleProp ? [popoverStyleProp] : [];
            if (triggerLayout) {
                return [{ width: triggerLayout.width }, ...baseStyle];
            }
            return baseStyle;
        }, [triggerLayout, popoverStyleProp]);

        if (!triggerLayout) return null;

        if (WrapperComponent) {
            return (
                <WrapperComponent isOpen={isOpen} onClose={onClose} {...wrapperComponentProps}>
                    {enableKeyboardNavigation && Platform.OS === 'web' ? (
                        <KeyboardNavigationWrapper>{children}</KeyboardNavigationWrapper>
                    ) : (
                        children
                    )}
                </WrapperComponent>
            );
        }

        return (
            <Popover
                triggerRef={triggerRef as React.RefObject<View>}
                isOpen={isOpen}
                onClose={onClose}
                style={popoverStyle}
                triggerDimensions={triggerLayout}
                {...popoverProps}>
                {enableKeyboardNavigation && Platform.OS === 'web' ? (
                    <KeyboardNavigationWrapper>{children}</KeyboardNavigationWrapper>
                ) : (
                    children
                )}
            </Popover>
        );
    },
);

// Keyboard navigation wrapper for web. Captures its own DOM ref via a `display: contents`
// wrapper so the keyboard navigator can query options without needing the dropdown content
// itself to plumb a contentRef.
const KeyboardNavigationWrapper = memo(({ children }: { children: React.ReactNode }) => {
    const { onClose, isOpen } = useSelectDropdownContextValue(state => ({
        onClose: state.onClose,
        isOpen: state.isOpen,
    }));
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (e: globalThis.KeyboardEvent) => {
            if (!containerRef.current) return;

            const options = collectWebSelectKeyboardOptionElements(containerRef.current);
            if (options.length === 0) return;

            const currentIndex = options.findIndex(el => el === document.activeElement);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex === -1) {
                        options[0]?.focus();
                    } else {
                        const nextIndex = (currentIndex + 1) % options.length;
                        options[nextIndex]?.focus();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex === -1) {
                        options[options.length - 1]?.focus();
                    } else {
                        const prevIndex = (currentIndex - 1 + options.length) % options.length;
                        options[prevIndex]?.focus();
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (currentIndex !== -1) {
                        // Store reference to the focused element before triggering click
                        // to prevent issues with DOM updates during the click handler
                        const focusedOption = options[currentIndex];
                        if (focusedOption) {
                            focusedOption.click();
                        }
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        },
        [onClose],
    );

    useEffect(() => {
        if (Platform.OS !== 'web') return undefined;

        const controller = new AbortController();
        const listener = (e: KeyboardEvent) => {
            if (!isOpen) return;

            // Navigation keys are handled regardless of focus location so keyboard nav works
            // even while focus is still on the trigger.
            const isNavigationKey = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key);
            if (isNavigationKey) {
                handleKeyDown(e);
                return;
            }

            // Other keys: only handle if focus is inside the dropdown.
            const container = containerRef.current;
            const targetNode = e.target as Node;
            const isWithinDropdown =
                !!container && (container === targetNode || container.contains(targetNode));
            if (isWithinDropdown || e.target === document.body) {
                handleKeyDown(e);
            }
        };

        window.addEventListener('keydown', listener, {
            capture: true,
            signal: controller.signal,
        });
        return () => controller.abort();
    }, [handleKeyDown, isOpen]);

    return (
        <div ref={containerRef} style={{ display: 'contents' }}>
            {children}
        </div>
    );
});

SelectDropdown.displayName = 'Select_Dropdown';

const SelectGroup = List.Group;

// Select.Item - select item that uses context
const SelectOption = memo(
    <Option extends DefaultItemT = DefaultItemT>({
        value,
        children,
        onPress,
        style,
        disabled: optionDisabledProp = false,
        ...rest
    }: SelectOptionProps<Option>) => {
        const {
            multiple,
            onAdd,
            onRemove,
            disabled: selectDisabled,
            items,
        } = useSelectContextValue(state => ({
            multiple: state.multiple,
            onAdd: state.onAdd,
            onRemove: state.onRemove,
            disabled: state.disabled,
            items: state.items,
        }));

        const option = useMemo(() => {
            const found = items.find(i => i.id === value);
            if (found) return found as Option;
            return {
                id: value,
                ...(optionDisabledProp ? { selectable: false } : {}),
            } as Option;
        }, [items, optionDisabledProp, value]);

        const isSelected = useSelectContextValue(state => {
            if (multiple) {
                const values = state.value as any[];
                return values?.some(v => (v?.id ?? v) === option.id) || false;
            }

            const singleValue = state.value as any;
            return (singleValue?.id ?? singleValue) === option.id || false;
        });

        const { onClose } = useSelectDropdownContextValue(state => ({
            onClose: state.onClose,
        }));

        const isOptionDisabled = Boolean(
            selectDisabled || optionDisabledProp || option.selectable === false,
        );

        const handlePress = useCallback(
            (event: GestureResponderEvent) => {
                if (isOptionDisabled) return;
                onPress?.(option, event);

                if (isSelected) {
                    onRemove(option);
                } else {
                    onAdd(option);
                }

                // Close dropdown for single select
                if (!multiple) {
                    onClose();
                }
            },
            [isOptionDisabled, option, isSelected, onPress, onAdd, onRemove, multiple, onClose],
        );

        return (
            <List.Item
                {...rest}
                style={style}
                value={value}
                shouldToggleOnPress={false}
                onPress={(_, event) => handlePress(event)}
                disabled={isOptionDisabled}
                accessibilityState={{ selected: isSelected, disabled: isOptionDisabled }}
                {...(Platform.OS === 'web'
                    ? {
                          // Force role="option" on web — the keyboard navigator finds rows by
                          // [role="option"], so callers must not override these.
                          accessibilityRole: 'option' as AccessibilityRole,
                          role: 'option',
                          tabIndex: -1 as 0 | -1 | undefined,
                          'data-molecules-select-option': '',
                          'data-option-id': String(option.id),
                          onKeyDown: (e: React.KeyboardEvent) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  e.stopPropagation();
                              }
                          },
                      }
                    : { accessibilityRole: 'button' as AccessibilityRole })}>
                {children}
            </List.Item>
        );
    },
);

SelectOption.displayName = 'Select_Option';

const SelectSearchInput = List.SearchInput;

SelectSearchInput.displayName = 'Select_SearchInput';

const SelectWithSubcomponents = Object.assign(Select, {
    Trigger: SelectTrigger,
    Value: SelectValue,
    Dropdown: SelectDropdown,
    Content: List.Content,
    Group: SelectGroup,
    Option: SelectOption,
    SearchInput: SelectSearchInput,
});

export default SelectWithSubcomponents;
export { SelectDropdownProvider };
