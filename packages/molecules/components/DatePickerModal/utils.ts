import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const datePickerModalStylesDefault = StyleSheet.create(theme => ({
    header: {
        backgroundColor: theme.colors.primary,
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

registerComponentsStyles({
    DatePickerModal: datePickerModalStylesDefault,
    DatePickerModal_Header: datePickerModalHeaderStylesDefault,
    DatePickerModal_ContentHeader: datePickerModalContentHeaderStylesDefault,
    DatePickerModal_HeaderBackground: datePickerModalHeaderBackgroundStylesDefault,
    DatePickerModal_Edit: datePickerModalEditStylesDefault,
});

export const datePickerModalStyles = getRegisteredMoleculesComponentStyles('DatePickerModal');
export const datePickerModalHeaderStyles =
    getRegisteredMoleculesComponentStyles('DatePickerModal_Header');
export const datePickerModalContentHeaderStyles = getRegisteredMoleculesComponentStyles(
    'DatePickerModal_ContentHeader',
);
export const datePickerModalHeaderBackgroundStyles = getRegisteredMoleculesComponentStyles(
    'DatePickerModal_HeaderBackground',
);
export const datePickerModalEditStyles =
    getRegisteredMoleculesComponentStyles('DatePickerModal_Edit');
