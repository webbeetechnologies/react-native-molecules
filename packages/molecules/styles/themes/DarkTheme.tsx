import color from 'color';

import { MD3LightTheme } from './LightTheme';
import { tokens } from './tokens';

const ref = tokens.md.ref;

export const generateDarkThemeColors = (
    palette: typeof ref.palette,
    opacity: typeof ref.opacity,
) => {
    return {
        primary: palette.primary70,
        primaryContainer: palette.primary30,
        primaryOnHover: color(palette.primary80).darken(0.12).rgb().string(),
        primaryContainerOnHover: color(palette.primary80).darken(0.9).rgb().string(),
        secondary: palette.secondary80,
        secondaryContainer: palette.secondary30,
        secondaryContainerOnHover: color(palette.secondary30).darken(0.25).rgb().string(),
        tertiary: palette.tertiary80,
        tertiaryContainer: palette.tertiary30,
        surface: palette.neutral10,
        surfaceVariant: palette.neutralVariant30,
        surfaceDisabled: color(palette.neutral90).alpha(opacity.level2).rgb().string(),
        background: palette.neutral10,
        error: palette.error80,
        errorContainer: palette.error30,
        onPrimary: palette.primary20,
        onPrimaryContainer: palette.primary90,
        onSecondary: palette.secondary20,
        onSecondaryContainer: palette.secondary90,
        onTertiary: palette.tertiary20,
        onTertiaryContainer: palette.tertiary90,
        onSurface: palette.neutral90,
        onSurfaceVariant: palette.neutralVariant80,
        onSurfaceDisabled: color(palette.neutral90).alpha(opacity.level4).hexa(),
        onSurfaceRipple: color(palette.neutral90).alpha(0.12).rgb().string(),
        onError: palette.error20,
        onErrorContainer: palette.error80,
        onBackground: palette.neutral90,
        outline: palette.neutralVariant60,
        outlineVariant: palette.neutralVariant30,
        inverseSurface: palette.neutral90,
        inverseOnSurface: palette.neutral20,
        inversePrimary: palette.primary40,
        backdrop: color(palette.neutralVariant20).alpha(0.4).hexa(),
        disabled: palette.neutral40,
        disabledOnBackground: color(palette.neutral100).alpha(0.1).rgb().string(),
        neutral1: palette.neutral70,
        lines: palette.neutral90, // #E4E1E6
        onNeutral1: palette.neutral40,
        surfaceContainerHighest: palette.neutral22,
        elevation: {
            level0: 'transparent',
            // Note: Color values with transparency cause RN to transfer shadows to children nodes
            // instead of View component in Surface. Providing solid background fixes the issue.
            // Opaque color values generated with `palette.primary80` used as background
            level1: color(palette.primary80).alpha(0.05).rgb().string(), // palette.primary80, alpha 0.05
            level2: color(palette.primary80).alpha(0.08).rgb().string(), // palette.primary80, alpha 0.08
            level3: color(palette.primary80).alpha(0.11).rgb().string(), // palette.primary80, alpha 0.11
            level4: color(palette.primary80).alpha(0.12).rgb().string(), // palette.primary80, alpha 0.12
            level5: color(palette.primary80).alpha(0.14).rgb().string(), // palette.primary80, alpha 0.14
        },
        stateLayer: {
            hover: {
                onSurface: color(palette.neutral90).alpha(opacity.level1).rgb().string(),
                onSurfaceVariant: color(palette.neutralVariant80).alpha(opacity.level1).hexa(),
                primary: color(palette.primary70).alpha(opacity.level1).hexa(),
                onPrimary: color(palette.primary20).alpha(opacity.level1).hexa(),
                onPrimaryContainer: color(palette.primary90).alpha(opacity.level1).hexa(),
                onSecondaryContainer: color(palette.secondary90).alpha(opacity.level1).hexa(),
                onTertiaryContainer: color(palette.tertiary90).alpha(opacity.level1).hexa(),
                inverseOnSurface: color(palette.neutral20).alpha(opacity.level1).hexa(),
            },
            disabled: {
                onSurface: color(palette.neutral90).alpha(opacity.level2).hexa(),
                onSurface_Level4: color(palette.neutral90).alpha(opacity.level4).hexa(),
            },
            pressed: {
                primary: color(palette.primary40).alpha(opacity.level2).hexa(),
                onSurface: color(palette.neutral10).alpha(opacity.level2).hexa(),
            },
            focussed: {
                primary: color(palette.primary40).alpha(opacity.level2).hexa(),
                onSurface: color(palette.neutral10).alpha(opacity.level2).hexa(),
            },
        },
        palette,
        opacity,
    };
};

export const MD3DarkTheme = {
    ...MD3LightTheme,
    themeName: 'MD3DarkTheme',
    dark: true,
    colors: generateDarkThemeColors(ref.palette, ref.opacity),
};
