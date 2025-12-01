import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

const touchableRippleStylesDefault = StyleSheet.create(theme => ({
    root: {
        rippleColor: theme.colors.onSurfaceRipple,
    } as any,
}));

export const touchableRippleStyles = getRegisteredComponentStylesWithFallback(
    'TouchableRipple',
    touchableRippleStylesDefault,
);
