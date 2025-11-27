import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';

type TKeyboardDismissableParams = {
    enabled?: boolean;
    callback: Function;
};

type TBackHandler = TKeyboardDismissableParams;

let keyboardDismissHandlers: Array<Function> = [];
export const keyboardDismissHandlerManager = {
    push: (handler: Function) => {
        keyboardDismissHandlers.push(handler);
        return () => {
            keyboardDismissHandlers = keyboardDismissHandlers.filter(h => h !== handler);
        };
    },

    length: () => keyboardDismissHandlers.length,

    pop: () => {
        return keyboardDismissHandlers.pop();
    },
};

/**
 * Handles attaching callback for Escape key listener on web and Back button listener on Android
 */
export const useKeyboardDismissable = ({ enabled, callback }: TKeyboardDismissableParams) => {
    React.useEffect(() => {
        let cleanupFn = () => {};
        if (enabled) {
            cleanupFn = keyboardDismissHandlerManager.push(callback);
        } else {
            cleanupFn();
        }
        return () => {
            cleanupFn();
        };
    }, [enabled, callback]);

    useBackHandler({ enabled, callback });
};

/**
 * Handles attaching callback for Escape key listener on web and Back button listener on Android
 */
export function useBackHandler({ enabled, callback }: TBackHandler) {
    useEffect(() => {
        if (Platform.OS === 'web') return;

        const backHandler = () => {
            callback();
            return true;
        };

        if (enabled) {
            BackHandler.addEventListener('hardwareBackPress', backHandler);
        } else {
            // BackHandler.removeEventListener('hardwareBackPress', backHandler);
        }

        // return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }, [enabled, callback]);
}
