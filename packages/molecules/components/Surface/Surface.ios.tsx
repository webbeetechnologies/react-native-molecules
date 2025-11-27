import { type ComponentPropsWithRef, forwardRef, memo, type ReactNode, useMemo } from 'react';
import { Animated, type StyleProp, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import type { MD3Elevation } from '../../types/theme';
import { BackgroundContextWrapper } from './BackgroundContextWrapper';
import { defaultStyles, extractProperties, getStyleForShadowLayer } from './utils';

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
const Surface = ({ elevation = 1, style, children, testID, ...props }: Props, ref: any) => {
    const { theme } = useUnistyles();
    const backgroundColor = (() => {
        // @ts-ignore
        return theme.colors.elevation?.[`level${elevation}`];
    })();

    const { surfaceBackground, sharedStyle, layer0Style, layer1Style } = useMemo(() => {
        const { position, alignSelf, top, left, right, bottom, borderRadius } = extractProperties(
            [defaultStyles.root as ViewStyle, style],
            ['position', 'alignSelf', 'top', 'left', 'right', 'bottom', 'borderRadius'],
        );
        const absoluteStyle = { position, alignSelf, top, right, bottom, left };

        return {
            surfaceBackground: extractProperties(
                [defaultStyles.root as ViewStyle, style],
                ['backgroundColor'],
            ).backgroundColor,
            sharedStyle: [
                { backgroundColor, borderRadius },
                defaultStyles.root,
                style,
                {
                    position: undefined,
                    alignSelf: undefined,
                    top: undefined,
                    left: undefined,
                    right: undefined,
                    bottom: undefined,
                },
            ],
            layer0Style: [getStyleForShadowLayer(0, elevation), absoluteStyle, { borderRadius }],
            layer1Style: [getStyleForShadowLayer(1, elevation), { borderRadius }],
        };
    }, [backgroundColor, elevation, style]);

    return (
        <BackgroundContextWrapper backgroundColor={surfaceBackground}>
            <View ref={ref} style={layer0Style}>
                <View style={layer1Style}>
                    <View {...props} testID={testID} style={sharedStyle}>
                        {children}
                    </View>
                </View>
            </View>
        </BackgroundContextWrapper>
    );
};

export default memo(forwardRef(Surface));
