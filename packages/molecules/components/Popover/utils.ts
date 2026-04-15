import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { popoverDefaultStyles } from './common';

const popoverStylesDefault = StyleSheet.create(theme => ({
    popoverContainer: {
        ...popoverDefaultStyles,
        backgroundColor: theme.colors.surface,
        borderRadius: 4,
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.dark ? 0.7 : 0.3,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 100,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        _web: {
            cursor: 'default',
        },
    },
}));

export const popoverStyles = getRegisteredComponentStylesWithFallback(
    'Popover',
    popoverStylesDefault,
);
