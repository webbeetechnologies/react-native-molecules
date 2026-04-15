import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const datePickerModalStylesDefault = StyleSheet.create(theme => ({
    header: {
        // backgroundColor: theme.colors.surfaceContainerHighest,
    },
    content: {
        minWidth: 420,
        width: 420,
        maxWidth: undefined,
        flex: undefined,
        borderRadius: theme.shapes.corner.extraLarge,
        overflow: 'hidden',
    },
    frame: {
        // backgroundColor: theme.colors.surfaceContainerHighest,
        width: '100%',
    },
    headlineContainer: {
        // backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacings['5'],
        paddingTop: theme.spacings['5'],
        paddingBottom: theme.spacings['4'],
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerCopy: {
        flex: 1,
        minWidth: 0,
    },
    headline: {
        ...theme.typescale.labelLarge,
        color: theme.colors.onSurfaceVariant,
    },
    supporting: {
        fontSize: 44,
        lineHeight: 52,
        fontWeight: theme.typescale.displaySmall.fontWeight,
        color: theme.colors.onSurface,
        paddingTop: theme.spacings['2'],
        flexShrink: 1,
    },
    modeToggle: {
        color: theme.colors.onSurfaceVariant,
        marginLeft: theme.spacings['3'],
    },
    body: {
        // backgroundColor: theme.colors.surfaceContainerHighest,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.outlineVariant,
    },
    calendarContainer: {
        minHeight: 320,
        minWidth: undefined,
        // backgroundColor: theme.colors.surfaceContainerHighest,
    },
    calendarRoot: {
        // backgroundColor: theme.colors.surfaceContainerHighest,
    },
    inputContainer: {
        padding: theme.spacings['6'],
        paddingTop: theme.spacings['5'],
        paddingBottom: theme.spacings['4'],
    },
    footer: {
        // backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        columnGap: theme.spacings['2'],
        paddingHorizontal: theme.spacings['4'],
        paddingTop: theme.spacings['0'],
        paddingBottom: theme.spacings['2'],
    },
}));

const datePickerModalHeaderStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.onPrimary,
    },
    animated: {
        paddingBottom: theme.spacings['0'],
        elevation: 4,
    },
    safeContent: {
        paddingBottom: theme.spacings['0'],

        variants: {
            state: {
                disableSafeTop: {
                    paddingTop: 0,
                },
            },
        },
    },
    safeContentNoTop: {
        paddingTop: theme.spacings['0'],
    },
    appbarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacings['2'],
        paddingVertical: theme.spacings['2'],
        elevation: 0,
        backgroundColor: 'transparent',
    },
}));

const datePickerModalContentHeaderStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.onPrimary,
    },

    fill: {
        flex: 1,
    },
    header: {
        height: 75,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: theme.spacings['6'],
        paddingRight: theme.spacings['3'],
    },
    headerContentContainer: {
        marginTop: theme.spacings['1'],
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: theme.colors.onPrimary,
        letterSpacing: 1,
        fontSize: theme.typescale.bodyMedium.fontSize,
    },
    headerText: {
        fontSize: theme.typescale.bodyMedium.fontSize,
        color: theme.colors.onPrimary,
    },
    headerSeparator: {
        fontSize: theme.typescale.bodyMedium.fontSize,
        paddingLeft: theme.spacings['2'],
        paddingRight: theme.spacings['2'],
        color: theme.colors.onPrimary,
    },
    icon: {
        color: theme.colors.onPrimary,
    },
}));

const datePickerModalHeaderBackgroundStylesDefault = StyleSheet.create(theme => ({
    header: {
        backgroundColor: theme.colors.primary,
        paddingBottom: theme.spacings['0'],
        elevation: 4,
    },
    safeContent: {
        paddingBottom: theme.spacings['0'],
    },
}));

const datePickerModalEditStylesDefault = StyleSheet.create(theme => ({
    container: { padding: theme.spacings['3'] },
    inner: { flexDirection: 'row' },
    inputContainer: { flex: 1 },
    input: { flex: 1 },
    separator: { width: 12 },
}));

const datePickerPopoverHeaderStylesDefault = StyleSheet.create(theme => ({
    buttonContainer: {
        height: 46,
        // width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonWrapper: {},
    spacer: { flex: 1 },
    labelStyle: {
        ...theme.typescale.labelLarge,
        color: theme.colors.onSurfaceVariant,
        marginRight: theme.spacings['2'],
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

const datePickerPopoverMonthPickerStylesDefault = StyleSheet.create(theme => ({
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

const datePickerPopoverMonthItemStylesDefault = StyleSheet.create(theme => ({
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

export const datePickerModalStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerModal',
    datePickerModalStylesDefault,
);
export const datePickerModalHeaderStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerModal_Header',
    datePickerModalHeaderStylesDefault,
);
export const datePickerModalContentHeaderStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerModal_ContentHeader',
    datePickerModalContentHeaderStylesDefault,
);
export const datePickerModalHeaderBackgroundStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerModal_HeaderBackground',
    datePickerModalHeaderBackgroundStylesDefault,
);
export const datePickerModalEditStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerModal_Edit',
    datePickerModalEditStylesDefault,
);
export const datePickerHeaderItemStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_HeaderItem',
    datePickerPopoverHeaderStylesDefault,
);
export const datePickerMonthPickerStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerPopover_MonthPicker',
    datePickerPopoverMonthPickerStylesDefault,
);
export const datePickerMonthItemStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerPopover_MonthItem',
    datePickerPopoverMonthItemStylesDefault,
);
