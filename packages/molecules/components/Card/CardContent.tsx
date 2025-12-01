import { forwardRef, memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

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

export const cardContentStyles = getRegisteredComponentStylesWithFallback(
    'Card_Content',
    cardContentStylesDefault,
);

export default CardContent;
