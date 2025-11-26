import { memo, useMemo } from 'react';

import { default as AppbarBase } from './AppbarBase';
import type { AppbarProps } from './types';
import { appbarCenterAlignedStyles } from './utils';

const AppbarCenterAligned = ({ style, ...rest }: AppbarProps) => {
    const componentStyles = useMemo(() => [appbarCenterAlignedStyles.root, style], [style]);

    return <AppbarBase _type="center-aligned" style={componentStyles} {...rest} />;
};

export default memo(AppbarCenterAligned);
