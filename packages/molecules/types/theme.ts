import type { StyleProp } from 'react-native';

export type Breakpoints = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
};

export type ITheme = {
    light: MD3Theme;
    dark: MD3Theme;
    grid: {
        breakpoints: Partial<Breakpoints>;
        numberOfColumns: number;
    };
    resolveComponentStyles: (args: ResolveComponentStylesArgs) => StyleProp<any>;
};

export type MD3Theme = {
    themeName: string;
    dark: boolean;
    animation: {
        scale: number;
        durations: Record<string, number>;
    };
    colors: MD3Colors;
    typescale: MD3Typescale;
    shapes: MD3Shapes;
    spacings: Record<string, number>;
    letterSpacings: Record<string, string | number>;
    fontSizes: Record<string, string | number>;
    fontWeights: Record<string, string | number>;
    lineHeights: Record<string, string | number>;
    elevations: Record<string, number>;
};

export type ResolveComponentStylesArgs = {
    componentTheme: StyleProp<any>;
    style: StyleProp<any>;
    variant?: string;
    states?: { [key: string]: boolean };
    size?: string;
};

export type Font = {
    fontFamily: string;
    fontWeight?:
        | 'normal'
        | 'bold'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900';
};

export type MD3Colors = {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    surface: string;
    surfaceVariant: string;
    surfaceDisabled: string;
    background: string;
    error: string;
    errorContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    onSurface: string;
    onSurfaceVariant: string;
    onSurfaceDisabled: string;
    onError: string;
    onErrorContainer: string;
    onBackground: string;
    outline: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    backdrop: string;
    elevation: MD3ElevationColors;
    lines: string;
    palette: Record<string, string>;
    opacity: Record<string, number>;
    surfaceContainerHighest: string;
    stateLayer: {};
};

export type MD3Shapes = {
    corner: {
        none: number;
        extraSmall: number;
        small: number;
        medium: number;
        large: number;
        extraLarge: number;
    };
};

export enum MD3TypescaleKey {
    displayLarge = 'displayLarge',
    displayMedium = 'displayMedium',
    displaySmall = 'displaySmall',

    headlineLarge = 'headlineLarge',
    headlineMedium = 'headlineMedium',
    headlineSmall = 'headlineSmall',

    titleLarge = 'titleLarge',
    titleMedium = 'titleMedium',
    titleSmall = 'titleSmall',

    labelLarge = 'labelLarge',
    labelMedium = 'labelMedium',
    labelSmall = 'labelSmall',

    bodyLarge = 'bodyLarge',
    bodyMedium = 'bodyMedium',
    bodySmall = 'bodySmall',
}

export type MD3Type = {
    fontFamily: string;
    letterSpacing: number;
    fontWeight: Font['fontWeight'];
    lineHeight: number;
    fontSize: number;
};

export type MD3Typescale = {
    [key in MD3TypescaleKey]: MD3Type;
};

export type MD3Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export enum ElevationLevels {
    'level0',
    'level1',
    'level2',
    'level3',
    'level4',
    'level5',
}

export type MD3ElevationColors = {
    [key in keyof typeof ElevationLevels]: string;
};
