import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';
import { daySize } from './dateUtils';

export const dayNamesHeight = 44;

// TODO make it flexible
export const weekMargin = 6;
export const weekSize = daySize + weekMargin;
export const montHeaderHeight = 56;
export const monthHeaderSingleMarginTop = 4;
export const monthHeaderSingleMarginBottom = 8 + 22 + 12;
export const monthHeaderSingleHeight = monthHeaderSingleMarginTop + monthHeaderSingleMarginBottom;

const datePickerStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
        // ...({
        //     roundness: theme.shapes.corner.extraSmall,
        //     headerBackgroundColor: theme.colors.surface,
        // } as any),
    },

    container: {
        minHeight: 360,
        minWidth: 360,
    },
}));

const datePickerMonthStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
    },
    monthLabel: {
        ...theme.typescale.bodyMedium,
        opacity: 0.7,
    },
    yearButton: {
        alignSelf: 'flex-start',
        marginLeft: 6,
        borderRadius: theme.shapes.corner.extraSmall,
    },
    yearButtonInner: {
        paddingLeft: theme.spacings['4'],
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.extraSmall,
    },
    month: {},
    monthHeader: {
        height: montHeaderHeight,
        justifyContent: 'center',
        overflow: 'hidden',
    },

    monthButton: {
        borderRadius: theme.shapes.corner.extraLarge,
        overflow: 'hidden',
    },
    buttonContainerStyle: { flexDirection: 'row', alignItems: 'center' },
    dockedHeaderStyle: {},
    weekContainerStyle: {},
}));

const datePickerYearPickerStylesDefault = StyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.surface,
    },
    yearContainer: {
        alignItems: 'center',
    },
    yearButton: {
        borderRadius: theme.shapes.corner.extraLarge,
        overflow: 'hidden',
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacings['4'],
        marginRight: theme.spacings['4'],
    },
    yearInner: {
        borderRadius: theme.shapes.corner.extraLarge,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearLabel: {
        fontSize: 16,
    },
}));

const datePickerDayStylesDefault = StyleSheet.create(theme => ({
    containerStyle: {
        flex: 1,
        flexBasis: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',

        variants: {
            state: {
                disabled: {
                    opacity: 0.3,
                },
            },
        },
    },
    disabled: {
        opacity: 0.3,
    },
    button: {
        width: daySize,
        height: daySize,
        overflow: 'hidden',
        borderRadius: daySize / 2,

        variants: {
            state: {
                inRange: {
                    backgroundColor: theme.colors.primary,
                },
            },
        },
    },
    day: {
        flexBasis: 0,
        flex: 1,
        borderRadius: daySize / 2,
        width: daySize,
        height: daySize,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',

        variants: {
            state: {
                selected: {
                    backgroundColor: theme.colors.primary,
                },

                inRange: {
                    borderColor: theme.colors.primary,
                    button: {
                        backgroundColor: theme.colors.primary,
                    },
                    today: {
                        borderColor: theme.colors.primary,
                    },
                },
            },
        },
    },
    today: {
        borderColor: theme.colors.primary,
        variants: {
            state: {
                inRange: {
                    borderColor: theme.colors.primary,
                    button: {
                        backgroundColor: theme.colors.primary,
                    },
                },
            },
        },
    },
    text: {
        variants: {
            state: {
                selected: {
                    color: theme.colors.onPrimary,
                    day: {
                        backgroundColor: theme.colors.primary,
                    },
                },

                inRange: {
                    color: theme.colors.onPrimary,

                    day: {
                        borderColor: theme.colors.primary,
                    },
                    button: {
                        backgroundColor: theme.colors.primary,
                    },
                    today: {
                        borderColor: theme.colors.primary,
                    },
                },
            },
        },
    },
    flex1: {
        flex: 1,
    },
}));

const datePickerDayEmptyStylesDefault = StyleSheet.create({
    root: {
        flex: 1,
        flexBasis: 0,
    },
});

const datePickerWeekStylesDefault = StyleSheet.create({
    root: {
        flexDirection: 'row',
        height: daySize,
    },
});

