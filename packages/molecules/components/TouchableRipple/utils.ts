import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

const touchableRippleStylesDefault = StyleSheet.create(theme => ({
    root: {
        rippleColor: theme.colors.onSurfaceRipple,
    } as any,
}));

registerComponentsStyles({
    TouchableRipple: touchableRippleStylesDefault,
});

export const touchableRippleStyles = getRegisteredMoleculesComponentStyles('TouchableRipple');
