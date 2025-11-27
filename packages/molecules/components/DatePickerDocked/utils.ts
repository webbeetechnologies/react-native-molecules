import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const datePickerDockedStylesDefault = StyleSheet.create(theme => ({
    root: {
        roundness: theme.shapes.corner.extraSmall,
        headerBackgroundColor: theme.colors.surface,
    } as any,

    container: {
        minHeight: 360,
        minWidth: 360,
    },
}));

const datePickerDockedHeaderStylesDefault = StyleSheet.create(theme => ({
    datePickerHeader: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    daysWrapperStyle: {
        marginHorizontal: theme.spacings['3'],
    },
}));

const datePickerHeaderItemStylesDefault = StyleSheet.create(theme => ({
    buttonContainer: {
        height: 46,
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonWrapper: {},
    spacer: { flex: 1 },
    labelStyle: {
        ...theme.typescale.bodyMedium,
        opacity: 0.7,
    },
    buttonStyle: {
        alignSelf: 'center',
        borderRadius: theme.shapes.corner.extraSmall,
    },
    innerStyle: {
        paddingLeft: theme.spacings['0'],
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.extraSmall,
    },
    emtpyView: {
        width: 30,
    },
}));

const datePickerMonthPickerStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
    },
    month: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    selectedMonth: { color: theme.colors.onSurface },
    monthButton: {
        width: '100%',
        overflow: 'hidden',
    },
    monthInner: {
        height: 46,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    selectedMonthInner: { backgroundColor: theme.colors.surfaceVariant },
    monthLabel: {
        fontSize: 16,
    },
}));

const datePickerDockedMonthItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
    },

    monthButton: {
        width: '100%',
        overflow: 'hidden',
        padding: theme.spacings['0'],

        variants: {
            state: {
                selected: {
                    backgroundColor: theme.colors.surfaceVariant,
                },
            },
        },
    },
    monthInner: {
        height: 46,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: theme.spacings['0'],
    },
    monthLabel: {
        fontSize: 16,

        variants: {
            state: {
                selected: {
                    color: theme.colors.onSurface,
                },
            },
        },
    },
}));

const datePickerDockedMonthStylesDefault = StyleSheet.create(theme => ({
    dockedHeaderStyle: {
        alignItems: 'flex-start',
        marginLeft: theme.spacings['4'],
    },
    weekContainerStyle: {
        marginHorizontal: theme.spacings['3'],
    },
    backDropStyle: {
        backgroundColor: 'transparent',
    },
}));

registerComponentsStyles({
    DatePickerDocked: datePickerDockedStylesDefault,
    DatePickerDocked_Header: datePickerDockedHeaderStylesDefault,
    DatePicker_HeaderItem: datePickerHeaderItemStylesDefault,
    DatePickerDocked_MonthPicker: datePickerMonthPickerStylesDefault,
    DatePickerDocked_MonthItem: datePickerDockedMonthItemStylesDefault,
    DatePickerDocked_Month: datePickerDockedMonthStylesDefault,
});

export const datePickerDockedStyles = getRegisteredMoleculesComponentStyles('DatePickerDocked');
export const datePickerDockedHeaderStyles =
    getRegisteredMoleculesComponentStyles('DatePickerDocked_Header');
export const datePickerHeaderItemStyles =
    getRegisteredMoleculesComponentStyles('DatePicker_HeaderItem');
export const datePickerMonthPickerStyles = getRegisteredMoleculesComponentStyles(
    'DatePickerDocked_MonthPicker',
);
export const datePickerDockedMonthItemStyles = getRegisteredMoleculesComponentStyles(
    'DatePickerDocked_MonthItem',
);
export const datePickerDockedMonthStyles =
    getRegisteredMoleculesComponentStyles('DatePickerDocked_Month');
