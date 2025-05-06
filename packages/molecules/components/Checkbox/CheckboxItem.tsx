import { forwardRef, memo, useCallback, useMemo } from 'react';
import { type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '../Text';

import { useControlledValue } from '../../hooks';
import type { CheckBoxBaseProps, States } from './types';
import Checkbox from './Checkbox';
import { resolveStateVariant } from '../../utils';
import { TouchableRipple } from '../TouchableRipple';
import { styles } from './utils';

export type Props = Omit<CheckBoxBaseProps, 'ref'> & {
    /**
     * Label to be displayed on the item.
     */
    label: string;
    /**
     * Style that is passed to Label element.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * Style that is passed to Container element.
     */
    containerStyle?: ViewStyle;
    /**
     * props for the label
     */
    labelProps?: Omit<TextProps, 'children' | 'style'>;
    /**
     * Checkbox control position.
     */
    position?: 'leading' | 'trailing';
};

const CheckboxItem = (
    {
        style: styleProp,
        containerStyle,
        value: valueProp,
        label,
        onChange: onChangeProp,
        defaultValue,
        labelStyle,
        testID,
        position = 'leading',
        accessibilityLabel = label,
        disabled = false,
        size = 'md',
        labelProps,
        indeterminate,
        ...props
    }: Props,
    ref: any,
) => {
    const [value, onChange] = useControlledValue({
        value: valueProp,
        onChange: onChangeProp,
        defaultValue,
        disabled: disabled,
    });

    const isLeading = position === 'leading';
    const state = resolveStateVariant({ disabled, checked: value && !indeterminate });

    styles.useVariants({
        variant: 'item',
        state: state as States,
        isLeading,
        size,
    });

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

    const onPress = useCallback(() => {
        onChange(!value);
    }, [onChange, value]);

    const checkbox = useMemo(() => {
        const checkboxProps = {
            ...props,
            indeterminate,
            defaultValue: false,
            value,
            onChange,
            disabled,
            size,
            style,
        };

        return <Checkbox {...checkboxProps} />;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, indeterminate, value, onChange, disabled, size, style, state]);

    const accessibilityState = useMemo(
        () => ({
            checked: value,
            disabled,
        }),
        [disabled, value],
    );

    return (
        <TouchableRipple
            style={containerStyles}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="checkbox"
            accessibilityState={accessibilityState}
            onPress={onPress}
            testID={testID}
            disabled={disabled}
            ref={ref}>
            <>
                {isLeading && checkbox}
                <Text selectable={false} {...labelProps} style={labelStyles}>
                    {label}
                </Text>
                {!isLeading && checkbox}
            </>
        </TouchableRipple>
    );
};

CheckboxItem.displayName = 'Checkbox_Item';

export default memo(forwardRef(CheckboxItem));
