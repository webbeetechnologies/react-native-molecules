import { forwardRef, memo, type ReactNode } from 'react';
import { type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

export type Props = ViewProps & {
    style?: StyleProp<ViewStyle>;
    children: ReactNode;
};

const CardMedia = memo(
    forwardRef(({ style, children, ...rest }: Props, ref: any) => {
        return (
            <View style={[cardMediaStyles.root, style]} {...rest} ref={ref}>
                {children}
            </View>
        );
    }),
);

const cardMediaStylesDefault = StyleSheet.create(theme => ({
    root: {
        height: 195,
        borderRadius: theme.shapes.corner.medium,
        overflow: 'hidden',
        marginBottom: theme.spacings['4'],
    },
}));

registerComponentStyles('Card_Media', cardMediaStylesDefault);
export const cardMediaStyles = getRegisteredMoleculesComponentStyles('Card_Media');

CardMedia.displayName = 'Card_Media';

export default CardMedia;
