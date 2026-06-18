import { useControlledValue } from '@react-native-molecules/utils/hooks';
import { forwardRef, memo, useCallback, useContext, useId, useMemo } from 'react';
import { View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import { RadioGroupContext, RadioItemContext } from './context';
import RadioBase from './RadioBase';
import type { RadioGroupProps, RadioLabelProps, RadioProps, RadioRowProps } from './types';
import { radioRowStyles } from './utils';

/**
 * The radio control (the circle). Use inside a RadioRow, or standalone under a RadioGroup with `value`.
 */
const Radio = (
    {
        value,
        disabled: disabledProp,
        size: sizeProp,
        color,
        uncheckedColor,
        stateLayerProps,
        testID,
        ...rest
    }: RadioProps,
    ref: any,
) => {
    const item = useContext(RadioItemContext);
    const group = useContext(RadioGroupContext);

    // Inside a RadioRow the item context drives state; standalone (bare) mode uses group context.
    const checked = item ? item.checked : group?.value === value;
    const disabled = disabledProp ?? item?.disabled ?? group?.disabled;
    const size = sizeProp ?? item?.size ?? group?.size ?? 'md';
    const labelId = item?.labelId;

    const onPress = useCallback(() => {
        if (disabled) return;
        if (item) {
            item.onSelect();
        } else if (value !== undefined) {
            group?.onChange(value);
        }
    }, [disabled, item, group, value]);

    const accessibilityState = useMemo(
        () => ({ checked: !!checked, disabled: !!disabled }),
        [checked, disabled],
    );

    return (
        <RadioBase
            {...rest}
            ref={ref}
            checked={!!checked}
            disabled={disabled}
            size={size}
            color={color}
            uncheckedColor={uncheckedColor}
            onPress={onPress}
            stateLayerProps={stateLayerProps}
            testID={testID}
            accessibilityRole="radio"
            accessibilityState={accessibilityState}
            accessibilityLabelledBy={labelId}
        />
    );
};

/**
 * The label for a RadioRow. Pressing it selects the row's value, and it is wired to the control via
 * `nativeID` / `accessibilityLabelledBy` (web `id` / `aria-labelledby`).
 */
export const RadioLabel = memo(({ children, style, ...rest }: RadioLabelProps) => {
    const item = useContext(RadioItemContext);

    const state = resolveStateVariant({
        disabled: !!item?.disabled,
        checked: !!item?.checked,
    });

    radioRowStyles.useVariants({ state: state as any });

    if (!item) {
        return (
            <Text style={style} {...rest}>
                {children}
            </Text>
        );
    }

    return (
        <Text
            nativeID={item.labelId}
            onPress={item.disabled ? undefined : item.onSelect}
            disabled={item.disabled}
            selectable={false}
            style={[radioRowStyles.label, style]}
            {...rest}>
            {children}
        </Text>
    );
});

RadioLabel.displayName = 'Radio_Label';

/**
 * A row that binds a value to a Radio control and its Radio.Label. The row itself is not pressable —
 * only the Radio and Radio.Label inside it are. Children may be in any order.
 */
export const RadioRow = memo(
    forwardRef(
        ({ value, disabled: disabledProp, style, children, ...rest }: RadioRowProps, ref: any) => {
            const group = useContext(RadioGroupContext);
            const labelId = useId();

            const disabled = disabledProp ?? group?.disabled;
            const checked = group?.value === value;

            const onSelect = useCallback(() => {
                if (disabled) return;
                group?.onChange(value);
            }, [disabled, group, value]);

            const contextValue = useMemo(
                () => ({ value, checked, onSelect, disabled, size: group?.size, labelId }),
                [value, checked, onSelect, disabled, group?.size, labelId],
            );

            return (
                <RadioItemContext.Provider value={contextValue}>
                    <View ref={ref} style={[radioRowStyles.row, style]} {...rest}>
                        {children}
                    </View>
                </RadioItemContext.Provider>
            );
        },
    ),
);

RadioRow.displayName = 'Radio_Row';

/**
 * Controls a group of radios, holding the selected value.
 *
 * ```tsx
 * <RadioGroup value={value} onChange={setValue}>
 *   <RadioRow value="first">
 *     <Radio />
 *     <Radio.Label>First option</Radio.Label>
 *   </RadioRow>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = memo(
    ({
        value: valueProp,
        defaultValue,
        onChange,
        disabled,
        size,
        children,
        ...rest
    }: RadioGroupProps) => {
        const [value, setValue] = useControlledValue({
            value: valueProp,
            defaultValue,
            onChange,
        });

        const contextValue = useMemo(
            () => ({ value, onChange: setValue, disabled, size }),
            [value, setValue, disabled, size],
        );

        return (
            <RadioGroupContext.Provider value={contextValue}>
                <View accessibilityRole="radiogroup" {...rest}>
                    {children}
                </View>
            </RadioGroupContext.Provider>
        );
    },
);

RadioGroup.displayName = 'Radio_Group';

export default memo(forwardRef(Radio));
