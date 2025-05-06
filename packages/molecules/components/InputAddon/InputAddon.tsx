import { memo } from 'react';
import { View, type ViewProps } from 'react-native';
import { inputAddonStyles } from './utils';

enum InputAddonVariants {
    Left = 'left',
    Right = 'right',
}

export type Props = ViewProps & {
    variant: `${InputAddonVariants}`;
};

const InputAddon = ({ variant, style, children, ...rest }: Props) => {
    inputAddonStyles.useVariants({
        variant,
    });

    return (
        <View style={[inputAddonStyles.root, style]} {...rest}>
            {children}
        </View>
    );
};

export default memo(InputAddon);
