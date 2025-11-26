import { memo } from 'react';
import { View } from 'react-native';

import { addDays, format, startOfWeek } from '../../utils/date-fns';
import { type DisableWeekDaysType, showWeekDay } from './dateUtils';
import DayName from './DayName';
import { dateDayNameStyles } from './utils';

const shortDayNames = (() => {
    const firstDOW = startOfWeek(new Date());
    return Array.from(Array(7)).map((_, i) => format(addDays(firstDOW, i), 'EEEEE'));
})();

function DayNames({
    disableWeekDays,
}: // locale,
{
    disableWeekDays?: DisableWeekDaysType;
    locale?: string;
}) {
    return (
        <View style={dateDayNameStyles.container} pointerEvents={'none'}>
            {shortDayNames
                .filter((_, dayIndex) => showWeekDay(dayIndex, disableWeekDays))
                .map((dayName, i) => (
                    <DayName key={`${dayName}_${i}`} label={dayName} />
                ))}
        </View>
    );
}

export default memo(DayNames);
