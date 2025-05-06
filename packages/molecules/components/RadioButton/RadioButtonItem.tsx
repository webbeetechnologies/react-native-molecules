import { forwardRef, memo, useCallback, useContext, useMemo } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from '../Text';

import RadioButton from './RadioButton';
import { RadioButtonContext } from './RadioButtonGroup';
import { handlePress, isChecked, radioButtonItemStyles } from './utils';
import { resolveStateVariant } from '../../utils';
import { TouchableRipple } from '../TouchableRipple';

export type Props = {
    /**
     * Value of the radio button.
     */
    value: string;
    /**
     * Label to be displayed on the item.
     */
    label: string;
    /**
     * Whether radio is disabled.
     */
    disabled?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Accessibility label for the touchable. This is read by the screen reader when the user taps the touchable.
     */
    accessibilityLabel?: string;
    /**
     * Custom color for unchecked radio.
     */
    uncheckedColor?: string;
    /**
     * Custom color for radio.
     */
    color?: string;
    /**
     * Status of radio button.
     */
    status?: 'checked' | 'unchecked';
    /**
     * Additional styles for container View.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * TouchableRipple style
     */
    rippleContainerStyle?: StyleProp<ViewStyle>;
    /**
     * Style that is passed to Label element.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * Style that is passed to Container element.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * testID to be used on tests.
     */
    testID?: string;
    /**
     * Radio button control position.
     */
    position?: 'leading' | 'trailing';
};

/**
 * RadioButton.Item allows you to press the whole row (item) instead of only the RadioButton.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/radio-item.ios.png" />
 *     <figcaption>Pressed</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { RadioButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('first');
 *
 *   return (
 *     <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
 *       <RadioButton.Item label="First item" value="first" />
 *       <RadioButton.Item label="Second item" value="second" />
 *     </RadioButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const RadioButtonItem = (
    {
        value,
        label,
        style: styleProp,
        labelStyle,
        onPress,
        disabled,
        color,
        uncheckedColor,
        status,
        accessibilityLabel = label,
        testID,
        position = 'trailing',
        containerStyle,
        rippleContainerStyle,
    }: Props,
    ref: any,
) => {
    const context = useContext(RadioButtonContext);

    const checked = useMemo(
        () =>
            isChecked({
                contextValue: context?.value,
                status,
                value,
            }) === 'checked',
        [context?.value, status, value],
    );

    const state = resolveStateVariant({
        disabled: !!disabled,
        checked,
    });

    radioButtonItemStyles.useVariants({
        state: state as any,
    });

    // const componentStyles = useComponentStyles('RadioButton_Item', styleProp, {
    //     state: resolveStateVariant({
    //         disabled: !!disabled,
    //         checked,
    //     }),
    // });

    const isLeading = position === 'leading';

    const { containerStyles, labelStyles, accessibilityState, radioButtonProps } = useMemo(() => {
        return {
            containerStyles: [radioButtonItemStyles.root, styles.container, containerStyle],
            labelStyles: [
                styles.label,
                radioButtonItemStyles.label,
                {
                    textAlign: isLeading ? 'right' : 'left',
                },
                labelStyle,
            ] as StyleProp<TextStyle>,
            accessibilityState: {
                checked,
                disabled,
            },
            radioButtonProps: {
                value,
                disabled,
                status,
                color,
                uncheckedColor,
                checked,
                style: styleProp,
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        checked,
        color,
        containerStyle,
        disabled,
        isLeading,
        labelStyle,
        status,
        styleProp,
        uncheckedColor,
        value,
        state,
    ]);

    const onRadioPress = useCallback(
        () =>
            handlePress({
                onPress: onPress,
                onValueChange: context?.onValueChange,
                value,
            }),
        [onPress, context?.onValueChange, value],
    );

    return (
        <TouchableRipple
            ref={ref}
            onPress={onRadioPress}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="radio"
            accessibilityState={accessibilityState}
            testID={testID}
            disabled={disabled}
            style={rippleContainerStyle}>
            <View style={containerStyles} pointerEvents="none">
                {isLeading && <RadioButton {...radioButtonProps} />}
                <Text style={labelStyles}>{label}</Text>
                {!isLeading && <RadioButton {...radioButtonProps} />}
            </View>
        </TouchableRipple>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        flexShrink: 1,
        flexGrow: 1,
        fontSize: 16,
    },
});

RadioButtonItem.displayName = 'RadioButton_Item';

export default memo(forwardRef(RadioButtonItem));
