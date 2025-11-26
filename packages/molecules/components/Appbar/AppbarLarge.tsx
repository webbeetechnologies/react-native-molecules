import { memo, useMemo } from 'react';

import { default as AppbarBase } from './AppbarBase';
import type { AppbarProps } from './types';
import { appbarLargeStyles } from './utils';

const AppbarLarge = ({ style, ...rest }: AppbarProps) => {
    const componentStyles = useMemo(() => [appbarLargeStyles.root, style], [style]);

    return <AppbarBase _type="large" style={componentStyles} {...rest} />;
};

export default memo(AppbarLarge);
