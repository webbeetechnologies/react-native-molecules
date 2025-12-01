import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const modalStylesDefault = StyleSheet.create(theme => ({
    root: {},
    container: {
        zIndex: 100,
    },

    backdrop: {
        flex: 1,
        backgroundColor: theme.colors.backdrop,
    },

    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalContent: {
        minWidth: 280,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',

        variants: {
            size: {
                md: {
                    maxWidth: 448,
                    borderRadius: 10,
                },
                lg: {
                    maxWidth: 700,
                    borderRadius: 10,
                },
            },
        },
    },
}));

export const modalStyles = getRegisteredComponentStylesWithFallback('Modal', modalStylesDefault);
