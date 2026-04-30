import { MD3DarkTheme, MD3LightTheme } from 'react-native-molecules/styles';
import { StyleSheet } from 'react-native-unistyles';

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

export const getDocusaurusThemeName = () => {
    if (typeof window !== 'undefined') {
        const persistedTheme =
            window.localStorage.getItem('theme') ??
            window.localStorage.getItem('docusaurus.theme') ??
            window.localStorage.getItem('docusaurus.colorMode');

        if (persistedTheme === 'dark' || persistedTheme === 'light') {
            return persistedTheme;
        }
    }

    if (typeof document === 'undefined') {
        return 'light';
    }

    const { dataset, classList } = document.documentElement;

    if (dataset.theme === 'dark' || classList.contains('theme-dark')) {
        return 'dark';
    }

    if (dataset.theme === 'light' || classList.contains('theme-light')) {
        return 'light';
    }

    return 'light';
};

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
        CSSVars: true,
        initialTheme: getDocusaurusThemeName(),
        adaptiveThemes: false,
    },
    breakpoints,
    themes: {
        light: MD3LightTheme,
        dark: MD3DarkTheme,
    },
});
