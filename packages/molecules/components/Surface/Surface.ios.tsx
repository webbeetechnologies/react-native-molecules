import { type ComponentPropsWithRef, forwardRef, memo, type ReactNode, useMemo } from 'react';
import { Animated, type StyleProp, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { MD3Elevation } from '../../types/theme';
import { extractPropertiesFromStyles } from '../../utils/extractPropertiesFromStyles';
import { Slot } from '../Slot';
import { BackgroundContextWrapper } from './BackgroundContextWrapper';
import { defaultStyles, getCombinedShadowStyle } from './utils';

const AnimatedView = Animated.createAnimatedComponent(View);

export type Props = ComponentPropsWithRef<typeof View> & {
    /**
     * Content of the `Surface`.
     */
    children: ReactNode;
    backgroundColor?: string;
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    /**
     * @supported Available in v5.x with theme version 3
     * Changes shadows and background on iOS and Android.
     * Used to create UI hierarchy between components.
     *
     * Note: In version 2 the `elevation` prop was accepted via `style` prop i.e. `style={{ elevation: 4 }}`.
     * It's no longer supported with theme version 3 and you should use `elevation` property instead.
     */
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

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * On dark theme with `adaptive` mode, surface is constructed by also placing a semi-transparent white overlay over a component surface.
 * See [Dark Theme](https://callstack.github.io/react-native-paper/theming.html#dark-theme) for more information.
 * Overlay and shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/surface-android.png" />
 *     <figcaption>Surface on Android</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/surface-ios.png" />
 *     <figcaption>Surface on iOS</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *   <Surface style={styles.surface} elevation={4}>
 *      <Text>Surface</Text>
 *   </Surface>
 * );
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   surface: {
 *     padding: 8,
 *     height: 80,
 *     width: 80,
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *   },
 * });
 * ```
 */
const Surface = (
    { elevation = 1, style, children, testID, asChild = false, ...props }: Props,
    ref: any,
) => {
    const { theme } = useUnistyles();
    const backgroundColor = (() => {
        // @ts-ignore
        return theme.colors.elevation?.[`level${elevation}`];
    })();

    const { surfaceBackground, combinedStyle } = useMemo(() => {
        return {
            surfaceBackground: extractPropertiesFromStyles(
                [defaultStyles.root as ViewStyle, style],
                ['backgroundColor'],
            ).backgroundColor,
            combinedStyle: [
                { backgroundColor },
                getCombinedShadowStyle(elevation),
                defaultStyles.root,
                style,
            ],
        };
    }, [backgroundColor, elevation, style]);

    const Component = asChild ? Slot : AnimatedView;

    return (
        <BackgroundContextWrapper backgroundColor={surfaceBackground}>
            <Component ref={ref} {...props} testID={testID} style={combinedStyle}>
                {children}
            </Component>
        </BackgroundContextWrapper>
    );
};

export default memo(forwardRef(Surface));
