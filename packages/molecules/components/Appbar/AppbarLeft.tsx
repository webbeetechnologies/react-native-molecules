import { memo, type ReactElement, useContext } from 'react';
import { View, type ViewProps } from 'react-native';

import { AppbarContext } from './AppbarBase';
import { appbarLeft } from './utils';

export type Props = Omit<ViewProps, 'children'> & {
    children: ReactElement;
};

const AppbarLeft = memo(({ children, style, ...rest }: Props) => {
    const { type } = useContext(AppbarContext);

    appbarLeft.useVariants({
        size: type,
    });
    return (
        <View {...rest} style={[appbarLeft.root, style]}>
            {children}
        </View>
    );
});

AppbarLeft.displayName = 'Appbar_Left';

export default AppbarLeft;
