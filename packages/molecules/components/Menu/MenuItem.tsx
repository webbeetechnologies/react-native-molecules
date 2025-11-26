import { forwardRef, memo, type ReactNode, useCallback, useContext, useMemo } from 'react';
import {
    type GestureResponderEvent,
    type StyleProp,
    Text,
    type TextProps,
    View,
    type ViewStyle,
} from 'react-native';

import { useActionState } from '../../hooks';
import type { WithElements } from '../../types';
import { resolveStateVariant } from '../../utils';
import { StateLayer, type StateLayerProps } from '../StateLayer';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { MenuContext } from './Menu';
import { menuItemStyles } from './utils';

export type Props = TouchableRippleProps &
    WithElements<ReactNode> & {
        size?: 'default' | 'dense';
        stateLayerProps?: StateLayerProps;
        textProps?: Omit<TextProps, 'children'>;
        leftElementStyle?: StyleProp<ViewStyle>;
        rightElementStyle?: StyleProp<ViewStyle>;
    };

const emptyObj = {};

const _MenuItem = (
    {
        onPress,
        left,
        right,
        children,
        disabled = false,
        size = 'default',
        style,
        testID,
        stateLayerProps,
        textProps = emptyObj,
        leftElementStyle: _leftElementStyle,
        rightElementStyle: _rightElementStyle,
        ...rest
    }: Props,
    ref: any,
) => {
    const { hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });

    const { closeOnSelect, onClose } = useContext(MenuContext);

    const state = resolveStateVariant({
        disabled,
        hovered,
    });

    menuItemStyles.useVariants({
        size: size as any,
        state: state as any,
    });

    const onPressItem = useCallback(
        (e: GestureResponderEvent) => {
            if (closeOnSelect) onClose();

            onPress?.(e);
        },
        [closeOnSelect, onClose, onPress],
    );

    const { containerStyle, leftElementStyle, rightElementStyle, textStyle, stateLayerStyle } =
        useMemo(() => {
            const { text, leftElement, rightElement, stateLayer } = menuItemStyles;

            return {
                containerStyle: [menuItemStyles.root, style],
                textStyle: [text, textProps?.style],
                leftElementStyle: [leftElement, _leftElementStyle],
                rightElementStyle: [rightElement, _rightElementStyle],
                stateLayerStyle: stateLayer,
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [_leftElementStyle, _rightElementStyle, style, textProps?.style, state, size]);

    return (
        <TouchableRipple
            {...rest}
            testID={testID}
            style={containerStyle}
            disabled={disabled}
            onPress={onPressItem}
            ref={actionsRef}>
            <>
                {left ? (
                    <View style={leftElementStyle} testID={testID ? `${testID}-left` : ''}>
                        {left}
                    </View>
                ) : null}

                <Text
                    style={textStyle}
                    numberOfLines={1}
                    {...textProps}
                    testID={testID ? `${testID}-text` : ''}>
                    {children}
                </Text>

                {right ? (
                    <View style={rightElementStyle} testID={testID ? `${testID}-right` : ''}>
                        {right}
                    </View>
                ) : null}

                <StateLayer
                    testID={testID ? `${testID}-stateLayer` : ''}
                    {...stateLayerProps}
                    style={stateLayerStyle}
                />
            </>
        </TouchableRipple>
    );
};

const MenuItem = memo(forwardRef(_MenuItem));

MenuItem.displayName = 'Menu_Item';

export default MenuItem;
