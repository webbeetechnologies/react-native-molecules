import { forwardRef, memo, useMemo } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { useControlledValue } from '../../hooks';
import type { IconProps, IconType } from '../Icon';
import type { TooltipProps } from '../Tooltip';
import RatingItem from './RatingItem';
import { ratingStyles } from './utils';

export type Props = ViewProps & {
    /**
     * rating count
     * @default 5
     */
    count?: number;
    /**
     * The rating value.
     */
    value?: number;
    /**
     * The default value for the uncontrolled state
     * @default undefined
     */
    defaultValue?: number;
    /**
     * Callback function that is fired when the hover state changes.
     * @param {number} value The new value.
     */
    onChange?: (value: number) => void;
    /** Removes all hover effects and pointer events.
     * @default false
     */
    readonly?: boolean;
    /**
     * If `true`, the component is disabled
     * @default false
     */
    disabled?: boolean;
    /**
     * name of the empty icon
     */
    iconName?: string;
    /**
     * the type of the empty icon
     */
    iconType?: IconType;
    /**
     * name of the active icon
     */
    activeIconName?: string;
    /**
     * type of the active icon
     */
    activeIconType?: IconType;
    /**
     * size of all the icons
     * */
    size?: number;
    /**
     * color of the empty icon
     * */
    color?: string;
    /**
     * color of the active icon
     * */
    activeColor?: string;
    /**
     * style of the icon container component
     * */
    iconContainerStyle?: ViewStyle;
    /**
     * props for to pass down to all the icons
     * */
    iconProps?: Omit<IconProps, 'name' | 'type' | 'color' | 'ref'>;
    /**
     * display tooltips
     * */
    showTooltips?: boolean;
    /**
     * for configuring tooltip
     * won't be used if showTooltips is false
     * */
    tooltipProps?: TooltipProps;
};

const Rating = (
    {
        count = 5,
        value: valueProp,
        defaultValue,
        onChange: onChangeProp,
        size = 24,
        disabled,
        readonly,
        iconContainerStyle,
        iconName = 'star-outline',
        iconType = 'material-community',
        activeIconName = 'star',
        activeIconType = 'material-community',
        iconProps = {},
        color,
        activeColor,
        style,
        testID,
        showTooltips,
        tooltipProps,
        ...rest
    }: Props,
    ref: any,
) => {
    const componentStyles = useMemo(() => [ratingStyles.root, style], [style]);

    const [value, onChange] = useControlledValue({
        value: valueProp,
        defaultValue,
        onChange: onChangeProp,
    });

    const arrayFromCount = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);

    return (
        <View style={componentStyles} {...rest} testID={testID} ref={ref}>
            {arrayFromCount.map(i => (
                <RatingItem
                    key={i}
                    size={size}
                    disabled={disabled}
                    readonly={readonly}
                    iconContainerStyle={iconContainerStyle}
                    {...iconProps}
                    index={i}
                    name={iconName}
                    type={iconType}
                    activeIconName={activeIconName}
                    activeIconType={activeIconType}
                    value={value}
                    onChange={onChange}
                    color={color}
                    activeColor={activeColor}
                    testID={testID ? `${testID}-rating-item-${i}` : ''}
                    showTooltips={showTooltips}
                    tooltipProps={tooltipProps}
                />
            ))}
        </View>
    );
};

export default memo(forwardRef(Rating));
