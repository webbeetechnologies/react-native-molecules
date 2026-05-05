import { setYear } from 'date-fns';
import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { FlatList, type FlatListProps, StyleSheet, View } from 'react-native';

import { getYearRange, resolveStateVariant } from '../../utils';
import { datePickerMonthItemStyles, datePickerMonthPickerStyles } from '../DatePicker/utils';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import { List, type ListContentProcessPropsArgs, useListContextValue } from '../List';
import { Text } from '../Text';
import { useDatePickerInlineStore } from './store';
import { datePickerYearItemStyles, datePickerYearPickerStyles } from './utils';

type YearListItem = { id: number; label: string };

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
    const [{ startDateYear, endDateYear, localDate, pickerType }, setStore] =
        useDatePickerInlineStore(state => state);
    const years = useMemo(
        () => getYearRange(startDateYear, endDateYear),
        [startDateYear, endDateYear],
    );
    const yearItems = useMemo(
        () => years.map(year => ({ id: year, label: String(year) })),
        [years],
    );
    const selectingYear = pickerType === 'year';
    const selectedYear = localDate.getFullYear();
    const flatListRef = useRef<FlatList<YearListItem> | null>(null);

    const initialScrollOffset = useMemo(() => {
        if (years.length === 0) return 0;
        const totalRows = Math.ceil(years.length / NUM_COLUMNS);
        const unclampedRow = Math.floor((selectedYear - years[0]) / NUM_COLUMNS);
        const rowIndex = Math.min(Math.max(0, unclampedRow), Math.max(0, totalRows - 1));
        return rowIndex * GRID_ITEM_HEIGHT;
    }, [selectedYear, years]);

    useLayoutEffect(() => {
        if (!selectingYear) return;
        flatListRef.current?.scrollToOffset({ offset: initialScrollOffset, animated: false });
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
        (year: number | null) => {
            if (year === null) return;
            setStore(prev => ({
                localDate: setYear(prev.localDate, year),
                pickerType: undefined,
            }));
        },
        [setStore],
    );

    const getRowLayout = useCallback(
        (_data: ArrayLike<YearListItem> | null | undefined, index: number) => ({
            length: GRID_ITEM_HEIGHT,
            offset: GRID_ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    const processGridFlatListProps = useCallback(
        ({
            props,
            items,
            isEmpty,
            emptyState,
        }: ListContentProcessPropsArgs<
            YearListItem,
            Omit<FlatListProps<YearListItem>, 'children' | 'ref'>
        >): FlatListProps<YearListItem> => ({
            ...props,
            data: items,
            numColumns: NUM_COLUMNS,
            contentContainerStyle: gridStyles.grid,
            columnWrapperStyle: gridStyles.row,
            renderItem: ({ item }) => (
                <View style={gridStyles.cell}>
                    <YearPill year={item.id} yearStyles={yearStyle} />
                </View>
            ),
            keyExtractor: item => `${item.id}`,
            getItemLayout: getRowLayout,
            initialScrollIndex: Math.floor(initialScrollOffset / GRID_ITEM_HEIGHT),
            removeClippedSubviews: true,
            ListEmptyComponent: isEmpty
                ? function GridListEmpty() {
                      return <>{emptyState}</>;
                  }
                : undefined,
        }),
        [getRowLayout, initialScrollOffset, yearStyle],
    );

    return (
        <List items={yearItems} multiple={false} value={selectedYear} onChange={handleOnChange}>
            <View style={containerStyle} pointerEvents={selectingYear ? 'auto' : 'none'}>
                <Divider />
                <List.Content<YearListItem, typeof FlatList<YearListItem>>
                    ref={flatListRef}
                    ContainerComponent={FlatList<YearListItem>}
                    style={gridStyles.list}
                    processProps={processGridFlatListProps}
                />
            </View>
        </List>
    );
}

function YearPillPure({ year, yearStyles }: { year: number; yearStyles: Record<string, any> }) {
    const isSelected = useListContextValue(state => {
        const selectedValue = state.value as any;
        return (selectedValue?.id ?? selectedValue) === year;
    });

    datePickerYearItemStyles.useVariants({
        state: resolveStateVariant({ selected: isSelected }) as any,
    });

    return (
        <List.Item
            value={year}
            contentStyle={datePickerYearItemStyles.content}
            accessibilityRole="button"
            accessibilityLabel={String(year)}
            style={[yearStyles, datePickerYearItemStyles.yearButton]}
            testID={`pick-year-${year}`}>
            <Text
                typescale="bodyLarge"
                style={datePickerYearItemStyles.yearLabel}
                selectable={false}>
                {year}
            </Text>
        </List.Item>
    );
}
const YearPill = memo(YearPillPure);

function YearPickerList() {
    const [{ startDateYear, endDateYear, localDate, pickerType }, setStore] =
        useDatePickerInlineStore(state => state);
    const years = useMemo(
        () => getYearRange(startDateYear, endDateYear),
        [startDateYear, endDateYear],
    );
    const yearItems = useMemo<YearListItem[]>(
        () => years.map(year => ({ id: year, label: String(year) })),
        [years],
    );
    const selectingYear = pickerType === 'year';
    const selectedYear = localDate.getFullYear();

    const initialScrollIndex = useMemo(() => {
        if (years.length === 0) return 0;
        const idx = years.indexOf(selectedYear);
        return Math.max(0, idx);
    }, [selectedYear, years]);

    const handleOnChange = useCallback(
        (year: number | null) => {
            if (year === null) return;
            setStore(prev => ({
                localDate: setYear(prev.localDate, year),
                pickerType: undefined,
            }));
        },
        [setStore],
    );

    const getItemLayout = useCallback(
        (_data: ArrayLike<YearListItem> | null | undefined, index: number) => ({
            length: LIST_ITEM_HEIGHT,
            offset: LIST_ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    const processFlatListProps = useCallback(
        ({
            props,
            items,
        }: ListContentProcessPropsArgs<
            YearListItem,
            Omit<FlatListProps<YearListItem>, 'children' | 'ref'>
        >): FlatListProps<YearListItem> => ({
            ...props,
            data: items,
            renderItem: ({ item }) => <YearRow year={item.id} />,
            keyExtractor: item => `${item.id}`,
            initialScrollIndex,
            getItemLayout,
        }),
        [getItemLayout, initialScrollIndex],
    );

    if (!selectingYear) return null;

    return (
        <List items={yearItems} multiple={false} value={selectedYear} onChange={handleOnChange}>
            <View style={[StyleSheet.absoluteFill, listStyles.root]} pointerEvents="auto">
                <Divider />
                <List.Content<YearListItem, typeof FlatList<YearListItem>>
                    ContainerComponent={FlatList<YearListItem>}
                    style={listStyles.list}
                    processProps={processFlatListProps}
                />
            </View>
        </List>
    );
}

function YearRowPure({ year }: { year: number }) {
    const isSelected = useListContextValue(state => {
        const selectedValue = state.value as any;
        return (selectedValue?.id ?? selectedValue) === year;
    });

    datePickerMonthItemStyles.useVariants({
        state: resolveStateVariant({ selected: isSelected }) as any,
    });

    return (
        <List.Item
            value={year}
            accessibilityRole="button"
            accessibilityLabel={String(year)}
            style={datePickerMonthItemStyles.monthButton}
            testID={`pick-year-${year}`}
            left={
                isSelected ? (
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
        </List.Item>
    );
}
const YearRow = memo(YearRowPure);

const gridStyles = StyleSheet.create({
    root: {
        flex: 1,
        top: 56,
        zIndex: 100,
    },
    list: {
        flex: 1,
        width: '100%',
    },
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
