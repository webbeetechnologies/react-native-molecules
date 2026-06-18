import { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { tokenStylesParser } from '../../utils/tokenStylesParser';
import { Icon } from '../Icon';
import { TouchableRipple } from '../TouchableRipple';
import type { RadioBaseProps } from './types';
import { iconSizeMap, radioStyles } from './utils';

const RadioBaseIOS = (
    {
        disabled = false,
        size = 'md',
        style,
        color: colorProp,
        checked,
        onPress,
        uncheckedColor: uncheckedColorProp,
        testID,
        ...rest
    }: RadioBaseProps,
    ref: any,
) => {
    const state = resolveStateVariant({
        disabled,
        checked,
    });

    radioStyles.useVariants({
        state: state as any,
        size: size as any,
    });

    const { containerStyle, iconContainerStyle, iconStyle } = useMemo(() => {
        const _color = tokenStylesParser.getColor(checked ? colorProp : uncheckedColorProp);

        return {
            containerStyle: [radioStyles.container, radioStyles.root, style],
            iconContainerStyle: { opacity: checked ? 1 : 0 },
            iconStyle: [radioStyles.icon, _color],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, colorProp, style, state, size, uncheckedColorProp]);

    return (
        <TouchableRipple
            {...rest}
            ref={ref}
            onPress={onPress}
            disabled={disabled}
            borderless
            style={containerStyle}
            testID={testID}>
            <View style={iconContainerStyle}>
                <Icon
                    allowFontScaling={false}
                    name="check"
                    size={iconSizeMap[size]}
                    style={iconStyle}
                />
            </View>
        </TouchableRipple>
    );
};

RadioBaseIOS.displayName = 'Radio_Base';

export default memo(forwardRef(RadioBaseIOS));
