import { forwardRef, memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

export type Props = ViewProps & {
    children: ReactNode | ReactNode[];
};

const CardHeader = memo(
    forwardRef(({ style, ...rest }: Props, ref: any) => {
        return <View style={[cardHeaderStyles.root, style]} {...rest} ref={ref} />;
    }),
);

CardHeader.displayName = 'Card_Header';

const cardHeaderStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingHorizontal: theme.spacings['4'],
        paddingTop: theme.spacings['4'],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
}));
registerComponentStyles('Card_Header', cardHeaderStylesDefault);
export const cardHeaderStyles = getRegisteredMoleculesComponentStyles('Card_Header');

export default CardHeader;
