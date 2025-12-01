import { memo } from 'react';
import { View, type ViewProps } from 'react-native';

import { navigationRailHeaderStyles } from './utils';

export type Props = ViewProps & {};

const NavigationRailHeader = memo(({ style, children, ...rest }: Props) => {
    return (
        <View style={[navigationRailHeaderStyles.header, style]} {...rest}>
            {children}
        </View>
    );
});

NavigationRailHeader.displayName = 'NavigationRail_Header';

export default NavigationRailHeader;
