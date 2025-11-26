import { createContext, memo, type ReactNode, useMemo } from 'react';
import { View, type ViewProps } from 'react-native';

import { useControlledValue } from '../../hooks';

export type Props = ViewProps & {
    /**
     * Function to execute on selection change.
     */
    onValueChange?: (value: string) => void;
    /**
     * Value of the currently selected radio button.
     */
    value?: string;
    /**
     * Default selected radio button
     */
    defaultValue?: string;
    /**
     * React elements containing radio buttons.
     */
    children: ReactNode;
};

export type RadioButtonContextType = {
    value: string;
    onValueChange: (item: string) => void;
};

export const RadioButtonContext = createContext<RadioButtonContextType>(null as any);

/**
 * Radio button group allows to control a group of radio buttons.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/radio-button-group-android.gif" />
 *  <figcaption>Android</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/radio-button-group-ios.gif" />
 *  <figcaption>iOS</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton, Text } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('first');
 *
 *   return (
 *     <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
 *       <View>
 *         <Text>First</Text>
 *         <RadioButton value="first" />
 *       </View>
 *       <View>
 *         <Text>Second</Text>
 *         <RadioButton value="second" />
 *       </View>
 *     </RadioButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const RadioButtonGroup = ({
    value: valueProp,
    defaultValue,
    onValueChange: onValueChangeProp,
    children,
    ...rest
}: Props) => {
    const [value, onValueChange] = useControlledValue({
        value: valueProp,
        defaultValue,
        onChange: onValueChangeProp,
    });

    const contextValue = useMemo(() => ({ value, onValueChange }), [onValueChange, value]);

    return (
        <RadioButtonContext.Provider value={contextValue}>
            <View accessibilityRole="radiogroup" {...rest}>
                {children}
            </View>
        </RadioButtonContext.Provider>
    );
};

RadioButtonGroup.displayName = 'RadioButton_Group';

export default memo(RadioButtonGroup);
