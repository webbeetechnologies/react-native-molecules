import { memo } from 'react';

import { IconButton, type IconButtonProps } from '../IconButton';

export type Props = Omit<IconButtonProps, 'ref'> & {};

const AppbarActions = memo(({ size = 24, ...rest }: Props) => {
    return <IconButton size={size} {...rest} />;
});

AppbarActions.displayName = 'Appbar_Actions';

export default AppbarActions;
