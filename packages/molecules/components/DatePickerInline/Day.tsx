import { memo, useCallback, useMemo } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useActionState } from '../../hooks/useActionState';
import { resolveStateVariant } from '../../utils';
import { StateLayer } from '../StateLayer';
import { Text } from '../Text';
import { TouchableRipple } from '../TouchableRipple';
import DayRange from './DayRange';
import {
    datePickerDayEmptyStyles,
    datePickerDayStateLayerStyles,
    datePickerDayStyles,
} from './utils';

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
    outside?: boolean;
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
        outside,
    } = props;

    const { hovered, actionsRef } = useActionState({ actionsToListen: ['hover'] });

    const state = resolveStateVariant({
        disabled,
        selected,
        inRange,
        today: isToday,
        outside: !!outside,
    });
    datePickerDayStyles.useVariants({
        state: state as any,
    });

    datePickerDayStateLayerStyles.useVariants({
        state: resolveStateVariant({
            hovered: hovered,
            outsideAndHovered: !!outside && !selected && !inRange && hovered,
            selectedAndHovered: selected && hovered,
            inRangeAndHovered: inRange && hovered,
            todayAndHovered: isToday && hovered,
        }) as any,
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
                ref={actionsRef}
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
                <StateLayer style={datePickerDayStateLayerStyles.stateLayer} />
            </TouchableRipple>
        </View>
    );
}

export default memo(Day);
