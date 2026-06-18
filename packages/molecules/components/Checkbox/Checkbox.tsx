import { useControlledValue } from '@react-native-molecules/utils/hooks';
import { forwardRef, memo, useCallback, useContext, useId, useMemo } from 'react';
import { View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import CheckboxBase from './CheckboxBase';
import { CheckboxItemContext } from './context';
import type { CheckboxLabelProps, CheckboxProps, CheckboxRowProps } from './types';
import { checkboxRowStyles } from './utils';

/**
 * The checkbox control (the box). Use inside a CheckboxRow, or standalone with `value`/`onChange`.
 */
const Checkbox = (
    {
        value: valueProp,
        defaultValue,
        onChange: onChangeProp,
        indeterminate,
        disabled: disabledProp,
        size: sizeProp,
        testID,
        ...rest
    }: CheckboxProps,
    ref: any,
) => {
    const item = useContext(CheckboxItemContext);

    const [value, setValue] = useControlledValue({
        value: valueProp,
        defaultValue,
        onChange: onChangeProp,
        disabled: disabledProp,
    });

    // Inside a CheckboxRow the item context drives state; standalone (bare) mode owns its own.
    const checked = item ? item.checked : Boolean(value);
    const disabled = disabledProp ?? item?.disabled;
    const isIndeterminate = item ? item.indeterminate : indeterminate;
    const size = sizeProp ?? item?.size ?? 'md';
    const labelId = item?.labelId;

    const onChange = useCallback(
        (next: boolean) => {
            if (item) {
                item.onToggle();
            } else {
                setValue(next);
            }
        },
        [item, setValue],
    );

    return (
        <CheckboxBase
            {...rest}
            ref={ref}
            value={checked}
            onChange={onChange}
            indeterminate={isIndeterminate}
            disabled={disabled}
            size={size}
            testID={testID}
            accessibilityLabelledBy={labelId}
        />
    );
};

/**
 * The label for a CheckboxRow. Pressing it toggles the checkbox, and it is wired to the control via
 * `nativeID` / `accessibilityLabelledBy` (web `id` / `aria-labelledby`).
 */
export const CheckboxLabel = memo(({ children, style, ...rest }: CheckboxLabelProps) => {
    const item = useContext(CheckboxItemContext);

    const state = resolveStateVariant({
        disabled: !!item?.disabled,
        checked: !!item?.checked,
    });

    checkboxRowStyles.useVariants({ state: state as any });

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
            onPress={item.disabled ? undefined : item.onToggle}
            disabled={item.disabled}
            selectable={false}
            style={[checkboxRowStyles.label, style]}
            {...rest}>
            {children}
        </Text>
    );
});

CheckboxLabel.displayName = 'Checkbox_Label';

/**
 * A row that binds checked state to a Checkbox control and its Checkbox.Label. The row itself is not
 * pressable — only the Checkbox and Checkbox.Label inside it are. Children may be in any order.
 */
export const CheckboxRow = memo(
    forwardRef(
        (
            {
                value: valueProp,
                defaultValue,
                onChange,
                indeterminate,
                disabled,
                size,
                style,
                children,
                ...rest
            }: CheckboxRowProps,
            ref: any,
        ) => {
            const labelId = useId();

            const [value, setValue] = useControlledValue({
                value: valueProp,
                defaultValue,
                onChange,
                disabled,
            });

            const checked = Boolean(value);

            const onToggle = useCallback(() => {
                if (disabled) return;
                setValue(indeterminate ? true : !checked);
            }, [disabled, setValue, checked, indeterminate]);

            const contextValue = useMemo(
                () => ({ checked, onToggle, disabled, indeterminate, size, labelId }),
                [checked, onToggle, disabled, indeterminate, size, labelId],
            );

            return (
                <CheckboxItemContext.Provider value={contextValue}>
                    <View ref={ref} style={[checkboxRowStyles.row, style]} {...rest}>
                        {children}
                    </View>
                </CheckboxItemContext.Provider>
            );
        },
    ),
);

CheckboxRow.displayName = 'Checkbox_Row';

export default memo(forwardRef(Checkbox));
