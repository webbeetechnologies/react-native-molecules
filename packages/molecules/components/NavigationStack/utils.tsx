import { useContext } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { NavigationStackContext } from './NavigationStack';

export const useNavigation = () => {
    return useContext(NavigationStackContext);
};

export const useRoute = () => {
    return useContext(NavigationStackContext).currentRoute;
};

export const navigationStackItemStylesDefault = StyleSheet.create({
    root: {},
});

export const navigationStackItemStyles = getRegisteredComponentStylesWithFallback(
    'NavigationStack_Item',
    navigationStackItemStylesDefault,
);
