import type { PropsWithoutRef, ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';

import type { TouchableRippleProps } from '../TouchableRipple';

export type Size = 'sm' | 'md' | 'lg';
export type States = 'disabled' | 'checked' | 'hovered' | 'checkedAndHovered';

export type RadioGroupProps = ViewProps & {
    /**
     * Value of the currently selected radio.
     */
    value?: string;
    /**
     * Default selected value (uncontrolled).
     */
    defaultValue?: string;
    /**
     * Called when the selected value changes.
     */
    onChange?: (value: string) => void;
    /**
     * Disables every radio in the group.
     */
    disabled?: boolean;
    /**
     * Size applied to every radio in the group.
     */
    size?: Size;
    /**
     * Radio rows / radios.
     */
    children: ReactNode;
};

export type RadioRowProps = ViewProps & {
    /**
     * Value this row represents within the enclosing RadioGroup.
     */
    value: string;
    /**
     * Disables this row (control + label).
     */
    disabled?: boolean;
    /**
     * Radio control and Radio.Label, in any order.
     */
    children: ReactNode;
};

/**
 * The radio control (the circle). Use inside a RadioRow, or standalone under a RadioGroup with `value`.
 */
export type RadioProps = Omit<TouchableRippleProps, 'children'> & {
    /**
     * Required only when used standalone under a RadioGroup (not inside a RadioRow).
     */
    value?: string;
    /**
     * Whether the radio is disabled.
     */
    disabled?: boolean;
    /**
     * Size of the radio. Falls back to the row/group size.
     */
    size?: Size;
    /**
     * Custom color for the checked radio.
     */
    color?: string;
    /**
     * Custom color for the unchecked radio.
     */
    uncheckedColor?: string;
    /**
     * Props for the state layer.
     */
    stateLayerProps?: PropsWithoutRef<ViewProps>;
    /**
     * testID to be used on tests.
     */
    testID?: string;
};

export type RadioLabelProps = TextProps & {
    children: ReactNode;
};

/**
 * Internal props for the platform control (RadioBase).
 */
export type RadioBaseProps = Omit<TouchableRippleProps, 'children'> & {
    checked: boolean;
    disabled?: boolean;
    size?: Size;
    color?: string;
    uncheckedColor?: string;
    onPress?: () => void;
    stateLayerProps?: PropsWithoutRef<ViewProps>;
    testID?: string;
};
