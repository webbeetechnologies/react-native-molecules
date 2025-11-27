import type { ViewStyle } from 'react-native';

export const normalizeBorderRadiuses = ({
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderRadius,
}: ViewStyle) => {
    const borderRadiuses: Record<string, any> = {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        borderRadius,
    };

    return Object.keys(borderRadiuses).reduce((acc: Record<string, any>, key) => {
        if (borderRadiuses[key] !== undefined && borderRadiuses[key] !== null) {
            acc[key] = borderRadiuses[key];
        }
        return acc;
    }, {});
};
