import {
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    type AccessibilityRole,
    type GestureResponderEvent,
    type LayoutChangeEvent,
    Platform,
    Pressable,
    ScrollView,
    View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useActionState, useControlledValue } from '../../hooks';
import { useToggle } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Popover } from '../Popover';
import { registerPortalContext } from '../Portal';
import { Text } from '../Text';
import { TextInput, type TextInputHandles, type TextInputProps } from '../TextInput';
import type {
    DefaultItemT,
    SelectContentProps,
    SelectContextValue,
    SelectDropdownContextValue,
    SelectDropdownProps,
    SelectGroupProps,
    SelectOptionProps,
    SelectProviderProps,
    SelectSearchInputProps,
    SelectTriggerProps,
    SelectValueProps,
} from './types';

// SelectContext - holds value, onAdd, onRemove
export const SelectContext = createContext<SelectContextValue<DefaultItemT>>({
    value: null,
    multiple: false,
    onAdd: () => {},
    onRemove: () => {},
    disabled: false,
    error: false,
    labelKey: 'label',
    options: [],
    searchQuery: '',
    setSearchQuery: () => {},
    filteredOptions: [],
});

export const useSelectContext = <Option extends DefaultItemT = DefaultItemT>() => {
    return useContext(SelectContext) as unknown as SelectContextValue<Option>;
};

export const useSelectContextValue = <Option extends DefaultItemT = DefaultItemT, T = any>(
    selector: (state: SelectContextValue<Option>) => T,
): T => {
    const context = useContext(SelectContext) as unknown as SelectContextValue<Option>;
    return selector(context);
};

// SelectDropdownContext - holds isOpen, onClose, triggerRef
export type SelectDropdownContextType = SelectDropdownContextValue & {
    triggerRef: React.RefObject<View> | null;
    contentRef: React.RefObject<any> | null;
    triggerLayout: { width: number; height: number } | null;
    setTriggerLayout: (layout: { width: number; height: number }) => void;
};

export const SelectDropdownContext = createContext<SelectDropdownContextType>({
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    triggerRef: null,
    contentRef: null,
    triggerLayout: null,
    setTriggerLayout: () => {},
});

registerPortalContext([SelectContext, SelectDropdownContext]);

export const useSelectDropdownContext = () => {
    return useContext(SelectDropdownContext);
};

export const useSelectDropdownContextValue = <T,>(
    selector: (state: SelectDropdownContextType) => T,
): T => {
    const context = useContext(SelectDropdownContext);
    return selector(context);
};

// SelectProvider - manages controlled/uncontrolled state
const SelectProvider = <Option extends DefaultItemT = DefaultItemT>({
    children,
    value: valueProp,
    defaultValue,
    onChange,
    multiple = false,
    disabled = false,
    error = false,
    labelKey = 'label',
    options = [],
    searchKey,
    onSearchChange,
    hideSelected: hideSelectedProp,
}: SelectProviderProps<Option>) => {
    const [value, onValueChange] = useControlledValue<Option['id'] | Option['id'][] | null>({
        value: valueProp,
        defaultValue: defaultValue ?? (multiple ? [] : null),
        onChange: (newValue, item, event) => {
            onChange?.(newValue, item as Option, event);
        },
    });

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchQueryChange = useCallback(
        (query: string) => {
            setSearchQuery(query);
            onSearchChange?.(query);
        },
        [onSearchChange],
    );

    // Default hideSelected to multiple (true for multi-select, false for single select)
    const hideSelected = hideSelectedProp !== undefined ? hideSelectedProp : multiple;

    const filteredOptions = useMemo(() => {
        let result = options;

        // Filter out selected items if hideSelected is true
        if (hideSelected) {
            result = result.filter(item => {
                if (multiple) {
                    const values = (value as Option['id'][]) || [];
                    return !values.some(v => v === item.id);
                } else {
                    const singleValue = value as Option['id'] | null;
                    return singleValue !== item.id;
                }
            });
        }

        // Apply search filter if there's a search query
        if (searchQuery) {
            const key = searchKey || labelKey || 'label';
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(item => {
                const itemValue = item[key];
                return String(itemValue || '')
                    .toLowerCase()
                    .includes(lowerQuery);
            });
        }

        return result;
    }, [options, searchQuery, searchKey, labelKey, hideSelected, multiple, value]);

    const onAdd = useCallback(
        (item: Option) => {
            if (multiple) {
                const currentValue = (value as Option['id'][]) || [];
                if (!currentValue.find(v => v === item.id)) {
                    onValueChange([...currentValue, item.id] as Option['id'][], item);
                }
            } else {
                onValueChange(item.id, item);
            }
        },
        [multiple, value, onValueChange],
    );

    const onRemove = useCallback(
        (item: Option) => {
            if (multiple) {
                const currentValue = (value as Option['id'][]) || [];
                onValueChange(currentValue.filter(v => v !== item.id) as Option['id'][], item);
            } else {
                onValueChange(null, item);
            }
        },
        [multiple, value, onValueChange],
    );

    const contextValue = useMemo(
        () => ({
            value: value,
            multiple,
            onAdd: onAdd as (item: DefaultItemT) => void,
            onRemove: onRemove as (item: DefaultItemT) => void,
            disabled,
            error,
            labelKey,
            options,
            searchQuery,
            setSearchQuery: handleSearchQueryChange,
            filteredOptions,
        }),
        [
            value,
            multiple,
            onAdd,
            onRemove,
            disabled,
            error,
            labelKey,
            options,
            searchQuery,
            handleSearchQueryChange,
            filteredOptions,
        ],
    );

    return (
        <SelectContext.Provider value={contextValue as unknown as SelectContextValue<DefaultItemT>}>
            {children}
        </SelectContext.Provider>
    );
};

