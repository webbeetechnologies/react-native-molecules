/// <reference types="@docusaurus/module-type-aliases" />

import type { MD3DarkTheme, MD3LightTheme } from 'react-native-molecules/styles';

// if you defined themes
type AppThemes = {
    light: typeof MD3LightTheme;
    dark: typeof MD3DarkTheme;
};

type AppBreakpoints = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
};

// override library types
declare module 'react-native-unistyles' {
    interface UnistylesThemes extends AppThemes {}
    interface UnistylesBreakpoints extends AppBreakpoints {}
}
