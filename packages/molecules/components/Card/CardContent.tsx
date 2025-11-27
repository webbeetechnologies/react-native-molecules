import { forwardRef, memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

export type Props = ViewProps & {
    children: ReactNode | ReactNode[];
};

const CardContent = memo(
    forwardRef(({ style, ...rest }: Props, ref: any) => {
        return <View style={[cardContentStyles.root, style]} {...rest} ref={ref} />;
    }),
);

CardContent.displayName = 'Card_Content';

const cardContentStylesDefault = StyleSheet.create(theme => ({
    root: {
        padding: theme.spacings['4'],
    },
}));

registerComponentStyles('Card_Content', cardContentStylesDefault);

export const cardContentStyles = getRegisteredMoleculesComponentStyles('Card_Content');

export default CardContent;