const datePickerHeaderStylesDefault = StyleSheet.create(theme => ({
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: theme.spacings['5'],
    },
    buttonContainer: {
        height: 56,
        marginTop: theme.spacings['1'],
        marginBottom: theme.spacings['2'],
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonWrapper: {},
    spacer: { flex: 1 },
    yearLabelStyle: {
        ...theme.typescale.bodyMedium,
        opacity: 0.7,
    },
    yearButtonStyle: {
        alignSelf: 'flex-start',
        marginLeft: 6,
        borderRadius: theme.shapes.corner.extraSmall,
    },
    yearInnerStyle: {
        paddingLeft: theme.spacings['4'],
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.extraSmall,
    },
}));

const dateDayNameStylesDefault = StyleSheet.create(theme => ({
    container: {
        height: dayNamesHeight,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
    dayName: { flex: 1, alignItems: 'center' },
    dayNameLabel: {
        opacity: 0.7,
        ...theme.typescale.bodyMedium,
    },
}));

const datePickerDayRangeStylesDefault = StyleSheet.create(theme => ({
    container: {
        flexDirection: 'row',

        variants: {
            state: {
                bothWays: {
                    borderRadius: daySize / 2,
                },
                inRange: {
                    backgroundColor: theme.colors.primary,
                },
                isCrop: {
                    backgroundColor: undefined,
                },
            },
        },
    },
    rightCrop: {
        flex: 1,

        variants: {
            state: {
                isRightCrop: {
                    backgroundColor: theme.colors.primary,
                },
            },
        },
    },
    leftCrop: {
        flex: 1,

        variants: {
            state: {
                isLeftCrop: {
                    backgroundColor: theme.colors.primary,
                },
            },
        },
    },
    centerCrop: {
        backgroundColor: theme.colors.primary,
        minWidth: daySize,
        minHeight: daySize,

        variants: {
            state: {
                isLeftCrop: {
                    borderTopLeftRadius: daySize / 2,
                    borderBottomLeftRadius: daySize / 2,
                },
                isRightCrop: {
                    borderTopRightRadius: daySize / 2,
                    borderBottomRightRadius: daySize / 2,
                },
            },
        },
    },
}));

const datePickerYearItemStylesDefault = StyleSheet.create(theme => ({
    yearButton: {
        variants: {
            state: {
                selected: {
                    backgroundColor: theme.colors.primary,
                },
            },
        },
    },

    yearLabel: {
        variants: {
            state: {
                selected: {
                    color: theme.colors.onPrimary,
                },
            },
        },
    },
}));

registerComponentsStyles({
    DatePickerInline: datePickerStylesDefault,
    DatePicker_Month: datePickerMonthStylesDefault,
    DatePicker_YearPicker: datePickerYearPickerStylesDefault,
    DatePicker_Day: datePickerDayStylesDefault,
    DatePicker_DayEmpty: datePickerDayEmptyStylesDefault,
    DatePicker_Week: datePickerWeekStylesDefault,
    DatePicker_Header: datePickerHeaderStylesDefault,
    DatePicker_DayName: dateDayNameStylesDefault,
    DatePicker_DayRange: datePickerDayRangeStylesDefault,
    DatePicker_YearItem: datePickerYearItemStylesDefault,
});

export const datePickerStyles = getRegisteredMoleculesComponentStyles('DatePickerInline');
export const datePickerMonthStyles = getRegisteredMoleculesComponentStyles('DatePicker_Month');
export const datePickerYearPickerStyles =
    getRegisteredMoleculesComponentStyles('DatePicker_YearPicker');
export const datePickerDayStyles = getRegisteredMoleculesComponentStyles('DatePicker_Day');
export const datePickerDayEmptyStyles =
    getRegisteredMoleculesComponentStyles('DatePicker_DayEmpty');
export const datePickerWeekStyles = getRegisteredMoleculesComponentStyles('DatePicker_Week');
export const datePickerHeaderStyles = getRegisteredMoleculesComponentStyles('DatePicker_Header');
export const dateDayNameStyles = getRegisteredMoleculesComponentStyles('DatePicker_DayName');
export const datePickerDayRangeStyles =
    getRegisteredMoleculesComponentStyles('DatePicker_DayRange');
export const datePickerYearItemStyles =
    getRegisteredMoleculesComponentStyles('DatePicker_YearItem');
