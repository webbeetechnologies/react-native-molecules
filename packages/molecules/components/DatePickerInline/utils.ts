import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { daySize } from './dateUtils';

export const dayNamesHeight = 48;

// TODO make it flexible
export const cellSize = 48;
export const cellVerticalPadding = (cellSize - daySize) / 2;
export const weekMargin = 0;
export const weekSize = cellSize + weekMargin;
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
        ...theme.typescale.labelLarge,
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

export const datePickerDayStateLayerStyles = StyleSheet.create(theme => ({
    stateLayer: {
        variants: {
            state: {
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
                todayAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                },
                outsideAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
                selectedAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onPrimary,
                },
                inRangeAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
        },
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
                outside: {
                    opacity: 0.38,
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
                    backgroundColor: 'transparent',
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
                    borderWidth: 0,
                    borderColor: 'transparent',
                    button: {
                        backgroundColor: 'transparent',
                    },
                    today: {
                        borderColor: 'transparent',
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
                    borderWidth: 0,
                    borderColor: 'transparent',
                    button: {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
    },
    text: {
        ...theme.typescale.bodyLarge,
        variants: {
            state: {
                selected: {
                    color: theme.colors.onPrimary,
                    day: {
                        backgroundColor: theme.colors.primary,
                    },
                },

                inRange: {
                    color: theme.colors.onSecondaryContainer,

                    day: {
                        borderColor: 'transparent',
                    },
                    button: {
                        backgroundColor: 'transparent',
                    },
                    today: {
                        borderColor: 'transparent',
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
        height: cellSize,
    },
});

const datePickerHeaderStylesDefault = StyleSheet.create(theme => ({
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacings['2'],
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
        ...theme.typescale.labelLarge,
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
    dayName: { flex: 1, alignItems: 'center', ...theme.typescale.bodyLarge },
    dayNameLabel: {
        ...theme.typescale.bodyLarge,
    },
}));

const datePickerDayRangeStylesDefault = StyleSheet.create(theme => ({
    container: {
        position: 'absolute',
        top: cellVerticalPadding,
        bottom: cellVerticalPadding,
        left: 0,
        right: 0,
        flexDirection: 'row',

        variants: {
            state: {
                inRange: {
                    backgroundColor: theme.colors.secondaryContainer,
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
                    backgroundColor: theme.colors.secondaryContainer,
                },
            },
        },
    },
    leftCrop: {
        flex: 1,

        variants: {
            state: {
                isLeftCrop: {
                    backgroundColor: theme.colors.secondaryContainer,
                },
            },
        },
    },
    centerCrop: {
        backgroundColor: theme.colors.secondaryContainer,
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
    content: {
        alignItems: 'center',
    },
    yearButton: {
        borderRadius: theme.shapes.corner.full,
        paddingHorizontal: 0,
        overflow: 'hidden',
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

export const datePickerStyles = getRegisteredComponentStylesWithFallback(
    'DatePickerInline',
    datePickerStylesDefault,
);
export const datePickerMonthStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_Month',
    datePickerMonthStylesDefault,
);
export const datePickerYearPickerStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_YearPicker',
    datePickerYearPickerStylesDefault,
);
export const datePickerDayStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_Day',
    datePickerDayStylesDefault,
);
export const datePickerDayEmptyStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_DayEmpty',
    datePickerDayEmptyStylesDefault,
);
export const datePickerWeekStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_Week',
    datePickerWeekStylesDefault,
);
export const datePickerHeaderStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_Header',
    datePickerHeaderStylesDefault,
);
export const dateDayNameStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_DayName',
    dateDayNameStylesDefault,
);
export const datePickerDayRangeStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_DayRange',
    datePickerDayRangeStylesDefault,
);
export const datePickerYearItemStyles = getRegisteredComponentStylesWithFallback(
    'DatePicker_YearItem',
    datePickerYearItemStylesDefault,
);
