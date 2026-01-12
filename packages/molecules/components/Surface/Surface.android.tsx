import { forwardRef, memo, type ReactNode, useMemo } from 'react';
import { Animated, type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { MD3Elevation } from '../../types/theme';
import { extractPropertiesFromStyles } from '../../utils/extractPropertiesFromStyles';
import { Slot } from '../Slot';
import { BackgroundContextWrapper } from './BackgroundContextWrapper';
import { defaultStyles } from './utils';

const AnimatedView = Animated.createAnimatedComponent(View);

export type Props = ViewProps & {
    /**
     * Content of the `Surface`.
     */
    children: ReactNode;
    backgroundColor?: string;
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    elevation?: MD3Elevation;
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

const elevationLevel = [0, 1, 2, 6, 8, 12];

const Surface = (
    { elevation: _elevation = 1, style, children, testID, asChild = false, ...props }: Props,
    ref: any,
) => {
    const { theme } = useUnistyles();

    const backgroundColor = (() => {
        // @ts-ignore
        return theme.colors.elevation?.[`level${elevation}`];
    })();

    const { memoizedStyles, surfaceBackground } = useMemo(() => {
        const elevation = typeof _elevation === 'number' ? (_elevation > 5 ? 5 : _elevation) : 0;
        return {
            memoizedStyles: [
                {
                    backgroundColor,
                },
                defaultStyles.root,
                style,
                {
                    elevation: elevationLevel[elevation],
                },
            ] as StyleProp<ViewStyle>,
            surfaceBackground: extractPropertiesFromStyles(
                [defaultStyles.root as ViewStyle, style],
                ['backgroundColor'],
            ).backgroundColor,
        };
    }, [backgroundColor, _elevation, style]);

    const Component = asChild ? Slot : AnimatedView;

    return (
        <BackgroundContextWrapper backgroundColor={surfaceBackground}>
            <Component ref={ref} {...props} testID={testID} style={memoizedStyles}>
                {children}
            </Component>
        </BackgroundContextWrapper>
    );
};

export default memo(forwardRef(Surface));
