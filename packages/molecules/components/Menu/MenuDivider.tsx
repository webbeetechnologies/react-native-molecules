import { memo } from 'react';

import { HorizontalDivider, type HorizontalDividerProps } from '../HorizontalDivider';

export type Props = HorizontalDividerProps & {};

const MenuDivider = memo(({ spacing = 8, ...rest }: Props) => {
    return <HorizontalDivider spacing={spacing} {...rest} />;
});

MenuDivider.displayName = 'Menu_Divider';

export default MenuDivider;
