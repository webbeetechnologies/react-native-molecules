import { type FC, memo, useMemo } from 'react';
import { type TextProps, type TextStyle } from 'react-native';

import { Icon, type IconProps, type IconType } from '../Icon';
import { Text } from '../Text';
import { tabsLabelStyles } from './utils';

const DEFAULT_ICON_SIZE = 24;

export type TabLabelProps = {
    /**
     * label of the tab
     * */
    label?: string;
    labelStyle?: TextStyle;
    labelProps?: Omit<TextProps, 'children' | 'style'>;
    /**
     * icon properties
     * */
    iconName?: string;
    iconType?: IconType;
    iconProps?: Omit<IconProps, 'name' | 'type'>;
    iconStyle?: TextStyle;

    activeColor?: string;

    active: boolean;
    hovered: boolean;

    variant: 'primary' | 'secondary';
};

const TabLabel = memo((props: TabLabelProps) => {
    const {
        activeColor: activeColorProp,
        iconName,
        iconStyle: iconStyleProp,
        iconType,
        iconProps,
        labelStyle: labelStyleProp,
        labelProps,
        label,
        active,
    } = props;

    // tabsLabelStyles.useVariants({
    //     variant,
    //     state: resolveStateVariant({
    //         activeAndHovered: !!active && !!hovered,
    //         hovered,
    //         active,
    //     }),
    // })

    const { labelStyle, iconStyle } = useMemo(() => {
        const color = active && !!activeColorProp ? { color: activeColorProp } : null;

        return {
            labelStyle: [tabsLabelStyles.label, labelStyleProp, color],
            iconStyle: [tabsLabelStyles.icon, iconStyleProp, color],
        };
    }, [active, activeColorProp, iconStyleProp, labelStyleProp]);

    return (
        <>
            {iconName && (
                <Icon
                    style={iconStyle}
                    name={iconName}
                    type={iconType}
                    size={DEFAULT_ICON_SIZE}
                    {...iconProps}
                />
            )}
            <Text style={labelStyle} numberOfLines={1} {...labelProps}>
                {label}
            </Text>
        </>
    );
});

TabLabel.displayName = 'TabLabel';

export default TabLabel as unknown as FC<Omit<TabLabelProps, 'active' | 'hovered' | 'variant'>>;
