import setColor from 'color';
import { forwardRef, memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { tokenStylesParser } from '../../utils/tokenStylesParser';
import { Icon } from '../Icon';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
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
    /**
     * passed from RadioButton component
     */
    checked: boolean;
    onPress: (() => void) | undefined;
};

const RadioButtonIOS = (
    {
        disabled,
        style,
        color: colorProp,
        checked,
        onPress,
        uncheckedColor: uncheckedColorProp,
        ...rest
    }: Props,
    ref: any,
) => {
    const state = resolveStateVariant({
        disabled: !!disabled,
        checked,
    });
    radioButtonStyles.useVariants({
        state: state as any,
    });

    const { containerStyle, iconContainerStyle, iconStyle, rippleColor } = useMemo(() => {
        const _color = tokenStylesParser.getColor(checked ? colorProp : uncheckedColorProp);
        let _rippleColor: string | undefined;

        try {
            _rippleColor = setColor(_color).alpha(0.32).rgb().string();
        } catch (e) {
            _rippleColor = undefined;
        }

        return {
            containerStyle: [styles.container, radioButtonStyles.root, style],
            iconContainerStyle: { opacity: checked ? 1 : 0 },
            iconStyle: [radioButtonStyles.icon, _color],
            rippleColor: _rippleColor,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, colorProp, style, state, uncheckedColorProp]);

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
                    style={iconStyle}
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
