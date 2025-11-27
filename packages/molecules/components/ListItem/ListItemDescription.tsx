import { memo, useContext } from 'react';
import { type TextProps } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import { ListItemContext } from './ListItem';
import { listItemDescriptionStyles } from './utils';

type Props = TextProps & {};

const ListItemDescription = ({ style, ...rest }: Props) => {
    const { disabled, hovered, variant } = useContext(ListItemContext);

    listItemDescriptionStyles.useVariants({
        state: resolveStateVariant({
            disabled,
            hovered,
        }) as any,
        variant: variant as any,
    });

    return <Text selectable={false} {...rest} style={[listItemDescriptionStyles.root, style]} />;
};

export default memo(ListItemDescription);
