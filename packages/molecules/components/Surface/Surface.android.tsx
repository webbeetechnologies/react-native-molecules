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
     * Change the component to the HTML tag or custom component use the passed child.
     * This will merge the props of the Surface with the props of the child element.
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
