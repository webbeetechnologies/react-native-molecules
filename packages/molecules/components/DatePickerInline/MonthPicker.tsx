import { setMonth } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, type FlatListProps, View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { resolveStateVariant } from '../../utils';
import { range } from '../../utils/dateTimePicker';
import type { DatePickerLocale } from '../DatePicker/context';
import { datePickerMonthItemStyles, datePickerMonthPickerStyles } from '../DatePicker/utils';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import { List, type ListContentProcessPropsArgs, useListContextValue } from '../List';
import { Text } from '../Text';
import { useDatePickerInlineStore, useDatePickerInlineStoreValue } from './store';

type MonthListItem = { id: number; label: string };

export default function MonthPicker({ locale }: { locale?: DatePickerLocale }) {
    const [_, setStore] = useDatePickerInlineStore(state => state);
    const { localDate, selectingMonth } = useDatePickerInlineStoreValue(state => ({
        localDate: state.localDate,
        selectingMonth: state.pickerType === 'month',
    }));
    const months = range(0, 11);
    const monthItems = useMemo<MonthListItem[]>(
        () => months.map(month => ({ id: month, label: String(month) })),
        [months],
    );

    const handleOnChange = useCallback(
        (month: number | null) => {
            if (month === null) return;
            setStore(prev => ({
                localDate: setMonth(prev.localDate, month),
                pickerType: undefined,
            }));
        },
        [setStore],
    );

    const processFlatListProps = useCallback(
        ({
            props,
            items,
        }: ListContentProcessPropsArgs<
            MonthListItem,
            Omit<FlatListProps<MonthListItem>, 'children' | 'ref'>
        >): FlatListProps<MonthListItem> => ({
            ...props,
            data: items,
            renderItem: ({ item }) => (
                <Month
                    month={item.id}
                    monthStyles={datePickerMonthPickerStyles.root}
                    locale={locale}
                />
            ),
            keyExtractor: item => `${item.id}`,
        }),
        [locale],
    );

    if (!selectingMonth) {
        return null;
    }

    return (
        <List
            items={monthItems}
            multiple={false}
            value={localDate.getMonth()}
            onChange={handleOnChange}>
            <View
                style={[
                    StyleSheet.absoluteFill,
                    styles.root,
                    selectingMonth ? styles.opacity1 : styles.opacity0,
                ]}
                pointerEvents={selectingMonth ? 'auto' : 'none'}>
                <Divider />
                <List.Content<MonthListItem, typeof FlatList<MonthListItem>>
                    ContainerComponent={FlatList<MonthListItem>}
                    style={styles.list}
                    processProps={processFlatListProps}
                />
            </View>
        </List>
    );
}

function MonthPure({
    month,
    monthStyles,
    locale,
}: {
    month: number;
    monthStyles: ViewStyle;
    locale?: DatePickerLocale;
}) {
    const isSelected = useListContextValue(state => {
        const selectedValue = state.value as any;
        return (selectedValue?.id ?? selectedValue) === month;
    });

    const state = resolveStateVariant({
        selected: isSelected,
    });

    datePickerMonthItemStyles.useVariants({
        state: state as any,
    });

    const { monthButtonStyle, accessibilityState } = useMemo(() => {
        const { monthButton } = datePickerMonthItemStyles;

        return {
            monthButtonStyle: [monthButton, monthStyles],
            accessibilityState: { selected: isSelected },
        };
    }, [isSelected, monthStyles]);

    const monthLabel = useMemo(
        () => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, month, 1)),
        [locale, month],
    );

    return (
        <List.Item
            value={month}
            accessibilityRole="button"
            accessibilityLabel={String(month)}
            accessibilityState={accessibilityState}
            style={monthButtonStyle}
            testID={`pick-month-${month}`}
            left={
                isSelected ? (
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
        </List.Item>
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
