import { forwardRef, memo, ReactNode, useMemo } from 'react';
import { type TextStyle, type ViewStyle, type TextProps, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { WithElements } from '../../types';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { resolveStateVariant } from '../../utils';
import { useActionState } from '../../hooks';
import { registerComponentStyles, getRegisteredMoleculesComponentStyles } from '../../core';

export type DrawerItemElementProps = { color: string; hovered: boolean };

export type DrawerItemElement = ReactNode | ((props: DrawerItemElementProps) => ReactNode);

export type Props = Omit<TouchableRippleProps, 'children' | 'disabled'> &
    WithElements<DrawerItemElement> & {
        label?: string;
        active?: boolean;
        children?: ReactNode;

        leftElementContainerStyle?: ViewStyle;
        rightElementContainerStyle?: ViewStyle;
        contentStyle?: ViewStyle;
        labelStyle?: TextStyle;
        labelProps?: Omit<TextProps, 'children' | 'style'>;
    };

const emptyObj = {};

const DrawerItem = (
    {
        left,
        right,
        label,
        children,
        style,
        active = false,
        leftElementContainerStyle = emptyObj,
        rightElementContainerStyle = emptyObj,
        labelStyle: labelStyleProp = emptyObj,
        contentStyle: contentStyleProp = emptyObj,
        labelProps,
        ...rest
    }: Props,
    ref: any,
) => {
    const { hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });
    const state = resolveStateVariant({
        activeAndHovered: active && hovered,
        active,
        hovered,
    });
    drawerItemStyles.useVariants({
        state: state as any,
    });

    const {
        leftElementColor,
        rightElementColor,
        containerStyle,
        leftElementStyle,
        rightElementStyle,
        contentStyle,
        labelStyle,
    } = useMemo(() => {
        const { leftElement, rightElement, label: _labelStyle, content } = drawerItemStyles;
        const {
            leftElementColor: _leftElementColor,
            rightElementColor: _rightElementColor,
            ...restStyle
        } = drawerItemStyles.root;

        return {
            leftElementColor: _leftElementColor,
            rightElementColor: _rightElementColor,
            containerStyle: [restStyle, style],
            leftElementStyle: [leftElement, leftElementContainerStyle],
            rightElementStyle: [rightElement, rightElementContainerStyle],
            labelStyle: [_labelStyle, labelStyleProp],
            contentStyle: [content, contentStyleProp],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        contentStyleProp,
        labelStyleProp,
        leftElementContainerStyle,
        rightElementContainerStyle,
        style,
        state,
    ]);

    const _hoveredForLeftElement = typeof left === 'function' ? hovered : false;
    const _hoveredForRightElement = typeof right === 'function' ? hovered : false;

    const leftElement = useMemo(
        () =>
            left ? (
                <View style={leftElementStyle}>
                    {typeof left === 'function'
                        ? left?.({
                              color: leftElementColor,
                              hovered: _hoveredForLeftElement,
                          })
                        : left}
                </View>
            ) : null,
        [left, leftElementColor, leftElementStyle, _hoveredForLeftElement],
    );

    const rightElement = useMemo(
        () =>
            right ? (
                <View style={rightElementStyle}>
                    {typeof right === 'function'
                        ? right?.({
                              color: rightElementColor,
                              hovered: _hoveredForRightElement,
                          })
                        : right}
                </View>
            ) : null,
        [right, rightElementColor, rightElementStyle, _hoveredForRightElement],
    );

    return (
        <TouchableRipple style={containerStyle} {...rest} ref={actionsRef}>
            <>
                {leftElement}
                <View style={contentStyle}>
                    <Text style={labelStyle} selectable={false} {...labelProps}>
                        {label}
                    </Text>
                    {children}
                </View>
                {rightElement}
            </>
        </TouchableRipple>
    );
};

const drawerItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.full,
        paddingLeft: theme.spacings['4'],
        paddingRight: theme.spacings['6'],

        leftElementColor: theme.colors.onSurfaceVariant,
        rightElementColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                activeAndHovered: {
                    backgroundColor: theme.colors.secondaryContainer,
                    leftElementColor: theme.colors.onSecondaryContainer,
                },
                active: {
                    backgroundColor: theme.colors.secondaryContainer,
                    leftElementColor: theme.colors.onSecondaryContainer,
                },
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
        },
    },

    leftElement: {
        marginRight: theme.spacings['3'],
    },
    rightElement: {
        marginLeft: theme.spacings['3'],
    },

    content: {
        flexDirection: 'row',
        flex: 1,
    },

    label: {
        color: theme.colors.onSurfaceVariant,
        lineHeight: theme.typescale.labelLarge.lineHeight,
        fontSize: theme.typescale.labelLarge.fontSize,
        fontWeight: theme.typescale.labelLarge.fontWeight,
        flexGrow: 1,

        variants: {
            state: {
                activeAndHovered: {
                    color: theme.colors.onSecondaryContainer,
                },
                active: {
                    color: theme.colors.onSecondaryContainer,
                },
            },
        },
    },
}));

registerComponentStyles('Drawer_Item', drawerItemStylesDefault);
export const drawerItemStyles = getRegisteredMoleculesComponentStyles('Drawer_Item');

export default memo(forwardRef(DrawerItem));
