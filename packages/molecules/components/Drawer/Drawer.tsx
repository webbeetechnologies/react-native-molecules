import { memo, type ReactElement } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { extractSubcomponents } from '../../utils/extractSubcomponents';

export type Props = Omit<ViewProps, 'children'> & {
    children: ReactElement | ReactElement[];
};

const allowedChildren = [
    { name: 'Drawer_Footer', allowMultiple: false },
    { name: 'Drawer_Header', allowMultiple: false },
    { name: 'Drawer_Content', allowMultiple: false },
];

const Drawer = ({ style, children, ...rest }: Props) => {
    const {
        Drawer_Header,
        Drawer_Footer,
        Drawer_Content,
        rest: restChildren,
    } = extractSubcomponents({
        children,
        allowedChildren,
        includeRest: true,
    });

    return (
        <View style={[drawerStyles.root, style]} {...rest}>
            {Drawer_Header}
            {Drawer_Content}
            {Drawer_Footer}
            {restChildren}
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
