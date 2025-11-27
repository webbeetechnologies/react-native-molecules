import { forwardRef, memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { useControlledValue } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import CheckboxBase from './CheckboxBase';
import type { CheckBoxBaseProps, States } from './types';
import { styles } from './utils';

export type Props = CheckBoxBaseProps;

const Checkbox = (
    {
        value: valueProp,
        onChange: onChangeProp,
        defaultValue,
        disabled,
        indeterminate,
        label,
        labelStyle,
        containerStyle,
        labelProps,
        position = 'leading',
        accessibilityLabel: accessibilityLabelProp,
        testID,
        size = 'md',
        style: styleProp,
        ...rest
    }: Props,
    ref: any,
) => {
    const [value, onChange] = useControlledValue({
        value: valueProp,
        onChange: onChangeProp,
        defaultValue,
        disabled: disabled,
    });

    // Prepare label-related state and styles (always compute, even if not used)
    const isLeading = position === 'leading';
    const checked = Boolean(value) && !indeterminate;
    const state = resolveStateVariant({ disabled: Boolean(disabled), checked });
    const accessibilityLabel = accessibilityLabelProp ?? label;

    // Use variants only when label is provided
    if (label) {
        styles.useVariants({
            variant: 'item',
            state: state as States,
            isLeading,
            size,
        });
    }

    const { containerStyles, labelStyles, style } = useMemo(() => {
        return {
            containerStyles: [styles.itemContainer, containerStyle],
            labelStyles: [
                // @ts-ignore
                styles.label,
                labelStyle,
            ],
            style: [styles.root, styleProp],
        };
    }, [containerStyle, labelStyle, styleProp]);

    const onLabelPress = useCallback(() => {
        if (!disabled) {
            onChange(!value);
        }
    }, [onChange, value, disabled]);

    const accessibilityState = useMemo(
        () => ({
            checked: Boolean(value),
            disabled,
        }),
        [disabled, value],
    );

    const checkboxStyle = label ? style : styleProp;
    const checkboxAccessibilityLabel = label ? undefined : accessibilityLabelProp;

    const checkbox = (
        <CheckboxBase
            ref={label ? undefined : ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            indeterminate={indeterminate}
            size={size}
            style={checkboxStyle}
            testID={testID}
            accessibilityLabel={checkboxAccessibilityLabel}
            {...rest}
        />
    );

    if (!label) {
        return checkbox;
    }

    return (
        <View style={containerStyles} ref={ref}>
            {isLeading && checkbox}
            <Text
                onPress={onLabelPress}
                disabled={disabled}
                selectable={false}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="checkbox"
                accessibilityState={accessibilityState}
                {...labelProps}
                style={labelStyles}>
                {label}
            </Text>
            {!isLeading && checkbox}
        </View>
    );
};

export default memo(forwardRef(Checkbox));
