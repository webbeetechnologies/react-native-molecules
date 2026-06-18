import type { PropsWithoutRef, ReactNode } from 'react';
import type { TextProps, ViewProps } from 'react-native';

import type { TouchableRippleProps } from '../TouchableRipple';

export type Size = 'sm' | 'md' | 'lg';
export type States = 'disabled' | 'checked' | 'hovered' | 'checkedAndHovered';

/**
 * Internal props for the platform control (CheckboxBase).
 */
export type CheckboxBaseProps = Omit<TouchableRippleProps, 'children'> & {
    /**
     * Whether the checkbox is checked.
     */
    value: boolean;
    /**
     * Called when the checkbox is pressed.
     */
    onChange?: (newValue: boolean) => void;
    /**
     * Whether the checkbox is in the indeterminate state (overrides `value`).
     */
    indeterminate?: boolean;
    /**
     * Whether the checkbox is disabled.
     */
    disabled?: boolean;
    /**
     * Size of the checkbox.
     */
    size?: Size;
    /**
     * Custom color for the checked checkbox.
     */
    color?: string;
    /**
     * Custom color for the unchecked checkbox.
     */
    uncheckedColor?: string;
    /**
     * Accessibility label for the touchable.
     */
    accessibilityLabel?: string;
    /**
     * testID to be used on tests.
     */
    testID?: string;
    /**
     * Props for the state layer.
     */
    stateLayerProps?: PropsWithoutRef<ViewProps>;
};

/**
 * The checkbox control (the box). Use inside a CheckboxRow, or standalone with `value`/`onChange`.
 */
export type CheckboxProps = Omit<CheckboxBaseProps, 'value' | 'onChange'> & {
    /**
     * Whether the checkbox is checked (controlled).
     */
    value?: boolean;
    /**
     * Default checked state (uncontrolled).
     */
    defaultValue?: boolean;
    /**
     * Called when the checked state changes.
     */
    onChange?: (newValue: boolean) => void;
};

export type CheckboxRowProps = ViewProps & {
    /**
     * Whether the checkbox is checked (controlled).
     */
    value?: boolean;
    /**
     * Default checked state (uncontrolled).
     */
    defaultValue?: boolean;
    /**
     * Called when the checked state changes.
     */
    onChange?: (newValue: boolean) => void;
    /**
     * Whether the checkbox is in the indeterminate state.
     */
    indeterminate?: boolean;
    /**
     * Disables the row (control + label).
     */
    disabled?: boolean;
    /**
     * Size applied to the checkbox.
     */
    size?: Size;
    /**
     * Checkbox control and Checkbox.Label, in any order.
     */
    children: ReactNode;
};

export type CheckboxLabelProps = TextProps & {
    children: ReactNode;
};
