import { memo } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

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

registerComponentStyles('Drawer_Footer', drawerFooterStylesDefault);

export const drawerFooterStyles = getRegisteredMoleculesComponentStyles('Drawer_Footer');

export default DrawerFooter;
