import { Children, cloneElement, memo, ReactElement, useMemo } from 'react';
import { View, type ViewProps } from 'react-native';
import { appbarRight } from './utils';

export type Props = Omit<ViewProps, 'children'> & {
    children: ReactElement | ReactElement[];
    /** number or design token
     * */
    spacing?: number | string;
};

const AppbarRight = memo(({ children, spacing, style, ...rest }: Props) => {
    const content = useMemo(
        () =>
            Children.map(children, child => {
                return cloneElement(child, {
                    // @ts-expect-error // TODO: fix this
                    style: [
                        {
                            marginLeft: spacing,
                        },
                        // @ts-expect-error // TODO: fix this
                        child.props?.style,
                    ],
                });
            }),
        [children, spacing],
    );

    return (
        <View {...rest} style={[appbarRight.root, style]}>
            {content}
        </View>
    );
});

AppbarRight.displayName = 'Appbar_Right';

export default AppbarRight;
