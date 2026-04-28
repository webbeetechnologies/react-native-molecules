import { memo, useMemo } from 'react';
import { View } from 'react-native';

import { addDays, startOfWeek } from '../../utils/date-fns';
import type { DatePickerLocale } from '../DatePicker/context';
import { type DisableWeekDaysType, showWeekDay } from './dateUtils';
import DayName from './DayName';
import { dateDayNameStyles } from './utils';

function DayNames({
    disableWeekDays,
    locale,
}: {
    disableWeekDays?: DisableWeekDaysType;
    locale?: DatePickerLocale;
}) {
    const shortDayNames = useMemo(() => {
        const firstDOW = startOfWeek(new Date());
        return Array.from(Array(7)).map((_, i) =>
            new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(addDays(firstDOW, i)),
        );
    }, [locale]);

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
