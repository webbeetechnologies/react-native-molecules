import { memo } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export type Props = ViewProps & {};

const DrawerHeader = memo(({ style, children, ...rest }: Props) => {
    return (
        <View style={[drawerHeaderStyles.root, style]} {...rest}>
            {children}
        </View>
    );
});

DrawerHeader.displayName = 'Drawer_Header';

const drawerHeaderStylesDefault = StyleSheet.create({
    root: {},
});

export const drawerHeaderStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_Header',
    drawerHeaderStylesDefault,
);

export default DrawerHeader;
