import { memo, type ReactElement, useEffect, useRef } from 'react';
import { Animated, type ViewProps } from 'react-native';

import { navigationStackItemStyles, useNavigation } from './utils';

export type Props = ViewProps & {
    name: string;
    children: ReactElement;
};

const NavigationStackItemContainer = memo(({ name, children, ...rest }: Props) => {
    const { currentRoute } = useNavigation();

    return (
        <NavigationStackItem isCurrentRoute={currentRoute === name} children={children} {...rest} />
    );
});

const NavigationStackItem = memo(
    ({
        isCurrentRoute,
        children,
        style,
        ...rest
    }: Omit<Props, 'name'> & { isCurrentRoute: boolean }) => {
        const opacityRef = useRef(new Animated.Value(isCurrentRoute ? 1 : 0));

        useEffect(() => {
            if (isCurrentRoute) {
                opacityRef.current.setValue(0);
            }

            Animated.timing(opacityRef.current, {
                toValue: isCurrentRoute ? 1 : 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }, [isCurrentRoute, opacityRef]);

        return (
            <>
                {isCurrentRoute && (
                    <Animated.View
                        style={[
                            { opacity: opacityRef.current },
                            navigationStackItemStyles.root,
                            style,
                        ]}
                        {...rest}>
                        {children}
                    </Animated.View>
                )}
            </>
        );
    },
);

NavigationStackItemContainer.displayName = 'NavigationStack.Item';

export default NavigationStackItemContainer;
