import { forwardRef, memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import setColor from 'color';

import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { resolveStateVariant } from '../../utils';
import { Icon } from '../Icon';
import { DEFAULT_ICON_SIZE, radioButtonStyles } from './utils';

export type Props = Omit<TouchableRippleProps, 'children'> & {
    /**
     * Status of radio button.
     */
    status?: 'checked' | 'unchecked';
    /**
     * Whether radio is disabled.
     */
    disabled?: boolean;
    /**
     * Custom color for radio.
     */
    color?: string;
    /**
     * testID to be used on tests.
     */
    testID?: string;
    /**
     * passed from RadioButton component
     */
    checked: boolean;
    onPress: (() => void) | undefined;
};

const RadioButtonIOS = (
    { disabled, style, color: colorProp, checked, onPress, ...rest }: Props,
    ref: any,
) => {
    const state = resolveStateVariant({
        disabled: !!disabled,
        checked,
    });
    radioButtonStyles.useVariants({
        state: state as any,
    });

    const { containerStyle, iconContainerStyle, checkedColor, rippleColor } = useMemo(() => {
        const {
            color,
            // removing unwanted styles
            uncheckedColor: _uncheckedColor,
            ...checkboxStyles
        } = radioButtonStyles.root;

        return {
            containerStyle: [styles.container, checkboxStyles, style],
            iconContainerStyle: { opacity: checked ? 1 : 0 },
            checkedColor: colorProp || color,
            rippleColor: setColor(color).fade(0.32).rgb().string(),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, colorProp, style, state]);

    return (
        <TouchableRipple
            {...rest}
            ref={ref}
            rippleColor={rippleColor}
            onPress={onPress}
            style={containerStyle}>
            <View style={iconContainerStyle}>
                <Icon
                    allowFontScaling={false}
                    name="check"
                    size={DEFAULT_ICON_SIZE}
                    color={checkedColor}
                />
            </View>
        </TouchableRipple>
    );
};

RadioButtonIOS.displayName = 'RadioButton_IOS';

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        padding: 6,
    },
});

export default memo(forwardRef(RadioButtonIOS));
