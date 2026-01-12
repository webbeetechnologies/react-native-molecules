import type { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { createFastContext } from '../../fast-context';
import { registerPortalContext } from '../Portal';
import type { DefaultItemT, SelectContextValue, SelectDropdownContextValue } from './types';

// SelectContext - holds value, onAdd, onRemove with fast-context for optimized rendering
const selectContextDefaultValue: SelectContextValue<DefaultItemT> = {
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
};

const {
    useStoreRef: useSelectStoreRef,
    Provider: SelectContextProvider,
    useContext: useSelectContext,
    useContextValue: useSelectContextValue,
    Context: SelectContext,
} = createFastContext<SelectContextValue<DefaultItemT>>(selectContextDefaultValue, true);

export {
    SelectContext,
    SelectContextProvider,
    useSelectContext,
    useSelectContextValue,
    useSelectStoreRef,
};

// SelectDropdownContext - holds isOpen, onClose, triggerRef with fast-context
export type SelectDropdownContextType = SelectDropdownContextValue & {
    triggerRef: React.RefObject<View> | null;
    contentRef: React.RefObject<any> | null;
    triggerLayout: { width: number; height: number } | null;
    setTriggerLayout: (layout: { width: number; height: number }) => void;
};

const selectDropdownContextDefaultValue: SelectDropdownContextType = {
    isOpen: false,
    onClose: () => {},
    onOpen: () => {},
    triggerRef: null,
    contentRef: null,
    triggerLayout: null,
    setTriggerLayout: () => {},
};

const {
    useStoreRef: useSelectDropdownStoreRef,
    Provider: SelectDropdownContextProvider,
    useContext: useSelectDropdownContext,
    useContextValue: useSelectDropdownContextValue,
    Context: SelectDropdownContext,
} = createFastContext<SelectDropdownContextType>(selectDropdownContextDefaultValue, true);

export {
    SelectDropdownContext,
    SelectDropdownContextProvider,
    useSelectDropdownContext,
    useSelectDropdownContextValue,
    useSelectDropdownStoreRef,
};

registerPortalContext([SelectContext, SelectDropdownContext]);

const triggerDefaultStyles = StyleSheet.create(theme => ({
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

export const defaultStyles = StyleSheet.create(theme => ({
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
                backgroundColor: theme.colors.stateLayer.focussed.primary,
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

export const triggerStyles = getRegisteredComponentStylesWithFallback(
    'Select_Trigger',
    triggerDefaultStyles,
);

export const styles = getRegisteredComponentStylesWithFallback('Select', defaultStyles);
