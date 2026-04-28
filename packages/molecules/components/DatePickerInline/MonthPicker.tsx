import { setMonth } from 'date-fns';
import { memo, useCallback, useMemo, useRef } from 'react';
import { FlatList, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { resolveStateVariant } from '../../utils';
import { range } from '../../utils/dateTimePicker';
import type { DatePickerLocale } from '../DatePicker/context';
import { datePickerMonthItemStyles, datePickerMonthPickerStyles } from '../DatePicker/utils';
import { HorizontalDivider } from '../HorizontalDivider';
import { Icon } from '../Icon';
import { ListItem } from '../ListItem/';
import { Text } from '../Text';
import { useDatePickerStore, useDatePickerStoreValue } from './DatePickerContext';

export default function MonthPicker({ locale }: { locale?: DatePickerLocale }) {
    const [_, setStore] = useDatePickerStore(state => state);
    const { localDate, selectingMonth } = useDatePickerStoreValue(state => ({
        localDate: state.localDate,
        selectingMonth: state.pickerType === 'month',
    }));
    // const monthPickerStyles = useComponentStyles('DatePickerDocked_MonthPicker');
    const flatList = useRef<FlatList<number> | null>(null);
    const months = range(0, 11);

    const handleOnChange = useCallback(
        (month: number) => {
            setStore(prev => ({
                localDate: setMonth(prev.localDate, month),
                pickerType: undefined,
            }));
        },
        [setStore],
    );

    const renderItem = useCallback(
        ({ item }: { item: number }) => {
            return (
                <Month
                    month={item}
                    selected={localDate.getMonth() === item}
                    onPressMonth={handleOnChange}
                    monthStyles={datePickerMonthPickerStyles.root}
                    locale={locale}
                />
            );
        },
        [localDate, handleOnChange, locale],
    );

    if (!selectingMonth) {
        return null;
    }

    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                styles.root,
                // { backgroundColor },
                selectingMonth ? styles.opacity1 : styles.opacity0,
            ]}
            pointerEvents={selectingMonth ? 'auto' : 'none'}>
            <HorizontalDivider />
            <FlatList<number>
                ref={flatList}
                style={styles.list}
                data={months}
                renderItem={renderItem}
                keyExtractor={item => `${item}`}
            />
        </View>
    );
}

function MonthPure({
    month,
    selected,
    onPressMonth,
    monthStyles,
    locale,
}: {
    month: number;
    selected: boolean;
    onPressMonth: (newMonth: number) => any;
    monthStyles: ViewStyle;
    locale?: DatePickerLocale;
}) {
    const state = resolveStateVariant({
        selected,
    });

    datePickerMonthItemStyles.useVariants({
        state: state as any,
    });

    const { monthButtonStyle, accessibilityState } = useMemo(() => {
        const { monthButton } = datePickerMonthItemStyles;

        return {
            monthButtonStyle: [monthButton, monthStyles],
            accessibilityState: { selected },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected, monthStyles, state]);

    const monthLabel = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, month, 1)),
        [locale, month],
    );

    const handleMonthPress = useCallback(() => {
        onPressMonth(month);
    }, [onPressMonth, month]);

    return (
        <ListItem
            onPress={handleMonthPress}
            accessibilityRole="button"
            accessibilityLabel={String(month)}
            accessibilityState={accessibilityState}
            style={monthButtonStyle}
            testID={`pick-month-${month}`}
            left={
                selected ? (
                    <View style={styles.checkIconView}>
                        <Icon name="check" size={24} />
                    </View>
                ) : (
                    <View style={styles.spacer} />
                )
            }>
            <View style={datePickerMonthItemStyles.monthInner}>
                <Text style={datePickerMonthItemStyles.monthLabel} selectable={false}>
                    {monthLabel}
                </Text>
            </View>
        </ListItem>
    );
}
const Month = memo(MonthPure);

const styles = StyleSheet.create(theme => ({
    root: {
        flex: 1,
        top: 56,
        zIndex: 100,
    },

    checkIconView: {
        marginLeft: theme.spacings['4'],
    },

    spacer: {
        width: 44,
    },

    list: {
        flex: 1,
    },
    opacity0: {
        opacity: 0,
    },
    opacity1: {
        opacity: 1,
    },
}));
