import { add, setYear } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import type { DatePickerLocale } from '../DatePicker/context';
import type { DisableWeekDaysType } from './dateUtils';
import DayNames from './DayNames';
import HeaderItem from './HeaderItem';
import { useDatePickerInlineStore, useDatePickerInlineStoreValue } from './store';
import { datePickerHeaderStyles, dayNamesHeight } from './utils';

const buttonContainerHeight = 56;
const buttonContainerMarginTop = 4;
const buttonContainerMarginBottom = 8;

export type CalendarHeaderProps = {
    locale?: DatePickerLocale;
    scrollMode: 'horizontal' | 'vertical';
    disableWeekDays?: DisableWeekDaysType;
    style?: ViewStyle;
};

function DatePickerInlineHeader({
    locale = 'en',
    scrollMode,
    disableWeekDays,
    style: styleProp,
}: CalendarHeaderProps) {
    const [_, setStore] = useDatePickerInlineStore(state => state);
    const { localDate, pickerType } = useDatePickerInlineStoreValue(state => ({
        localDate: state.localDate,
        pickerType: state.pickerType,
    }));
    const isHorizontal = scrollMode === 'horizontal';

    const { monthName, year } = useMemo(() => {
        const y = localDate.getFullYear();

        return {
            monthName: new Intl.DateTimeFormat(locale, { month: 'long' }).format(localDate),
            year: y,
        };
    }, [localDate, locale]);

    const { containerStyle } = useMemo(() => {
        // const { datePickerHeader, buttonContainer, buttonWrapper, spacer, ...rest } =
        //     componentStyles;

        return {
            containerStyle: [
                datePickerHeaderStyles.datePickerHeader,
                datePickerHeaderStyles,
                styleProp,
            ] as StyleProp<ViewStyle>,
            buttonContainerStyle: datePickerHeaderStyles.buttonContainer,
            buttonWrapperStyle: datePickerHeaderStyles.buttonWrapper,
            spacerStyle: datePickerHeaderStyles.spacer,
        };
    }, [styleProp]);

    const handleOnMonthPress = useCallback(() => {
        isHorizontal &&
            setStore(prev => ({
                pickerType: prev.pickerType === 'month' ? undefined : 'month',
            }));
    }, [isHorizontal, setStore]);

    const handleOnYearPress = useCallback(() => {
        isHorizontal &&
            setStore(prev => ({
                pickerType: prev.pickerType === 'year' ? undefined : 'year',
            }));
    }, [isHorizontal, setStore]);

    const handleMonthPrev = useCallback(() => {
        setStore(prev => ({ localDate: add(prev.localDate, { months: -1 }) }));
    }, [setStore]);

    const handleMonthNext = useCallback(() => {
        setStore(prev => ({ localDate: add(prev.localDate, { months: 1 }) }));
    }, [setStore]);

    const handleYearPrev = useCallback(() => {
        setStore(prev => ({
            localDate: setYear(prev.localDate, prev.localDate.getFullYear() - 1),
        }));
    }, [setStore]);

    const handleYearNext = useCallback(() => {
        setStore(prev => ({
            localDate: setYear(prev.localDate, prev.localDate.getFullYear() + 1),
        }));
    }, [setStore]);

    return (
        <View pointerEvents={'box-none'}>
            <>
                {isHorizontal && (
                    <View style={containerStyle}>
                        <HeaderItem
                            onPrev={handleMonthPrev}
                            onNext={handleMonthNext}
                            onPressDropdown={handleOnMonthPress}
                            type="month"
                            value={monthName}
                            pickerType={pickerType}
                            selecting={pickerType === 'month'}
                        />
                        <HeaderItem
                            onNext={handleYearNext}
                            onPrev={handleYearPrev}
                            onPressDropdown={handleOnYearPress}
                            type="year"
                            selecting={pickerType === 'year'}
                            value={year}
                            pickerType={pickerType}
                        />
                    </View>
                )}
            </>
            <DayNames disableWeekDays={disableWeekDays} locale={locale} />
        </View>
    );
}

export function getCalendarHeaderHeight(scrollMode: 'horizontal' | 'vertical') {
    if (scrollMode === 'horizontal') {
        return (
            buttonContainerHeight +
            buttonContainerMarginTop +
            buttonContainerMarginBottom +
            dayNamesHeight
        );
    }
    return dayNamesHeight;
}

export default memo(DatePickerInlineHeader);
