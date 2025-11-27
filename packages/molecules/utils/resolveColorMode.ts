import { Appearance } from 'react-native';

export declare type ColorMode = 'auto' | 'light' | 'dark';

export const resolveColorMode = (colorMode: ColorMode) => {
    const defaultMode = Appearance.getColorScheme() || 'light';

    return colorMode === 'auto' ? defaultMode : colorMode;
};
