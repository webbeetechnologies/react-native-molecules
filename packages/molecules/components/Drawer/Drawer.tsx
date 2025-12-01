import { memo, type ReactElement } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { useSubcomponents } from '../../hooks';

export type Props = Omit<ViewProps, 'children'> & {
    children: ReactElement | ReactElement[];
};

const allowedChildren = ['Drawer_Footer', 'Drawer_Header', 'Drawer_Content'];

const Drawer = ({ style, children, ...rest }: Props) => {
    const { Drawer_Header, Drawer_Footer, Drawer_Content } = useSubcomponents({
        children,
        allowedChildren,
    });

    return (
        <View style={[drawerStyles.root, style]} {...rest}>
            {Drawer_Header[0]}
            {Drawer_Content[0]}
            {Drawer_Footer[0]}
        </View>
    );
};

const drawerStylesDefault = StyleSheet.create(theme => ({
    root: {
        borderTopRightRadius: theme.shapes.corner.large,
        borderBottomRightRadius: theme.shapes.corner.large,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        minWidth: 360,
        flexGrow: 1,
    },
}));

export const drawerStyles = getRegisteredComponentStylesWithFallback('Drawer', drawerStylesDefault);

export default memo(Drawer);
