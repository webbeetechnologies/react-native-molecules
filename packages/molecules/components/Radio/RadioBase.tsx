import { forwardRef, memo, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useActionState } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { tokenStylesParser } from '../../utils/tokenStylesParser';
import { StateLayer } from '../StateLayer';
import { TouchableRipple } from '../TouchableRipple';
import type { RadioBaseProps } from './types';
import { ANIMATION_DURATION, radioStyles } from './utils';

const BORDER_WIDTH = 2;

const RadioBaseAndroid = (
    {
        disabled = false,
        size = 'md',
        testID,
        color: colorProp,
        uncheckedColor: uncheckedColorProp,
        style,
        checked,
        onPress,
        stateLayerProps = {},
        ...rest
    }: RadioBaseProps,
    ref: any,
) => {
    const { actionsRef, hovered } = useActionState({ ref, actionsToListen: ['hover'] });
    const { current: borderAnim } = useRef<Animated.Value>(new Animated.Value(BORDER_WIDTH));
    const { current: radioAnim } = useRef<Animated.Value>(new Animated.Value(1));
    const isFirstRendering = useRef<boolean>(true);

    const state = resolveStateVariant({
        disabled,
        checkedAndHovered: checked && hovered,
        checked,
        hovered,
    });

    radioStyles.useVariants({
        state: state as any,
        size: size as any,
    });

    const { containerStyles, radioStyle, dotStyles, dotContainerStyles, stateLayerStyle } =
        useMemo(() => {
            return {
                containerStyles: [radioStyles.container, radioStyles.root, style],
                radioStyle: [
                    radioStyles.radio,
                    { borderWidth: borderAnim },
                    tokenStylesParser.getColor(
                        checked ? colorProp : uncheckedColorProp,
                        'borderColor',
                    ),
                ],
                dotContainerStyles: [StyleSheet.absoluteFill, radioStyles.radioContainer],
                dotStyles: [
                    radioStyles.dot,
                    { transform: [{ scale: radioAnim }] },
                    tokenStylesParser.getColor(
                        checked ? colorProp : uncheckedColorProp,
                        'backgroundColor',
                    ),
                ],
                stateLayerStyle: [radioStyles.stateLayer, stateLayerProps?.style],
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            borderAnim,
            checked,
            colorProp,
            radioAnim,
            stateLayerProps?.style,
            uncheckedColorProp,
            style,
            state,
            size,
        ]);

    useEffect(() => {
        // Do not run animation on the very first render.
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }

        if (checked) {
            radioAnim.setValue(1.2);
            Animated.timing(radioAnim, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start();
        } else {
            borderAnim.setValue(10);
            Animated.timing(borderAnim, {
                toValue: BORDER_WIDTH,
                duration: ANIMATION_DURATION,
                useNativeDriver: false,
            }).start();
        }
    }, [checked, borderAnim, radioAnim]);

    return (
        <TouchableRipple
            {...rest}
            ref={actionsRef}
            onPress={onPress}
            disabled={disabled}
            borderless
            style={containerStyles}
            testID={testID}>
            <>
                <Animated.View style={radioStyle}>
                    {checked ? (
                        <View style={dotContainerStyles}>
                            <Animated.View style={dotStyles} />
                        </View>
                    ) : null}
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

RadioBaseAndroid.displayName = 'Radio_Base';

export default memo(forwardRef(RadioBaseAndroid));
