import { type ComponentProps, forwardRef, memo, type ReactNode, useMemo } from 'react';
import {
    type BackgroundPropType,
    Platform,
    Pressable,
    type StyleProp,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    type ViewStyle,
} from 'react-native';

import { extractPropertiesFromStyles } from '../../utils/extractPropertiesFromStyles';
import { Slot } from '../Slot';
import { touchableRippleStyles } from './utils';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

type Props = ComponentProps<typeof TouchableWithoutFeedback> & {
    borderless?: boolean;
    background?: BackgroundPropType;
    disabled?: boolean;
    onPress?: () => void | null;
    rippleColor?: string;
    underlayColor?: string;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    /**
     * When `true`, the component will not render a wrapper element. Instead, it will
     * merge its props (styles, event handlers, ref) onto its immediate child element.
     * This follows the Radix UI "Slot" pattern for flexible component composition.
     *
     * @note On Android, the native ripple effect will NOT work when `asChild` is `true`
     * because `TouchableNativeFeedback` requires a View wrapper. Only press events will work.
     *
     * @example
     * ```tsx
     * <TouchableRipple asChild onPress={handlePress}>
     *   <View><Text>Custom pressable</Text></View>
     * </TouchableRipple>
     * ```
     *
     * @note When `asChild` is `true`, only a single child element is allowed.
     * @default false
     */
    asChild?: boolean;
};

const TouchableRipple = (
    {
        style,
        background,
        borderless = false,
        disabled: disabledProp,
        rippleColor: rippleColorProp,
        underlayColor: underlayColorProp,
        children,
        asChild = false,
        ...rest
    }: Props,
    ref: any,
) => {
    const disabled = disabledProp || !rest.onPress;

    const componentStyles = touchableRippleStyles;

    const { rippleColor, underlayColor, containerStyle } = useMemo(() => {
        const { rippleColor: _rippleColor } = extractPropertiesFromStyles(
            [componentStyles.root, style],
            ['rippleColor'],
        );
        return {
            rippleColor: rippleColorProp || _rippleColor,
            underlayColor: underlayColorProp || rippleColorProp,
            containerStyle: [borderless && styles.borderless, componentStyles.root, style],
        };
    }, [borderless, componentStyles.root, rippleColorProp, style, underlayColorProp]);

    // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
    // https://github.com/facebook/react-native/issues/6480
    const useForeground =
        Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE && borderless;

    if (asChild) {
        // When asChild is true, use Slot to merge props with the child
        // Note: TouchableNativeFeedback ripple won't work with asChild since it requires a View wrapper
        return (
            <Slot
                {...rest}
                style={containerStyle}
                ref={ref}
                onPress={rest.onPress}
                disabled={disabled}>
                {children}
            </Slot>
        );
    }

    if (TouchableRipple.supported) {
        return (
            <TouchableNativeFeedback
                {...rest}
                ref={ref}
                disabled={disabled}
                useForeground={useForeground}
                style={containerStyle}
                background={
                    background != null
                        ? background
                        : TouchableNativeFeedback.Ripple(rippleColor!, borderless)
                }>
                <>{children}</>
            </TouchableNativeFeedback>
        );
    }

    return (
        <Pressable
            {...rest}
            ref={ref}
            disabled={disabled}
            style={({ pressed }) => [
                containerStyle,
                pressed && { backgroundColor: underlayColor },
            ]}>
            {children}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    borderless: {
        overflow: 'hidden',
    },
});

TouchableRipple.supported =
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

export default memo(forwardRef(TouchableRipple));
