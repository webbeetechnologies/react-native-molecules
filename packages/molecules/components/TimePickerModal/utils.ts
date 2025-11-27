import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const timepickerModalStylesDefault = StyleSheet.create(theme => ({
    keyboardView: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    modalContent: {
        minWidth: 287,
        width: undefined,
        maxWidth: undefined,
        flex: undefined,
        borderRadius: theme.shapes.corner.extraLarge,
    },
    labelContainer: {
        height: 28,
        justifyContent: 'flex-end',
        paddingLeft: theme.spacings['6'],
        paddingRight: theme.spacings['6'],
        alignSelf: 'flex-start',
    },
    label: {
        letterSpacing: 1,
        fontSize: theme.typescale.labelLarge.fontSize,
        color: theme.colors.onSurface,
        fontWeight: theme.typescale.labelLarge.fontWeight,
    },
    timePickerContainer: {
        padding: theme.spacings['6'],
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacings['2'],
        width: '100%',
    },
    inputTypeToggle: { margin: theme.spacings['1'] },
    fill: { flex: 1 },
}));

registerComponentsStyles({
    TimePickerModal: timepickerModalStylesDefault,
});

export const styles = getRegisteredMoleculesComponentStyles('TimePickerModal');
