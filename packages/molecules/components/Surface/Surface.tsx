import { forwardRef, memo, type ReactNode, useMemo } from 'react';
import { Animated, type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';

import shadow from '../../styles/shadow';
import type { MD3Elevation } from '../../types/theme';
import { Slot } from '../Slot';
import { BackgroundContextWrapper } from './BackgroundContextWrapper';
import { defaultStyles } from './utils';

const AnimatedView = Animated.createAnimatedComponent(View);

export type Props = ViewProps & {
    /**
     * Content of the `Surface`.
     */
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    elevation?: MD3Elevation;
    backgroundColor?: string;
    /**
     * TestID used for testing purposes
     */
    testID?: string;
    /**
     * Change the component to the HTML tag or custom component use the passed child.
     * This will merge the props of the Surface with the props of the child element.
     */
    asChild?: boolean;
};

// for Web
const Surface = (
    { elevation = 1, style, children, testID, backgroundColor, asChild = false, ...props }: Props,
    ref: any,
) => {
    const { surfaceStyle } = useMemo(() => {
        return {
            surfaceStyle: [
                elevation ? shadow(elevation) : null,
                defaultStyles.root,
                style,
                backgroundColor ? { backgroundColor } : {},
            ] as StyleProp<ViewStyle>,
        };
    }, [backgroundColor, elevation, style]);

    const Component = asChild ? Slot : AnimatedView;

    return (
        <BackgroundContextWrapper backgroundColor={backgroundColor!}>
            <Component ref={ref} {...props} testID={testID} style={surfaceStyle}>
                {children}
            </Component>
        </BackgroundContextWrapper>
    );
};

export default memo(forwardRef(Surface));
