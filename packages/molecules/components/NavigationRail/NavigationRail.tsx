import { memo, type ReactElement } from 'react';
import { View, type ViewProps } from 'react-native';

import { extractSubcomponents } from '../../utils/extractSubcomponents';
import { navigationRailStyles } from './utils';

export type Props = Omit<ViewProps, 'children'> & {
    children: ReactElement | ReactElement[];
};
const allowedChildren = [
    { name: 'NavigationRail_Header', allowMultiple: false },
    { name: 'NavigationRail_Content', allowMultiple: false },
    { name: 'NavigationRail_Footer', allowMultiple: false },
];

const NavigationRail = ({ children, style, ...rest }: Props) => {
    const {
        NavigationRail_Header,
        NavigationRail_Content,
        NavigationRail_Footer,
        rest: restChildren,
    } = extractSubcomponents({
        children,
        allowedChildren,
        includeRest: true,
    });

    return (
        <View style={[navigationRailStyles.root, style]} {...rest}>
            {NavigationRail_Header[0]}
            {NavigationRail_Content[0]}
            {NavigationRail_Footer[0]}
            {restChildren}
        </View>
    );
};

export default memo(NavigationRail);
