import { type ComponentType, memo } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

export type Props = ScrollViewProps & {
    /**
     * ContainerComponent prop allows to replace the default container used in DrawerContent - ScrollView
     * */
    ContainerComponent?: ComponentType<any>;
};

const DrawerContent = memo(
    ({ style, children, ContainerComponent = ScrollView, ...rest }: Props) => {
        return (
            <ContainerComponent style={[drawerContentStyles.root, style]} {...rest}>
                {children}
            </ContainerComponent>
        );
    },
);

const drawerContentStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingHorizontal: theme.spacings['3'],
        flex: 1,
    },
}));
registerComponentStyles('Drawer_Content', drawerContentStylesDefault);
export const drawerContentStyles = getRegisteredMoleculesComponentStyles('Drawer_Content');

DrawerContent.displayName = 'Drawer_Content';

export default DrawerContent;
