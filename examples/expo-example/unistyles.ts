import { StyleSheet } from 'react-native-unistyles';

import { MD3DarkTheme, MD3LightTheme } from 'react-native-molecules/styles';

// if you defined themes
type AppThemes = {
    light: typeof MD3LightTheme;
    dark: typeof MD3DarkTheme;
};

const breakpoints = {
    xs: 0,
    sm: 300,
    md: 500,
    lg: 800,
    xl: 1200,
};

type AppBreakpoints = typeof breakpoints;

// override library types
declare module 'react-native-unistyles' {
    export interface UnistylesBreakpoints {}
    export interface UnistylesThemes extends AppThemes {}
}

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes {}
    export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
    settings: {
        initialTheme: 'dark',
    },
    breakpoints,
    themes: {
        light: MD3LightTheme,
        dark: MD3DarkTheme,
    },
});
