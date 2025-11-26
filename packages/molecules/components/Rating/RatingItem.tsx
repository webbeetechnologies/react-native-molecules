import { forwardRef, memo, useCallback, useMemo } from 'react';
import { Pressable, type ViewStyle } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { Icon, type IconProps, type IconType } from '../Icon';
import { Tooltip, type TooltipProps } from '../Tooltip';
import { ratingItemStyles } from './utils';

export type Props = Omit<IconProps, 'ref'> & {
    index: number;
    value: number;
    onChange: (val: number) => void;
    activeIconName: string;
    activeIconType: IconType;
    disabled?: boolean;
    readonly?: boolean;
    iconContainerStyle?: ViewStyle;
    activeColor?: string;
    color?: string;
    showTooltips?: boolean;
    tooltipProps?: Omit<TooltipProps, 'children'>;
};

const RatingItem = (
    {
        style,
        disabled = false,
        readonly = false,
        iconContainerStyle,
        value,
        index,
        onChange,
        name,
        type,
        activeIconName,
        activeIconType,
        activeColor = 'rgb(250, 175, 0)',
        color,
        showTooltips = true,
        tooltipProps = {},
        ...rest
    }: Props,
    ref: any,
) => {
    const active = value >= index;

    // const componentStyles = useComponentStyles(
    //     'Rating_Item',
    //     [active ? { color: activeColor } : color ? { color } : {}, style],
    //     {
    //         state: resolveStateVariant({
    //             activeAndDisabled: active && disabled,
    //             activeAndReadonly: active && readonly,
    //             active,
    //             disabled,
    //             readonly,
    //         }),
    //     },
    // );
    const state = resolveStateVariant({
        activeAndDisabled: active && disabled,
        activeAndReadonly: active && readonly,
        active,
        disabled,
        readonly,
    });
    ratingItemStyles.useVariants({
        state: state as any,
    });
    const componentStyles = useMemo(
        () => [
            ratingItemStyles.root,
            active ? { color: activeColor } : color ? { color } : {},
            style,
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [active, activeColor, color, style, state],
    );

    const onPress = useCallback(() => {
        onChange(value === index ? 0 : index);
    }, [index, onChange, value]);

    const IconComponent = useMemo(
        () => (
            <Pressable
                ref={ref}
                style={iconContainerStyle}
                onPress={onPress}
                disabled={disabled || readonly}>
                <Icon
                    style={componentStyles}
                    {...rest}
                    name={value >= index ? activeIconName : name}
                    type={value >= index ? activeIconType : type}
                />
            </Pressable>
        ),
        [
            activeIconName,
            activeIconType,
            componentStyles,
            disabled,
            iconContainerStyle,
            index,
            name,
            onPress,
            readonly,
            ref,
            rest,
            type,
            value,
        ],
    );

    return showTooltips ? (
        <Tooltip {...tooltipProps}>
            <Tooltip.Trigger>{IconComponent}</Tooltip.Trigger>
            <Tooltip.Content>{index}</Tooltip.Content>
        </Tooltip>
    ) : (
        IconComponent
    );
};

export default memo(forwardRef(RatingItem));
