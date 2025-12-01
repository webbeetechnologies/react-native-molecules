import { memo } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export type Props = ViewProps & {};

const DrawerFooter = memo(({ style, children, ...rest }: Props) => {
    return (
        <View style={[drawerFooterStyles.root, style]} {...rest}>
            {children}
        </View>
    );
});

DrawerFooter.displayName = 'Drawer_Footer';

const drawerFooterStylesDefault = StyleSheet.create({
    root: {},
});

export const drawerFooterStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_Footer',
    drawerFooterStylesDefault,
);

export default DrawerFooter;
