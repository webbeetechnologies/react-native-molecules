import { memo } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

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

registerComponentStyles('Drawer_Header', drawerHeaderStylesDefault);

export const drawerHeaderStyles = getRegisteredMoleculesComponentStyles('Drawer_Header');

export default DrawerHeader;
