import { setYear } from 'date-fns';
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { getYearRange, resolveStateVariant } from '../../utils';
import { datePickerMonthItemStyles, datePickerMonthPickerStyles } from '../DatePicker/utils';
import { HorizontalDivider } from '../HorizontalDivider';
import { Icon } from '../Icon';
import { ListItem } from '../ListItem';
import { Text } from '../Text';
import { useDatePickerStore } from './DatePickerContext';
import { datePickerYearItemStyles, datePickerYearPickerStyles } from './utils';

const GRID_ITEM_HEIGHT = 62;
const NUM_COLUMNS = 3;
const LIST_ITEM_HEIGHT = 46;

type YearPickerProps = {
    layout?: 'grid' | 'list';
};

export default function YearPicker({ layout = 'grid' }: YearPickerProps) {
    if (layout === 'list') return <YearPickerList />;
    return <YearPickerGrid />;
}

function YearPickerGrid() {
    const [{ startDateYear, endDateYear, localDate, pickerType }, setStore] = useDatePickerStore(
        state => state,
    );
    const years = useMemo(
        () => getYearRange(startDateYear, endDateYear),
        [startDateYear, endDateYear],
    );
    const rows = useMemo(() => {
        const chunks: number[][] = [];
        for (let i = 0; i < years.length; i += NUM_COLUMNS) {
            chunks.push(years.slice(i, i + NUM_COLUMNS));
        }
        return chunks;
    }, [years]);
    const selectingYear = pickerType === 'year';
    const selectedYear = localDate.getFullYear();
    const scrollRef = useRef<ScrollView | null>(null);

    const initialScrollOffset = useMemo(() => {
        if (years.length === 0) return 0;
        const totalRows = Math.ceil(years.length / NUM_COLUMNS);
        const unclampedRow = Math.floor((selectedYear - years[0]) / NUM_COLUMNS);
        const rowIndex = Math.min(Math.max(0, unclampedRow), Math.max(0, totalRows - 1));
        return rowIndex * GRID_ITEM_HEIGHT;
    }, [selectedYear, years]);

    useLayoutEffect(() => {
        if (!selectingYear) return;
        scrollRef.current?.scrollTo({ y: initialScrollOffset, animated: false });
    }, [selectingYear, initialScrollOffset]);

    const { containerStyle, yearStyle } = useMemo(() => {
        const { backgroundColor, ...rest } = datePickerYearPickerStyles.root;
        return {
            containerStyle: [
                StyleSheet.absoluteFill,
                gridStyles.root,
                { backgroundColor },
                datePickerYearPickerStyles.yearContainer,
                selectingYear ? gridStyles.opacity1 : gridStyles.opacity0,
            ],
            yearStyle: rest,
        };
    }, [selectingYear]);

    const handleOnChange = useCallback(
        (year: number) => {
            setStore(prev => ({
                localDate: setYear(prev.localDate, year),
                pickerType: undefined,
            }));
        },
        [setStore],
    );

    return (
        <View style={containerStyle} pointerEvents={selectingYear ? 'auto' : 'none'}>
            <HorizontalDivider />
            <ScrollView
                ref={scrollRef}
                style={gridStyles.list}
                contentOffset={{ x: 0, y: initialScrollOffset }}
                removeClippedSubviews>
                <View style={gridStyles.grid}>
                    {rows.map((row, rowIdx) => (
                        <View key={rowIdx} style={gridStyles.row}>
                            {row.map(year => (
                                <View key={year} style={gridStyles.cell}>
                                    <YearPill
                                        year={year}
                                        selected={selectedYear === year}
                                        onPressYear={handleOnChange}
                                        yearStyles={yearStyle}
                                    />
                                </View>
                            ))}
                            {row.length < NUM_COLUMNS &&
                                Array.from({ length: NUM_COLUMNS - row.length }).map((_, i) => (
                                    <View key={`pad-${i}`} style={gridStyles.cell} />
                                ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function YearPillPure({
    year,
    selected,
    onPressYear,
    yearStyles,
}: {
    year: number;
    selected: boolean;
    onPressYear: (newYear: number) => any;
    yearStyles: Record<string, any>;
}) {
    datePickerYearItemStyles.useVariants({
        state: resolveStateVariant({ selected }) as any,
    });

    const handlePressYear = useCallback(() => {
        onPressYear(year);
    }, [year, onPressYear]);

    return (
        <ListItem
            contentStyle={datePickerYearItemStyles.content}
            onPress={handlePressYear}
            accessibilityRole="button"
            accessibilityLabel={String(year)}
            style={[yearStyles, datePickerYearItemStyles.yearButton]}
            testID={`pick-year-${year}`}>
            <ListItem.Title style={datePickerYearItemStyles.yearLabel} selectable={false}>
                {year}
            </ListItem.Title>
        </ListItem>
    );
}
const YearPill = memo(YearPillPure);

function YearPickerList() {
    const [{ startDateYear, endDateYear, localDate, pickerType }, setStore] = useDatePickerStore(
        state => state,
    );
    const flatList = useRef<FlatList<number> | null>(null);
    const years = useMemo(
        () => getYearRange(startDateYear, endDateYear),
        [startDateYear, endDateYear],
    );
    const selectingYear = pickerType === 'year';
    const selectedYear = localDate.getFullYear();

    const initialScrollIndex = useMemo(() => {
        if (years.length === 0) return 0;
        const idx = years.indexOf(selectedYear);
        return Math.max(0, idx);
    }, [selectedYear, years]);

    const handleOnChange = useCallback(
        (year: number) => {
            setStore(prev => ({
                localDate: setYear(prev.localDate, year),
                pickerType: undefined,
            }));
        },
        [setStore],
    );

    const renderItem = useCallback(
        ({ item }: { item: number }) => (
            <YearRow year={item} selected={selectedYear === item} onPressYear={handleOnChange} />
        ),
        [selectedYear, handleOnChange],
    );

    const getItemLayout = useCallback(
        (_data: any, index: number) => ({
            length: LIST_ITEM_HEIGHT,
            offset: LIST_ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    if (!selectingYear) return null;

    return (
        <View style={[StyleSheet.absoluteFill, listStyles.root]} pointerEvents="auto">
            <HorizontalDivider />
            <FlatList<number>
                ref={flatList}
                style={listStyles.list}
                data={years}
                renderItem={renderItem}
                keyExtractor={item => `${item}`}
                initialScrollIndex={initialScrollIndex}
                getItemLayout={getItemLayout}
            />
        </View>
    );
}

function YearRowPure({
    year,
    selected,
    onPressYear,
}: {
    year: number;
    selected: boolean;
    onPressYear: (newYear: number) => any;
}) {
    datePickerMonthItemStyles.useVariants({
        state: resolveStateVariant({ selected }) as any,
    });

    const handlePressYear = useCallback(() => {
        onPressYear(year);
    }, [year, onPressYear]);

    return (
        <ListItem
            onPress={handlePressYear}
            accessibilityRole="button"
            accessibilityLabel={String(year)}
            accessibilityState={{ selected }}
            style={datePickerMonthItemStyles.monthButton}
            testID={`pick-year-${year}`}
            left={
                selected ? (
                    <View style={listStyles.checkIconView}>
                        <Icon name="check" size={24} />
                    </View>
                ) : (
                    <View style={listStyles.spacer} />
                )
            }>
            <View style={datePickerMonthItemStyles.monthInner}>
                <Text style={datePickerMonthItemStyles.monthLabel} selectable={false}>
                    {year}
                </Text>
            </View>
        </ListItem>
    );
}
const YearRow = memo(YearRowPure);

const gridStyles = StyleSheet.create({
    root: {
        flex: 1,
        top: 56,
        zIndex: 100,
    },
    list: { flex: 1 },
    grid: { alignItems: 'center' },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'stretch',
        gap: 12,
    },
    cell: {
        flex: 1,
        maxWidth: 110,
        minWidth: 90,
        height: GRID_ITEM_HEIGHT,
        justifyContent: 'center',
    },
    opacity0: { opacity: 0 },
    opacity1: { opacity: 1 },
});

const listStyles = StyleSheet.create({
    root: {
        flex: 1,
        top: 56,
        zIndex: 100,
        backgroundColor: datePickerMonthPickerStyles.root.backgroundColor,
    },
    list: { flex: 1 },
    checkIconView: { marginLeft: 16 },
    spacer: { width: 44 },
});
