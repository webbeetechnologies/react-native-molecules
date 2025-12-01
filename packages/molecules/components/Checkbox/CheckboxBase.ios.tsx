import setColor from 'color';
import { forwardRef, memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { Icon } from '../Icon';
import { TouchableRipple } from '../TouchableRipple';
import type { CheckBoxBaseProps, States } from './types';
import { iconSizeMap, styles } from './utils';

export type Props = Omit<CheckBoxBaseProps, 'uncheckedColor' | 'value' | 'defaultValue'> & {
    value: boolean;
};

const CheckboxIOS = (
    {
        value: checked,
        indeterminate,
        disabled = false,
        size = 'sm',
        onChange: onChangeProp,
        color: colorProp,
        style,
        testID,
        ...rest
    }: Props,
    ref: any,
) => {
    const state = resolveStateVariant({
        disabled,
        checked: checked && !indeterminate,
    });

    styles.useVariants({
        variant: 'ios',
        // @ts-ignore // TODO - fix this
        state: state as States,
        size,
    });

    const { checkedColor, iconSize, rippleColor, rippleContainerStyles, iconContainerStyles } =
        useMemo(() => {
            const _checkedColor = colorProp;

            return {
                checkedColor: _checkedColor,
                iconSize: iconSizeMap[size],
                rippleColor: setColor(_checkedColor).fade(0.32).rgb().string(),
                rippleContainerStyles: [styles.root, style],
                iconContainerStyles: { opacity: indeterminate || checked ? 1 : 0 },
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [checked, colorProp, indeterminate, style, state, size]);

    const onChange = useCallback(() => {
        onChangeProp?.(!checked);
    }, [checked, onChangeProp]);

    const icon = indeterminate ? 'minus' : 'check';

    return (
        <TouchableRipple
            {...rest}
            borderless
            rippleColor={rippleColor}
            onPress={onChange}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={{ disabled, checked }}
            accessibilityLiveRegion="polite"
            style={rippleContainerStyles}
            testID={testID}
            ref={ref}>
            <View style={iconContainerStyles}>
                <Icon
                    allowFontScaling={false}
                    type="material-community"
                    name={icon}
                    size={iconSize}
                    color={checkedColor}
                />
            </View>
        </TouchableRipple>
    );
};

export default memo(forwardRef(CheckboxIOS));
