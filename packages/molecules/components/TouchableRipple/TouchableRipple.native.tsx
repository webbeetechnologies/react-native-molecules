import React, { forwardRef, memo, useMemo } from 'react';
import {
    type BackgroundPropType,
    Platform,
    Pressable,
    type StyleProp,
    StyleSheet,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    View,
    type ViewStyle,
} from 'react-native';
import { withUnistyles } from 'react-native-unistyles';

import { touchableRippleStyles } from './utils';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

type Props = React.ComponentProps<typeof TouchableWithoutFeedback> & {
    borderless?: boolean;
    background?: BackgroundPropType;
    disabled?: boolean;
    onPress?: () => void | null;
    rippleColor?: string;
    underlayColor?: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
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
        ...rest
    }: Props,
    ref: any,
) => {
    const disabled = disabledProp || !rest.onPress;

    const componentStyles = touchableRippleStyles;

    const { rippleColor, underlayColor, containerStyle } = useMemo(() => {
        return {
            rippleColor: rippleColorProp,
            underlayColor: underlayColorProp || rippleColorProp,
            containerStyle: [borderless && styles.borderless, componentStyles.root, style],
        };
    }, [borderless, componentStyles.root, rippleColorProp, style, underlayColorProp]);

    // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
    // https://github.com/facebook/react-native/issues/6480
    const useForeground =
        Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE && borderless;

    if (TouchableRipple.supported) {
        return (
            <TouchableNativeFeedback
                {...rest}
                ref={ref}
                disabled={disabled}
                useForeground={useForeground}
                background={
                    background != null
                        ? background
                        : TouchableNativeFeedback.Ripple(rippleColor!, borderless)
                }>
                <View style={containerStyle}>{React.Children.only(children)}</View>
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
            {React.Children.only(children)}
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

export default memo(
    withUnistyles(forwardRef(TouchableRipple), theme => ({
        rippleColor: theme.colors.onSurfaceRipple,
    })),
);
