import setColor from 'color';
import {
    forwardRef,
    memo,
    type PropsWithoutRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { Animated, Platform, View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useActionState } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { tokenStylesParser } from '../../utils/tokenStylesParser';
import { Icon } from '../Icon';
import { StateLayer } from '../StateLayer';
import { TouchableRipple } from '../TouchableRipple';
import type { CheckBoxBaseProps, States } from './types';
import { iconSizeMap, styles } from './utils';

export type Props = Omit<CheckBoxBaseProps, 'value' | 'defaultValue'> & {
    value: boolean;
    /**
     * props for the stateLayer
     */
    stateLayerProps?: PropsWithoutRef<ViewProps>;
};

const CheckboxAndroid = (
    {
        value: checked,
        indeterminate,
        disabled = false,
        size = 'md',
        onChange: onChangeProp,
        testID,
        style,
        color: colorProp,
        uncheckedColor: uncheckedColorProp,
        stateLayerProps = {},
        ...rest
    }: Props,
    ref: any,
) => {
    const { current: scaleAnim } = useRef<Animated.Value>(new Animated.Value(1));
    const isFirstRendering = useRef<boolean>(true);

    const { actionsRef, hovered } = useActionState({ ref, actionsToListen: ['hover'] });

    const state = resolveStateVariant({
        disabled,
        checkedAndHovered: checked && !indeterminate && hovered,
        checked: checked && !indeterminate,
        hovered,
    });

    styles.useVariants({
        variant: 'android',
        state: state as States,
        size,
    });

    // const componentStyles = useComponentStyles('Checkbox', style, {
    //     variant: 'android',
    //     state: resolveStateVariant({
    //         disabled,
    //         checkedAndHovered: checked && !indeterminate && hovered,
    //         checked: checked && !indeterminate,
    //         hovered,
    //     }),
    //     size,
    // });

    const borderWidth = scaleAnim.interpolate({
        inputRange: [0.8, 1],
        outputRange: [7, 0],
    });

    const {
        iconSize,
        rippleColor,
        scale,
        animationDuration,
        rippleContainerStyles,
        filledContainerStyles,
        animatedContainerStyles,
        animatedFillStyles,
        stateLayerStyle,
        iconStyle,
    } = useMemo(() => {
        // const {
        //     color: checkedColor,
        //     uncheckedColor,
        //     animationScale: _scale,
        //     animationDuration: _animationDuration,
        //     iconSize: _iconSize,
        //     padding,
        //     width,
        //     height,
        //     borderRadius,
        //     ...checkboxStyles
        //     // @ts-ignore
        // } = styles.root;

        const _color = tokenStylesParser.getColor(checked ? colorProp : uncheckedColorProp);

        return {
            iconStyle: [styles.icon, _color],
            iconSize: iconSizeMap[size],
            // TODO - fix this on web
            rippleColor:
                Platform.OS === 'web' ? undefined : setColor(_color).fade(0.32).rgb().string(),
            checkboxStyle: [styles.root, style],
            scale: 1,
            animationDuration: 100,
            rippleContainerStyles: [styles.root],
            animatedContainerStyles: { transform: [{ scale: scaleAnim }] },
            filledContainerStyles: [StyleSheet.absoluteFill, styles.fillContainer],
            // for toggle animation // This needs to be computed because it's opinionated animation
            animatedFillStyles: [
                styles.animatedFill, // 4 because padding - border(which is 1px each side)
                tokenStylesParser.getColor(checked ? colorProp : uncheckedColorProp, 'borderColor'),
                { borderWidth },
            ],
            stateLayerStyle: [styles.stateLayer, stateLayerProps?.style],
        };
    }, [
        borderWidth,
        checked,
        colorProp,
        scaleAnim,
        stateLayerProps?.style,
        style,
        uncheckedColorProp,
        size,
    ]);

    useEffect(() => {
        // Do not run animation on very first rendering
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.85,
                duration: checked ? animationDuration * scale : 0,
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: checked ? animationDuration * scale : animationDuration * scale * 1.75,
                useNativeDriver: false,
            }),
        ]).start();
    }, [checked, scaleAnim, scale, animationDuration]);

    const onChange = useCallback(() => {
        onChangeProp?.(!checked);
    }, [checked, onChangeProp]);

    const icon = indeterminate
        ? 'minus-box'
        : checked
        ? 'checkbox-marked'
        : 'checkbox-blank-outline';

    const accessibilityState = useMemo(() => ({ disabled, checked }), [checked, disabled]);

    return (
        <TouchableRipple
            {...rest}
            borderless
            rippleColor={rippleColor}
            onPress={onChange}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={accessibilityState}
            accessibilityLiveRegion="polite"
            style={rippleContainerStyles}
            testID={testID}
            ref={actionsRef}>
            <>
                <Animated.View style={animatedContainerStyles}>
                    <Icon
                        allowFontScaling={false}
                        type="material-community"
                        name={icon}
                        size={iconSize}
                        style={iconStyle}
                    />
                    <View style={filledContainerStyles}>
                        <Animated.View style={animatedFillStyles} />
                    </View>
                </Animated.View>
                <StateLayer
                    testID={testID ? `${testID}-stateLayer` : ''}
                    {...stateLayerProps}
                    style={stateLayerStyle}
                />
            </>
        </TouchableRipple>
    );
};

// const styles = StyleSheet.create({
//     fillContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

export default memo(forwardRef(CheckboxAndroid));
