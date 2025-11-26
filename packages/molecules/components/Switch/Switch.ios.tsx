import { forwardRef, memo } from 'react';
import {
    Switch as NativeSwitch,
    type SwitchProps,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

import { useControlledValue } from '../../hooks';
import type { IconType } from '../Icon';

export type Props = SwitchProps & {
    checkedIcon?: string;
    unCheckedIcon?: string;
    size?: number;
    checkedIconType?: IconType;
    uncheckedIconType?: IconType;
    thumbStyle?: ViewStyle;
    thumbContainerStyle?: ViewStyle;
    switchOverlayStyle?: ViewStyle;
    iconStyle?: TextStyle;
};

const Switch = (
    {
        trackColor,
        thumbColor,
        onValueChange,
        disabled,
        value: valueProp,
        // Accept but ignore these props for API compatibility
        checkedIcon: _checkedIcon,
        unCheckedIcon: _unCheckedIcon,
        size: _size,
        checkedIconType: _checkedIconType,
        uncheckedIconType: _uncheckedIconType,
        thumbStyle: _thumbStyle,
        thumbContainerStyle: _thumbContainerStyle,
        switchOverlayStyle: _switchOverlayStyle,
        iconStyle: _iconStyle,
        style,
        ...rest
    }: Props,
    ref: any,
) => {
    const [value, onChange] = useControlledValue({
        value: valueProp,
        onChange: onValueChange as any,
        defaultValue: !!valueProp,
        disabled,
    });

    return (
        <NativeSwitch
            ref={ref}
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            trackColor={trackColor}
            thumbColor={thumbColor}
            style={style}
            {...rest}
        />
    );
};

export default memo(forwardRef(Switch));
