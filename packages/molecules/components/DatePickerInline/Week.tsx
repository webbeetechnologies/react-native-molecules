import { Fragment, memo } from 'react';
import { View, type ViewProps } from 'react-native';

import { type DisableWeekDaysType, showWeekDay } from './dateUtils';
import Day, { EmptyDay } from './Day';
import { datePickerWeekStyles } from './utils';

type Props = ViewProps & {
    weekIndex: number;
    generatedDays: {
        beforeWeekDay: boolean;
        afterWeekDay: boolean;
        year: number;
        month: number;
        dayOfMonth: number;
        dayIndex: number;
        mode: 'single' | 'range' | 'multiple';
        selected: boolean;
        inRange: boolean;
        leftCrop: boolean;
        rightCrop: boolean;
        isToday: boolean;
        disabled: boolean;
    }[];
    onPressDate: (date: Date) => any;
    disableWeekDays?: DisableWeekDaysType;
};

const Week = ({
    weekIndex,
    generatedDays,
    onPressDate,
    disableWeekDays,
    style,
    ...rest
}: Props) => {
    return (
        <View style={[datePickerWeekStyles.root, style]} {...rest}>
            {generatedDays
                .filter(gd => showWeekDay(gd.dayIndex, disableWeekDays))
                .map(gd => {
                    return (
                        <Fragment key={gd.dayIndex + weekIndex}>
                            {gd.beforeWeekDay || gd.afterWeekDay ? (
                                <EmptyDay />
                            ) : (
                                <Day
                                    day={gd.dayOfMonth}
                                    month={gd.month}
                                    year={gd.year}
                                    selected={gd.selected}
                                    inRange={gd.inRange}
                                    leftCrop={gd.leftCrop}
                                    rightCrop={gd.rightCrop}
                                    onPressDate={onPressDate}
                                    isToday={gd.isToday}
                                    disabled={gd.disabled}
                                />
                            )}
                        </Fragment>
                    );
                })}
        </View>
    );
};

export default memo(Week);
