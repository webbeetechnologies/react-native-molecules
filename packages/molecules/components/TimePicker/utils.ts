import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';
import { circleSize } from './timeUtils';

const timePickerStylesDefault = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',

        variants: {
            variant: {
                landScape: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24 * 3 + 96 * 2 + 52 + circleSize,
                },
                landScapeWithoutClock: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24 * 3 + 96 * 2 + 12,
                },
            },
        },
    },
    clockContainer: {
        paddingLeft: theme.spacings['3'],
        paddingRight: theme.spacings['3'],
        alignItems: 'center',

        variants: {
            variant: {
                default: {
                    marginTop: theme.spacings['9'],
                },
            },
        },
    },
}));

const timePickerInputsStylesDefault = StyleSheet.create(theme => ({
    spaceBetweenInputsAndSwitcher: { width: 12 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        variants: {
            state: {
                landScape: {
                    flex: 1,
                },
            },
        },
    },
    hoursAndMinutesSeparator: {
        fontSize: 65,
        width: 24,
        alignItems: 'center',
    },
    spaceDot: {
        flex: 1,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: theme.shapes.corner.full,
        backgroundColor: theme.colors.onSurface,
    },
    betweenDot: {
        height: 12,
    },
}));

const timePickerInputStylesDefault = StyleSheet.create(theme => ({
    root: {
        rippleColor: theme.colors.onPrimaryContainer,
    } as any,

    container: {
        position: 'relative',
    },
    input: {
        fontSize: theme.typescale.displayLarge.fontSize,
        lineHeight: theme.typescale.displayLarge.lineHeight,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 96,
        height: 80,
        backgroundColor: theme.colors.surfaceVariant,
        color: theme.colors.onSurface,
        borderRadius: theme.shapes.corner.small,

        variants: {
            state: {
                highlighted: {
                    backgroundColor: theme.colors.primaryContainer,
                    color: theme.colors.primary,
                },
            },
        },
    },
    button: {
        overflow: 'hidden',
        borderRadius: theme.shapes.corner.small,
    },
}));

const timePickerClockStylesDefault = StyleSheet.create(theme => ({
    clock: {
        height: circleSize,
        width: circleSize,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.full,
        backgroundColor: theme.colors.surfaceVariant,
    },
    middlePoint: {
        borderRadius: theme.spacings['1'],
        height: 8,
        width: 8,
        backgroundColor: theme.colors.primary,
    },
    center: { justifyContent: 'center', alignItems: 'center' },
    endPoint: {
        borderRadius: theme.shapes.corner.full,
        height: 30,
        width: 30,
        position: 'absolute',
        right: 0,
        bottom: -14,
        backgroundColor: theme.colors.primary,
    },
    line: {
        position: 'absolute',
        marginBottom: -1,
        height: 2,
        borderRadius: theme.shapes.corner.extraSmall,
        backgroundColor: theme.colors.primary,
    },
}));

const timePickerClockHoursStylesDefault = StyleSheet.create(theme => ({
    root: {
        activeTextColor: theme.colors.onPrimary,
    } as any,

    outerHourRoot: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        width: 50,
        height: 50,
        marginLeft: -25,
        marginTop: -25,

        borderRadius: theme.shapes.corner.full,
    },
    outerHourInner: {
        borderRadius: theme.shapes.corner.full,
    },
    innerHourRoot: {
        position: 'absolute',
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
        borderRadius: theme.shapes.corner.full,
    },
    innerHourInner: {
        borderRadius: theme.shapes.corner.full,
    },
    innerHourText: { fontSize: 13 },
}));

const timePickerClockMinutesStylesDefault = StyleSheet.create(theme => ({
    root: {
        activeTextColor: theme.colors.onPrimary,
    } as any,

    outerHourRoot: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        width: 50,
        height: 50,
        marginLeft: -25,
        marginTop: -25,

        borderRadius: theme.shapes.corner.full,
    },
    outerHourInner: {
        borderRadius: theme.shapes.corner.full,
    },
    innerHourRoot: {
        position: 'absolute',
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
        borderRadius: theme.shapes.corner.full,
    },
    innerHourInner: {
        borderRadius: theme.shapes.corner.full,
    },
    innerHourText: {
        fontSize: theme.typescale.labelLarge.fontSize,
    },
    textWhite: { color: '#fff' },
}));

const timePickerAmPmSwitcherStylesDefault = StyleSheet.create(theme => ({
    container: {
        width: 50,
        height: 80,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: theme.colors.outline,
        borderRadius: theme.shapes.corner.small,
    },
    switchSeparator: {
        height: 1,
        width: 48,
        backgroundColor: theme.colors.outline,
    },
    switchButton: {
        flex: 1,
    },
    switchButtonInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,

        variants: {
            state: {
                selected: {
                    backgroundColor: theme.colors.tertiaryContainer,
                },
            },
        },
    },
    text: {
        ...theme.typescale.bodyMedium,
        color: theme.colors.onSurface,

        variants: {
            state: {
                selected: {
                    color: theme.colors.onTertiaryContainer,
                },
            },
        },
    },
}));

registerComponentsStyles({
    TimePicker: timePickerStylesDefault,
    TimePicker_Inputs: timePickerInputsStylesDefault,
    TimePicker_Input: timePickerInputStylesDefault,
    TimePicker_Clock: timePickerClockStylesDefault,
    TimePicker_ClockHours: timePickerClockHoursStylesDefault,
    TimePicker_ClockMinutes: timePickerClockMinutesStylesDefault,
    TimePicker_AmPmSwitcher: timePickerAmPmSwitcherStylesDefault,
});

export const timePickerStyles = getRegisteredMoleculesComponentStyles('TimePicker');
export const timePickerInputsStyles = getRegisteredMoleculesComponentStyles('TimePicker_Inputs');
export const timePickerInputStyles = getRegisteredMoleculesComponentStyles('TimePicker_Input');
export const timePickerClockStyles = getRegisteredMoleculesComponentStyles('TimePicker_Clock');
export const timePickerClockHoursStyles =
    getRegisteredMoleculesComponentStyles('TimePicker_ClockHours');
export const timePickerClockMinutesStyles =
    getRegisteredMoleculesComponentStyles('TimePicker_ClockMinutes');
export const timePickerAmPmSwitcherStyles =
    getRegisteredMoleculesComponentStyles('TimePicker_AmPmSwitcher');
