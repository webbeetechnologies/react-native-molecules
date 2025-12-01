import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const dialogStylesDefault = StyleSheet.create(theme => ({
    root: {
        spacing: theme.spacings['6'],
        justifyContent: 'flex-start',
        borderRadius: theme.shapes.corner.extraLarge,
        backgroundColor: theme.colors.surface,
    },
}));

const dialogTitleStylesDefault = StyleSheet.create(theme => ({
    root: {
        marginHorizontal: theme.spacings['6'],
        marginVertical: theme.spacings['3'],
        color: theme.colors.onSurface,
        ...theme.typescale.headlineSmall,
    },
}));

const dialogScrollAreaStylesDefault = StyleSheet.create(theme => ({
    root: {
        flexGrow: 1,
        flexShrink: 1,
        marginBottom: theme.spacings['6'],
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.surfaceVariant,
    },
}));

const dialogIconStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.secondary,
        paddingTop: theme.spacings['6'],
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const dialogContentStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingBottom: theme.spacings['6'],
        paddingHorizontal: theme.spacings['6'],
        flex: 1,
    },
}));

const dialogActionsStylesDefault = StyleSheet.create(theme => ({
    root: {
        ...({ spacing: theme.spacings['2'] } as any),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: theme.spacings['6'],
        paddingHorizontal: theme.spacings['6'],
    },
}));

export const dialogStyles = getRegisteredComponentStylesWithFallback('Dialog', dialogStylesDefault);
export const dialogTitleStyles = getRegisteredComponentStylesWithFallback(
    'Dialog_Title',
    dialogTitleStylesDefault,
);
export const dialogScrollAreaStyles = getRegisteredComponentStylesWithFallback(
    'Dialog_ScrollArea',
    dialogScrollAreaStylesDefault,
);
export const dialogIconStyles = getRegisteredComponentStylesWithFallback(
    'Dialog_Icon',
    dialogIconStylesDefault,
);
export const dialogContentStyles = getRegisteredComponentStylesWithFallback(
    'Dialog_Content',
    dialogContentStylesDefault,
);
export const dialogActionsStyles = getRegisteredComponentStylesWithFallback(
    'Dialog_Actions',
    dialogActionsStylesDefault,
);
