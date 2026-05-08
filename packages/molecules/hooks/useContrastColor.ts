import { resolveContrastColor } from '@react-native-molecules/utils/helpers/resolveContrastColor';
import { useMemo } from 'react';
import { useUnistyles } from 'react-native-unistyles';

export const useContrastColor = (bgColor: string, lightColor?: string, darkColor?: string) => {
    const isDarkMode = useUnistyles().theme.dark;

    return useMemo(
        () => resolveContrastColor(bgColor, lightColor, darkColor, isDarkMode),
        [bgColor, lightColor, darkColor, isDarkMode],
    );
};

export default useContrastColor;
