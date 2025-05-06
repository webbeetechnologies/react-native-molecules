import { forwardRef, memo, useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import type {
    GestureResponderEvent,
    TextProps,
    ViewProps,
    PressableProps,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import { Icon, type IconProps, type IconType } from '../Icon';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { Badge, type BadgeProps } from '../Badge';
import { resolveStateVariant } from '../../utils';
import { StateLayer } from '../StateLayer';
import { navigationRailItemStyles } from './utils';
import { useActionState } from '../../hooks';

export type Props = Omit<PressableProps, 'children' | 'disabled' | 'onPress'> & {
    /**
     * Whether the NavigationRailItem is active or not
     * */
    active?: boolean;
    /**
     * label of the NavigationRailItem, if not specified only the icon will be shown and active indicator with be circular
     * */
    label?: string;
    /**
     * name of the icon
     * */
    iconName: string;
    /**
     * type of the icon
     * */
    iconType?: IconType;
    /**
     * name of the active icon. If not specified, iconName will be used
     * */
    activeIconName?: string;
    /**
     * type of the active icon. If not specified, default iconType will be used
     * */
    activeIconType?: IconType;
    /**
     * Icon Props
     * */
    iconProps?: Omit<IconProps, 'name' | 'type'>;
    /**
     * size of the NavigationRailItem
     * */
    size?: 'sm' | 'md' | 'lg';
    /**
     * onPress event for the icon, the same event will be triggered if it's click on the icon, the label or the overall item
     * */
    onPress?: (e: GestureResponderEvent) => void;
    /**
     * Icon Container Props
     * */
    iconContainerProps?: Partial<Omit<TouchableRippleProps, 'ref'>>;
    /**
     * Label Props
     * */
    labelProps?: Partial<TextProps>;
    /**
     * Whether to display the badge or not
     * */
    showBadge?: boolean;
    /**
     * Badge Label, if it's not specified and showBadge is true, sm badge will display
     * */
    badgeLabel?: BadgeProps['label'];
    /**
     * Badge Props
     * */
    badgeProps?: Omit<BadgeProps, 'label'>;
    /**
     * Props for the state layer
     * */
    stateLayerProps?: ViewProps;
};

const defaultIconSize = 24;
const emptyObj = {};

const NavigationRailItem = memo(
    forwardRef(
        (
            {
                active = false,
                iconName,
                iconType,
                activeIconName,
                activeIconType,
                iconProps = emptyObj,
                style,
                label,
                size = 'md',
                onPress,
                iconContainerProps = emptyObj,
                labelProps = emptyObj,
                showBadge = false,
                badgeLabel,
                badgeProps = emptyObj,
                stateLayerProps = emptyObj,
                testID,
                ...rest
            }: Props,
            ref: any,
        ) => {
            const { hovered, actionsRef } = useActionState({ actionsToListen: ['hover'] });

            const state = resolveStateVariant({
                activeAndHovered: active && hovered,
                active,
                hovered,
            });

            navigationRailItemStyles.useVariants({
                state: state as any,
                size,
            });

            const { iconContainerStyle, iconStyle, badgeStyle, stateLayerStyle } = useMemo(() => {
                return {
                    iconContainerStyle: [
                        navigationRailItemStyles.iconContainer,
                        !label && {
                            height: navigationRailItemStyles.iconContainer.width,
                        },
                        iconContainerProps.style,
                    ],
                    iconStyle: [navigationRailItemStyles.icon, iconProps.style],
                    badgeStyle: [
                        navigationRailItemStyles.badge,
                        badgeLabel && badgeProps.size !== 'sm' && styles.badgeWithLabel,
                        badgeProps.style,
                    ] as StyleProp<ViewStyle>,
                    stateLayerStyle: [navigationRailItemStyles.stateLayer, stateLayerProps.style],
                };
                // eslint-disable-next-line
            }, [
                active,
                hovered,
                badgeLabel,
                badgeProps.size,
                badgeProps.style,
                iconContainerProps.style,
                iconProps.style,
                label,
                state,
                size,
                stateLayerProps.style,
            ]);

            const onPressIconContainer = useCallback(
                (e: GestureResponderEvent) => {
                    iconContainerProps.onPress?.(e);
                    onPress?.(e);
                },
                [iconContainerProps, onPress],
            );

            return (
                <Pressable
                    style={[navigationRailItemStyles.root, style] as StyleProp<ViewStyle>}
                    onPress={onPress}
                    accessibilityRole="none"
                    testID={testID}
                    {...rest}
                    ref={ref}>
                    <TouchableRipple
                        borderless
                        testID={testID ? `${testID}-iconContainer` : ''}
                        {...iconContainerProps}
                        ref={actionsRef}
                        style={iconContainerStyle}
                        onPress={onPressIconContainer}>
                        <>
                            <Icon
                                size={defaultIconSize}
                                testID={testID ? `${testID}-icon` : ''}
                                {...iconProps}
                                style={iconStyle}
                                name={active ? activeIconName || iconName : iconName}
                                type={active ? activeIconType || iconType : iconType}>
                                {showBadge && (
                                    <Badge label={badgeLabel} {...badgeProps} style={badgeStyle} />
                                )}
                            </Icon>
                            <StateLayer
                                testID={testID ? `${testID}-stateLayer` : ''}
                                {...stateLayerProps}
                                style={stateLayerStyle}
                            />
                        </>
                    </TouchableRipple>
                    <>
                        {label && (
                            <Text
                                selectable={false}
                                testID={testID ? `${testID}-label` : ''}
                                {...labelProps}
                                style={navigationRailItemStyles.label}>
                                {label}
                            </Text>
                        )}
                    </>
                </Pressable>
            );
        },
    ),
);

NavigationRailItem.displayName = 'NavigationRail_Item';

const styles = StyleSheet.create({
    badgeWithLabel: {
        bottom: '55%',
        left: '45%',
    },
});

export default NavigationRailItem;
