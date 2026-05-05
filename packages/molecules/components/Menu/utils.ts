import { createContext, type RefObject } from 'react';
import type { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export const MenuContext = createContext({
    closeOnSelect: true,
    onClose: () => {},
});

export type MenuRootContextValue = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    triggerRef: RefObject<View | any>;
};

export const MenuRootContext = createContext<MenuRootContextValue>({
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
    triggerRef: { current: null },
});

const menuStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingVertical: theme.spacings['2'],
        backgroundColor: theme.colors.surface,
        minWidth: 112,
        maxWidth: 280,
        borderRadius: theme.shapes.corner.small as unknown as number,
        display: 'flex',
        flexDirection: 'column',
    },
    backdrop: {
        opacity: 0,
    },
}));

export const menuStyles = getRegisteredComponentStylesWithFallback('Menu', menuStylesDefault);
