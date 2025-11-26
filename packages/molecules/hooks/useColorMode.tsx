import { useMemo } from 'react';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

import { type ColorMode, resolveColorMode } from '../utils/resolveColorMode';

const useColorMode = () => {
    const themeName = useUnistyles().theme.dark ? 'dark' : 'light';
    return useMemo(
        () => ({
            colorMode: resolveColorMode(themeName as ColorMode),
            setColorMode: UnistylesRuntime.setTheme,
        }),
        [themeName],
    );
};

export default useColorMode;
