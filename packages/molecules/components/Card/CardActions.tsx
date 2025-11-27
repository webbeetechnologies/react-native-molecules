import { forwardRef, memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { cardActionsStyles } from './utils';

export type Props = ViewProps & {
    children: ReactNode | ReactNode[];
};

const CardActions = memo(
    forwardRef(({ style, ...rest }: Props, ref: any) => {
        return <View style={[cardActionsStyles.root, style]} {...rest} ref={ref} />;
    }),
);

CardActions.displayName = 'Card_Actions';

export default CardActions;
