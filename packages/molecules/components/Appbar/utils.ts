import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const appbarBaseStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingHorizontal: theme.spacings['4'],
        backgroundColor: theme.colors.surface,
        flex: 1,
        minHeight: 64,
    },

    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
}));

const appbarCenterAlignedStylesDefault = StyleSheet.create({
    root: { minHeight: 64 },
});

const appbarSmallStylesDefault = StyleSheet.create({
    root: { minHeight: 64 },
});

const appbarMediumStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['5'],
        minHeight: 112,
    },

    innerContainer: {
        marginBottom: theme.spacings['6'],
    },
}));

const appbarLargeStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingHorizontal: theme.spacings['4'],
        paddingVertical: theme.spacings['5'],
        minHeight: 152,
    },

    innerContainer: {
        marginBottom: theme.spacings['6'],
    },
}));

const appbarTitleDefault = StyleSheet.create(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        color: theme.colors.onSurface,

        variants: {
            size: {
                sm: {
                    lineHeight: theme.typescale.titleLarge.lineHeight,
                    fontSize: theme.typescale.titleLarge.fontSize,
                    fontWeight: theme.typescale.titleLarge.fontWeight,
                },
                md: {
                    lineHeight: theme.typescale.headlineSmall.lineHeight,
                    fontSize: theme.typescale.headlineSmall.fontSize,
                    fontWeight: theme.typescale.headlineSmall.fontWeight,
                },
                lg: {
                    lineHeight: theme.typescale.headlineMedium.lineHeight,
                    fontSize: theme.typescale.headlineMedium.fontSize,
                    fontWeight: theme.typescale.headlineMedium.fontWeight,
                },
            },
        },
    },
}));

const appbarRightDefault = StyleSheet.create(theme => ({
    root: {
        spacing: theme.spacings['6'],
        flexDirection: 'row',
        alignItems: 'center',
    },
}));

const appbarLeftDefault = StyleSheet.create(theme => ({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacings['6'],

        variants: {
            size: {
                small: {
                    marginRight: theme.spacings['4'],
                },
                'center-aligned': {},
                medium: {},
                large: {},
            },
        },
    },
}));

registerComponentsStyles({
    Appbar: appbarBaseStylesDefault,
    Appbar_CenterAligned: appbarCenterAlignedStylesDefault,
    Appbar_Small: appbarSmallStylesDefault,
    Appbar_Medium: appbarMediumStylesDefault,
    Appbar_Large: appbarLargeStylesDefault,
    Appbar_Left: appbarLeftDefault,
    Appbar_Right: appbarRightDefault,
    Appbar_Title: appbarTitleDefault,
});

export const appbarBaseStyles = getRegisteredMoleculesComponentStyles('Appbar');
export const appbarCenterAlignedStyles =
    getRegisteredMoleculesComponentStyles('Appbar_CenterAligned');
export const appbarSmallStyles = getRegisteredMoleculesComponentStyles('Appbar_Small');
export const appbarMediumStyles = getRegisteredMoleculesComponentStyles('Appbar_Medium');
export const appbarLargeStyles = getRegisteredMoleculesComponentStyles('Appbar_Large');
export const appbarTitle = getRegisteredMoleculesComponentStyles('Appbar_Title');
export const appbarRight = getRegisteredMoleculesComponentStyles('Appbar_Right');
export const appbarLeft = getRegisteredMoleculesComponentStyles('Appbar_Left');
