import color from 'color';

import { weakMemoized } from './lodash';

export const resolveContrastColor = weakMemoized(
    (
        bgColor: string,
        lightColor: string = '#fff',
        darkColor: string = '#000',
        isDarkMode?: boolean,
    ) => {
        let isLightColor = !isDarkMode;
        try {
            // TODO: Account for transparency.
            isLightColor = color(bgColor).isLight();
        } finally {
            return isLightColor ? darkColor : lightColor;
        }
    },
);

export default color;
