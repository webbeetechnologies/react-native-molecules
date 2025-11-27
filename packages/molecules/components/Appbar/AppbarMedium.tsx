import { memo, useMemo } from 'react';

import { default as AppbarBase } from './AppbarBase';
import type { AppbarProps } from './types';
import { appbarMediumStyles } from './utils';

const AppbarMedium = ({ style, ...rest }: AppbarProps) => {
    const componentStyles = useMemo(() => [appbarMediumStyles.root, style], [style]);

    return <AppbarBase _type="medium" style={componentStyles} {...rest} />;
};

export default memo(AppbarMedium);
