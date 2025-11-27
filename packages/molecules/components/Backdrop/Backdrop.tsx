import { memo } from 'react';
import { Pressable } from 'react-native';

import type { BackdropProps } from './types';
import { backdropStyles } from './utils';

const Backdrop = ({ style, ...rest }: BackdropProps) => {
    return (
        <Pressable
            accessible={false}
            importantForAccessibility="no"
            {...rest}
            style={[backdropStyles.root, style]}
        />
    );
};

export default memo(Backdrop);
