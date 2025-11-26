import { forwardRef, memo, useContext, useMemo } from 'react';
import { Platform } from 'react-native';

import RadioButtonAndroid from './RadioButtonAndroid';
import { RadioButtonContext } from './RadioButtonGroup';
import RadioButtonIOS from './RadioButtonIOS';
import { handlePress, isChecked } from './utils';

export type Props = {
    /**
     * Value of the radio button
     */
    value: string;
    /**
     * Status of radio button.
     */
    status?: 'checked' | 'unchecked';
    /**
     * Whether radio is disabled.
     */
    disabled?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Custom color for unchecked radio.
     */
    uncheckedColor?: string;
    /**
     * Custom color for radio.
     */
    color?: string;
    /**
     * testID to be used on tests.
     */
    testID?: string;
};

/**
 * Radio buttons allow the selection a single option from a set.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState('first');
 *
 *   return (
 *     <View>
 *       <RadioButton
 *         value="first"
 *         status={ checked === 'first' ? 'checked' : 'unchecked' }
 *         onPress={() => setChecked('first')}
 *       />
 *       <RadioButton
 *         value="second"
 *         status={ checked === 'second' ? 'checked' : 'unchecked' }
 *         onPress={() => setChecked('second')}
 *       />
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */

const Button = Platform.OS === 'ios' ? RadioButtonIOS : RadioButtonAndroid;

const RadioButton = ({ value, status, disabled, onPress, testID, ...rest }: Props, ref: any) => {
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
    const onRadioPress = useMemo(
        () =>
            disabled
                ? undefined
                : () => {
                      handlePress({
                          onPress,
                          onValueChange: context?.onValueChange,
                          value,
                      });
                  },
        [disabled, onPress, context?.onValueChange, value],
    );

    const accessibilityState = useMemo(() => ({ disabled, checked }), [checked, disabled]);

    return (
        <Button
            {...rest}
            checked={checked}
            onPress={onRadioPress}
            status={status}
            disabled={disabled}
            borderless
            accessibilityRole="radio"
            accessibilityState={accessibilityState}
            accessibilityLiveRegion="polite"
            testID={testID}
            ref={ref}
        />
    );
};

export default memo(forwardRef(RadioButton));
