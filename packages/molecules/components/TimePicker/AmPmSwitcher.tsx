import { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import { TouchableRipple } from '../TouchableRipple';
import { DisplayModeContext } from './DisplayModeContext';
import { timePickerAmPmSwitcherStyles } from './utils';

export default function AmPmSwitcher({
    onChange,
    hours,
}: {
    hours: number;
    onChange: (newHours: number) => any;
}) {
    const { setMode, mode } = useContext(DisplayModeContext);

    const { containerStyle, switchSeparatorStyle, isAM } = useMemo(() => {
        return {
            containerStyle: timePickerAmPmSwitcherStyles.container,
            switchSeparatorStyle: timePickerAmPmSwitcherStyles.switchSeparator,
            isAM: mode === 'AM',
        };
    }, [mode]);

    const onSwitchButtonPress = useCallback(
        (period: 'AM' | 'PM') => {
            setMode(period);

            if (period === 'AM' && hours - 12 >= 0) {
                onChange(hours - 12);
                return;
            }

            if (period === 'PM' && hours + 12 <= 23) {
                onChange(hours + 12);
            }
        },
        [hours, onChange, setMode],
    );

    return (
        <View style={containerStyle}>
            <SwitchButton
                label="AM"
                onPress={() => onSwitchButtonPress('AM')}
                selected={isAM}
                disabled={isAM}
            />
            <View style={switchSeparatorStyle} />
            <SwitchButton
                label="PM"
                onPress={() => onSwitchButtonPress('PM')}
                selected={!isAM}
                disabled={!isAM}
            />
        </View>
    );
}

function SwitchButton({
    label,
    onPress,
    selected,
    disabled,
}: {
    label: string;
    onPress: (() => any) | undefined;
    selected: boolean;
    disabled: boolean;
}) {
    timePickerAmPmSwitcherStyles.useVariants({
        // @ts-ignore // TODO - fix this
        state: resolveStateVariant({
            selected,
        }),
    });

    return (
        <TouchableRipple
            onPress={onPress}
            style={timePickerAmPmSwitcherStyles.switchButton}
            accessibilityLabel={label}
            // @ts-ignore old React Native versions
            accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
            // @ts-ignore old React Native versions
            accessibilityComponentType="button"
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}>
            <View style={timePickerAmPmSwitcherStyles.switchButtonInner}>
                <Text selectable={false} style={timePickerAmPmSwitcherStyles.text}>
                    {label}
                </Text>
            </View>
        </TouchableRipple>
    );
}
