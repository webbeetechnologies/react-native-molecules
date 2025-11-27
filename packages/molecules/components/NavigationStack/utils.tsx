import { useContext } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { NavigationStackContext } from './NavigationStack';

export const useNavigation = () => {
    return useContext(NavigationStackContext);
};

export const useRoute = () => {
    return useContext(NavigationStackContext).currentRoute;
};

export const navigationStackItemStyles = StyleSheet.create({
    root: {},
});