// SelectDropdownProvider - manages dropdown state
const SelectDropdownProvider = ({
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
    const contentRef = useRef<any>(null);
    const [triggerLayout, setTriggerLayout] = useState<{ width: number; height: number } | null>(
        null,
    );
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
            contentRef,
            triggerLayout,
            setTriggerLayout,
        }),
        [isControlled, isOpenProp, isOpen, onClose, onOpen, triggerLayout],
    );

    return (
        <SelectDropdownContext.Provider value={contextValue}>
            {children}
        </SelectDropdownContext.Provider>
    );
};

// Select - wrapper component
const Select = <Option extends DefaultItemT = DefaultItemT>({
    children,
    ...props
}: SelectProviderProps<Option>) => {
    return (
        <SelectProvider<Option> {...props}>
            <SelectDropdownProvider>{children}</SelectDropdownProvider>
        </SelectProvider>
    );
};

// Select.Trigger - opens the dropdown
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

// Select.Value - displays the value
const SelectValue = ({ placeholder, renderValue, style, ...rest }: SelectValueProps) => {
    const { value, multiple, labelKey, onRemove, options } = useSelectContextValue(state => ({
        value: state.value,
        multiple: state.multiple,
        labelKey: state.labelKey,
        onRemove: state.onRemove,
        options: state.options,
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
                    <Chip.Input
                        key={item.id || String(item)}
                        label={item[labelKey || 'label'] || String(item.id || item)}
                        size="sm"
                        selected
                        left={<></>}
                        onClose={() => onRemove(item)}
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
};

SelectValue.displayName = 'Select_Value';

// Select.Dropdown - popover with keyboard navigation
const SelectDropdown = ({
    children,
    WrapperComponent,
    wrapperComponentProps,
    enableKeyboardNavigation = true,
    style: popoverStyleProp,
    ...popoverProps
}: SelectDropdownProps & { enableKeyboardNavigation?: boolean }) => {
    const { isOpen, onClose, triggerRef, triggerLayout } = useSelectDropdownContextValue(state => ({
        isOpen: state.isOpen,
        onClose: state.onClose,
        triggerRef: state.triggerRef,
        triggerLayout: state.triggerLayout,
    }));

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
};

// Keyboard navigation wrapper for web
const KeyboardNavigationWrapper = ({ children }: { children: React.ReactNode }) => {
    const { onClose, contentRef, isOpen } = useSelectDropdownContextValue(state => ({
        onClose: state.onClose,
        contentRef: state.contentRef,
        isOpen: state.isOpen,
    }));

    const handleKeyDown = useCallback(
        (e: globalThis.KeyboardEvent) => {
            if (!contentRef?.current) return;

            // Find all focusable options
            // We assume options have role="option" and are descendants of the contentRef
            // On React Native Web, refs often point to the host node (div)
            const container = contentRef.current as HTMLElement;
            if (!container || !container.querySelectorAll) return;

            const options = Array.from(
                container.querySelectorAll('[role="option"]:not([disabled])'),
            ) as HTMLElement[];

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
                    if (currentIndex !== -1) {
                        options[currentIndex]?.click();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    // Return focus to trigger? This should be handled by the caller/Popover usually.
                    break;
            }
        },
        [contentRef, onClose],
    );

    useEffect(() => {
        if (Platform.OS === 'web') {
            const controller = new AbortController();
            // We attach listener to the window or the container?
            // If we attach to container, it needs focus to receive keys.
            // Popovers usually trap focus.
            // Let's attach to window to be safe, but only when open (which this component implies).
            // Actually, best practice is to attach to the container if it captures focus.
            // But SelectDropdown usually renders in a Portal.
            // Let's attach to window but check if the event target is inside our content.
            // Or rely on the fact that if an option is focused, the keydown bubbles up.
            // If nothing is focused, where do keys go? Body.
            const listener = (e: KeyboardEvent) => {
                // Only handle navigation keys when dropdown is open
                if (!isOpen) return;

                // For arrow keys, Enter, and Escape, allow navigation regardless of focus location
                // This ensures keyboard navigation works even when focus is still on the trigger
                const isNavigationKey = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key);

                if (isNavigationKey) {
                    handleKeyDown(e);
                    return;
                }

                // For other keys, only handle if focus is within the dropdown
                const contentEl = contentRef?.current as HTMLElement | null;
                const dropdownContainer = contentEl?.parentElement ?? contentEl;
                const targetNode = e.target as Node;

                const isWithinDropdown =
                    !!dropdownContainer &&
                    (dropdownContainer === targetNode || dropdownContainer.contains(targetNode));

                if (isWithinDropdown || e.target === document.body) {
                    handleKeyDown(e);
                }
            };

            window.addEventListener('keydown', listener, {
                capture: true,
                signal: controller.signal,
            });

            return () => {
                controller.abort();
            };
        }
        return undefined;
    }, [handleKeyDown, contentRef, isOpen]);

    return <>{children}</>;
};

SelectDropdown.displayName = 'Select_Dropdown';

// Select.Content - ScrollView that renders children
const SelectContent = ({
    children,
    ContainerComponent = ScrollView,
    style,
    emptyState,
    ...rest
}: SelectContentProps) => {
    const { contentRef } = useSelectDropdownContextValue(state => ({
        contentRef: state.contentRef,
    }));

    const { filteredOptions, value, multiple, searchQuery, options } = useSelectContextValue(
        state => ({
            filteredOptions: state.filteredOptions,
            value: state.value,
            multiple: state.multiple,
            searchQuery: state.searchQuery,
            options: state.options,
        }),
    );

    const content = useMemo(() => {
        return filteredOptions.map(option => {
            const isSelected = multiple
                ? (value as any[])?.some(v => (v?.id ?? v) === option.id)
                : (value as any)?.id === option.id || (value as any) === option.id;

            return children(option, !!isSelected);
        });
    }, [filteredOptions, value, multiple, children]);

    const defaultEmptyState = useMemo(() => {
        const hasSearchQuery = searchQuery && searchQuery.trim().length > 0;
        const hasNoOptions = options.length === 0;

        if (hasNoOptions) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No options available</Text>
                </View>
            );
        }

        if (hasSearchQuery) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No results found</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No options</Text>
            </View>
        );
    }, [searchQuery, options.length]);

    return (
        <ContainerComponent ref={contentRef} style={style} {...rest} accessibilityRole="listbox">
            {filteredOptions.length === 0 ? emptyState ?? defaultEmptyState : content}
        </ContainerComponent>
    );
};

