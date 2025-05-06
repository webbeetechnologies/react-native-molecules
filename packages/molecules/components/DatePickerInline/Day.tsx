import { memo, useCallback, useMemo } from 'react';
import { StyleProp, View, type ViewStyle } from 'react-native';
import { Text } from '../Text';

import DayRange from './DayRange';
import { resolveStateVariant } from '../../utils';
import { datePickerDayEmptyStyles, datePickerDayStyles } from './utils';
import { TouchableRipple } from '../TouchableRipple';

function EmptyDayPure() {
    return <View style={datePickerDayEmptyStyles.root} />;
}
export const EmptyDay = memo(EmptyDayPure);

// TODO hover state
function Day(props: {
    day: number;
    month: number;
    year: number;
    selected: boolean;
    inRange: boolean;
    leftCrop: boolean;
    rightCrop: boolean;
    isToday: boolean;
    disabled: boolean;
    onPressDate: (date: Date) => any;
}) {
    const {
        day,
        month,
        year,
        selected,
        inRange,
        leftCrop,
        rightCrop,
        onPressDate,
        isToday,
        disabled,
    } = props;
    const state = resolveStateVariant({
        disabled,
        selected,
        inRange,
        today: isToday,
    });
    datePickerDayStyles.useVariants({
        state: state as any,
    });

    const onPress = useCallback(() => {
        onPressDate(new Date(year, month, day));
    }, [onPressDate, year, month, day]);

    const { containerStyle, buttonStyle, dayStyle, textStyle } = useMemo(() => {
        return {
            containerStyle: datePickerDayStyles.containerStyle,
            buttonStyle: datePickerDayStyles.button,
            dayStyle: [
                datePickerDayStyles.day,
                isToday ? datePickerDayStyles.today : null,
            ] as StyleProp<ViewStyle>,
            textStyle: datePickerDayStyles.text,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isToday, state]);

    return (
        <View style={containerStyle}>
            <DayRange inRange={inRange} leftCrop={leftCrop} rightCrop={rightCrop} />

            <TouchableRipple
                testID={`day-${year}-${month}-${day}`}
                disabled={disabled}
                borderless={true}
                onPress={disabled ? undefined : onPress}
                style={buttonStyle}
                accessibilityRole="button">
                <View style={dayStyle}>
                    <Text style={textStyle} selectable={false}>
                        {day}
                    </Text>
                </View>
            </TouchableRipple>
        </View>
    );
}

export default memo(Day);
