import { memo } from 'react';
import { View, type ViewProps } from 'react-native';

import { navigationRailFooterStyles } from './utils';

export type Props = ViewProps & {};

const NavigationRailFooter = memo(({ style, children, ...rest }: Props) => {
    return (
        <View style={[navigationRailFooterStyles.root, style]} {...rest}>
            {children}
        </View>
    );
});

NavigationRailFooter.displayName = 'NavigationRail_Footer';

export default NavigationRailFooter;
