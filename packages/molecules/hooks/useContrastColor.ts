import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { resolveContrastColor } from '../utils/color';

export const useContrastColor = (bgColor: string, lightColor?: string, darkColor?: string) => {
    const isDarkMode = useUnistyles().theme.dark;

    return useMemo(
        () => resolveContrastColor(bgColor, lightColor, darkColor, isDarkMode),
        [bgColor, lightColor, darkColor, isDarkMode],
    );
};

export default useContrastColor;
