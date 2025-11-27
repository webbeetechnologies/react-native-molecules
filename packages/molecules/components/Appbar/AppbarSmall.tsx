import { memo, useMemo } from 'react';

import { default as AppbarBase } from './AppbarBase';
import type { AppbarProps } from './types';
import { appbarSmallStyles } from './utils';

const AppbarSmall = ({ style, ...rest }: AppbarProps) => {
    const componentStyles = useMemo(() => [appbarSmallStyles.root, style], [style]);

    return <AppbarBase _type="small" style={componentStyles} {...rest} />;
};

export default memo(AppbarSmall);