SelectContent.displayName = 'Select_Content';

// Select.Group - groups items with label
const SelectGroup = memo(({ children, label, style, ...rest }: SelectGroupProps) => {
    return (
        <View style={style} {...rest}>
            {label && <Text style={styles.groupLabel}>{label}</Text>}
            {children}
        </View>
    );
});

SelectGroup.displayName = 'Select_Group';

// Select.Item - select item that uses context
const SelectOption = memo(
    <Option extends DefaultItemT = DefaultItemT>({
        value,
        children,
        renderItem,
        onPress,
        style,
        disabled: optionDisabledProp = false,
        ...rest
    }: SelectOptionProps<Option>) => {
        const {
            value: selectionValue,
            multiple,
            onAdd,
            onRemove,
            disabled: selectDisabled,
        } = useSelectContextValue<Option>(state => ({
            value: state.value,
            multiple: state.multiple,
            onAdd: state.onAdd,
            onRemove: state.onRemove,
            disabled: state.disabled,
        }));

        const { onClose } = useSelectDropdownContextValue(state => ({
            onClose: state.onClose,
        }));

        const option = useMemo(() => {
            return {
                id: value,
                ...(typeof children === 'string' ? { label: children } : {}),
                ...(optionDisabledProp ? { selectable: false } : {}),
            } as Option;
        }, [children, optionDisabledProp, value]);

        const isSelected = useMemo(() => {
            if (multiple) {
                const values = selectionValue as any[];
                return values?.some(v => (v?.id ?? v) === option.id) || false;
            } else {
                const singleValue = selectionValue as any;
                return (singleValue?.id ?? singleValue) === option.id || false;
            }
        }, [selectionValue, multiple, option.id]);

        const isOptionDisabled = Boolean(
            selectDisabled || optionDisabledProp || option.selectable === false,
        );

        const handlePress = useCallback(
            (event: GestureResponderEvent) => {
                if (isOptionDisabled) return;

                if (onPress) {
                    onPress(option, event);
                }

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

        const content = useMemo(() => {
            if (typeof children === 'string') {
                return <Text style={isOptionDisabled && styles.itemDisabledText}>{children}</Text>;
            }

            if (children) return children;

            return (
                <Text style={isOptionDisabled && styles.itemDisabledText}>
                    {option.label || String(option.id)}
                </Text>
            );
        }, [children, option.id, option.label, isOptionDisabled]);

        const accessibilityProps = {
            accessibilityRole: 'button' as AccessibilityRole, // Fallback for native
            accessibilityState: { selected: isSelected, disabled: isOptionDisabled },
            ...Platform.select({
                web: {
                    accessibilityRole: 'option' as AccessibilityRole,
                    tabIndex: -1 as 0 | -1 | undefined,
                    // Use a dataset attribute to help the keyboard navigator find this
                    'data-option-id': String(option.id),
                },
            }),
        };

        if (renderItem) {
            return (
                <Pressable
                    onPress={handlePress}
                    disabled={isOptionDisabled}
                    style={[isOptionDisabled && styles.itemDisabled, style]}
                    {...accessibilityProps}
                    {...rest}>
                    {renderItem(option, isSelected)}
                </Pressable>
            );
        }

        return (
            <Pressable
                onPress={handlePress}
                disabled={isOptionDisabled}
                style={[
                    styles.item,
                    isSelected && styles.itemSelected,
                    isOptionDisabled && styles.itemDisabled,
                    style,
                ]}
                {...accessibilityProps}
                {...rest}>
                {content}
            </Pressable>
        );
    },
);

SelectOption.displayName = 'Select_Option';

// Select.SearchInput - handles search
const SelectSearchInput = memo(
    ({ onQueryChange, autoFocus = true, ...textInputProps }: SelectSearchInputProps) => {
        const { searchQuery, setSearchQuery } = useSelectContextValue(state => ({
            searchQuery: state.searchQuery,
            setSearchQuery: state.setSearchQuery,
        }));
        const textInputRef = useRef<TextInputHandles>(null);

        const handleChangeText = useCallback(
            (text: string) => {
                setSearchQuery(text);
                onQueryChange?.(text);
                textInputProps.onChangeText?.(text);
            },
            [onQueryChange, setSearchQuery, textInputProps],
        );

        const inputProps = {
            ...textInputProps,
            value: textInputProps.value !== undefined ? textInputProps.value : searchQuery,
            onChangeText: handleChangeText,
            placeholder: textInputProps.placeholder || 'Search...',
            inputStyle: styles.searchInputInput,
        } as TextInputProps;

        useEffect(() => {
            if (Platform.OS !== 'web') return;
            if (!autoFocus || !textInputRef.current) {
                return;
            }

            const node = textInputRef.current as TextInputHandles & {
                focus?: (options?: { preventScroll?: boolean }) => void;
            };

            const focusField = () => {
                try {
                    node.focus?.({ preventScroll: true });
                } catch {
                    const { scrollX, scrollY } = window;
                    node.focus?.();
                    window.scrollTo(scrollX, scrollY);
                }
            };

            // Run after popover layout so positioning is stable before focus.
            requestAnimationFrame(focusField);
        }, [autoFocus]);

        return (
            <TextInput
                ref={textInputRef}
                autoFocus={Platform.OS !== 'web' && autoFocus}
                style={styles.searchInput}
                left={
                    <Icon onPress={() => textInputRef.current?.focus()} name="magnify" size={20} />
                }
                right={
                    searchQuery ? (
                        <IconButton name="close" size={20} onPress={() => setSearchQuery('')} />
                    ) : undefined
                }
                size="sm"
                variant="outlined"
                {...inputProps}
            />
        );
    },
);

SelectSearchInput.displayName = 'Select_SearchInput';

// Attach subcomponents
const SelectWithSubcomponents = Object.assign(Select, {
    Trigger: SelectTrigger,
    Value: SelectValue,
    Dropdown: SelectDropdown,
    Content: SelectContent,
    Group: SelectGroup,
    Option: SelectOption,
    SearchInput: SelectSearchInput,
});

const triggerStyles = StyleSheet.create(theme => ({
    trigger: {
        borderRadius: theme.shapes.corner.extraSmall,
        paddingHorizontal: theme.spacings['3'],
        paddingVertical: theme.spacings['2'],
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        variants: {
            state: {
                disabled: {
                    opacity: 0.38,
                    backgroundColor: theme.colors.surfaceVariant,
                },
                errorDisabled: {
                    opacity: 0.38,
                },
            },
        },
    },
    outline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: theme.shapes.corner.extraSmall,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        pointerEvents: 'none',
        variants: {
            state: {
                focused: {
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                },
                hovered: {
                    borderColor: theme.colors.onSurface,
                },
                hoveredAndFocused: {
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                },
                disabled: {
                    borderColor: theme.colors.onSurface,
                },
                error: {
                    borderColor: theme.colors.error,
                },
                errorFocused: {
                    borderWidth: 2,
                    borderColor: theme.colors.error,
                },
                errorHovered: {
                    borderColor: theme.colors.onErrorContainer,
                },
                errorFocusedAndHovered: {
                    borderWidth: 2,
                    borderColor: theme.colors.error,
                },
                errorDisabled: {
                    borderColor: theme.colors.error,
                },
            },
        },
    },
    triggerIcon: {
        marginLeft: theme.spacings['2'],
        color: theme.colors.onSurfaceVariant,
    },
}));

const styles = StyleSheet.create(theme => ({
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        maxWidth: '90%',
    },
    groupLabel: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['2'],
        fontWeight: '600',
        color: theme.colors.onSurface,
    },
    item: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['3'],
        backgroundColor: 'transparent',

        _web: {
            cursor: 'pointer',
            outlineStyle: 'none',
            _hover: {
                backgroundColor: theme.colors.stateLayer.hover.primary,
            },
            _focus: {
                backgroundColor: theme.colors.stateLayer.hover.primary,
            },
        },
    },
    itemSelected: {
        backgroundColor: theme.colors.stateLayer.hover.primary,
    },
    itemDisabled: {
        opacity: 0.38,
        _web: {
            cursor: 'not-allowed',
        },
    },
    itemDisabledText: {
        color: theme.colors.onSurfaceVariant,
    },
    searchInput: {
        marginHorizontal: theme.spacings['2'],
        marginVertical: theme.spacings['3'],
    },
    searchInputInput: {
        height: 42,
    },
    emptyState: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['6'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyStateText: {
        color: theme.colors.onSurfaceVariant,
        fontSize: 14,
    },
}));

export default SelectWithSubcomponents;
export { SelectDropdownProvider, SelectProvider };
