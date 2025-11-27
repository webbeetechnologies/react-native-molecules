import { memo, type ReactElement } from 'react';
import { View, type ViewProps } from 'react-native';

import { useSubcomponents } from '../../hooks';
import { navigationRailStyles } from './utils';

export type Props = Omit<ViewProps, 'children'> & {
    children: ReactElement | ReactElement[];
};
const allowedChildren = [
    'NavigationRail_Header',
    'NavigationRail_Content',
    'NavigationRail_Footer',
];

const NavigationRail = ({ children, style, ...rest }: Props) => {
    const { NavigationRail_Header, NavigationRail_Content, NavigationRail_Footer } =
        useSubcomponents({
            children,
            allowedChildren,
        });

    return (
        <View style={[navigationRailStyles.root, style]} {...rest}>
            {NavigationRail_Header[0]}
            {NavigationRail_Content[0]}
            {NavigationRail_Footer[0]}
        </View>
    );
};

export default memo(NavigationRail);
