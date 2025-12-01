import { type ComponentType, memo } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

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
export const drawerContentStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_Content',
    drawerContentStylesDefault,
);

DrawerContent.displayName = 'Drawer_Content';

export default DrawerContent;
