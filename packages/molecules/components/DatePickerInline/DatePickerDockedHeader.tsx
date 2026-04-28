import { add, setYear } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { DatePickerLocale } from '../DatePicker/context';
import { useDatePickerStoreRef, useDatePickerStoreValue } from './DatePickerContext';
import type { DisableWeekDaysType } from './dateUtils';
import DayNames from './DayNames';
import HeaderItem from './HeaderItem';
import { datePickerHeaderStyles } from './utils';

export type DockedHeaderProps = {
    locale?: DatePickerLocale;
    scrollMode: 'horizontal' | 'vertical';
    disableWeekDays?: DisableWeekDaysType;
    style?: ViewStyle;
};

function DatePickerDockedHeader({
    locale = 'en',
    scrollMode,
    disableWeekDays,
    style: styleProp,
}: DockedHeaderProps) {
    const setStore = useDatePickerStoreRef().set;
    const { localDate, pickerType } = useDatePickerStoreValue(state => ({
        localDate: state.localDate,
        pickerType: state.pickerType,
    }));
    const isHorizontal = scrollMode === 'horizontal';

    const { monthName, year } = useMemo(
        () => ({
            monthName: new Intl.DateTimeFormat(locale, { month: 'short' }).format(localDate),
            year: localDate.getFullYear(),
        }),
        [localDate, locale],
    );

    const handleMonthDropdown = useCallback(() => {
        setStore(prev => ({ pickerType: prev.pickerType === 'month' ? undefined : 'month' }));
    }, [setStore]);

    const handleYearDropdown = useCallback(() => {
        setStore(prev => ({ pickerType: prev.pickerType === 'year' ? undefined : 'year' }));
    }, [setStore]);

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

    const pickerOpen = pickerType === 'month' || pickerType === 'year';

    return (
        <View pointerEvents="box-none">
            {isHorizontal && (
                <View
                    style={[
                        datePickerHeaderStyles.datePickerHeader,
                        styles.row,
                        pickerOpen && styles.rowPickerOpen,
                        styleProp,
                    ]}>
                    <HeaderItem
                        onPrev={handleMonthPrev}
                        onNext={handleMonthNext}
                        onPressDropdown={handleMonthDropdown}
                        type="month"
                        value={monthName}
                        pickerType={pickerType}
                        selecting={pickerType === 'month'}
                    />
                    <HeaderItem
                        onPrev={handleYearPrev}
                        onNext={handleYearNext}
                        onPressDropdown={handleYearDropdown}
                        type="year"
                        value={year}
                        pickerType={pickerType}
                        selecting={pickerType === 'year'}
                    />
                </View>
            )}
            <DayNames disableWeekDays={disableWeekDays} locale={locale} />
        </View>
    );
}

const styles = StyleSheet.create(theme => ({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowPickerOpen: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.outlineVariant,
    },
}));

export default memo(DatePickerDockedHeader);
