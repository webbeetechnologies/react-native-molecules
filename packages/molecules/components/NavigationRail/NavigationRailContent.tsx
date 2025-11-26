import type { ComponentType } from 'react';
import { type ScrollViewProps, View } from 'react-native';

import { navigationRailContentStyles } from './utils';

export type Props = ScrollViewProps & {
    /**
     * ContainerComponent prop allows to replace the default container used in DrawerContent - ScrollView
     * */
    ContainerComponent?: ComponentType<any>;
};

const NavigationRailContent = ({ style, children, ContainerComponent, ...rest }: Props) => {
    const Container = ContainerComponent || View;

    return (
        <Container style={[navigationRailContentStyles.root, style]} {...rest}>
            {children}
        </Container>
    );
};

NavigationRailContent.displayName = 'NavigationRail_Content';

export default NavigationRailContent;
