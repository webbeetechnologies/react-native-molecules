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
     * When `true`, the component will not render a wrapper element. Instead, it will
     * merge its props (styles, elevation shadow, ref) onto its immediate child element.
     * This follows the Radix UI "Slot" pattern for flexible component composition.
     *
     * @example
     * ```tsx
     * // Without asChild - renders an AnimatedView wrapper
     * <Surface elevation={2}>
     *   <Card><Text>Content</Text></Card>
     * </Surface>
     *
     * // With asChild - merges elevation styles onto the child
     * <Surface asChild elevation={2}>
     *   <Card><Text>Content</Text></Card>
     * </Surface>
     * ```
     *
     * @note When `asChild` is `true`, only a single child element is allowed.
     * @default false
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
