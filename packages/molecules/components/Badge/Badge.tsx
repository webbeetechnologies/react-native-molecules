import { memo } from 'react';
import { type ViewProps, type TextProps, View } from 'react-native';
import { badgeStyles } from './utils';
import { Text } from '../Text';

export type Props = Omit<ViewProps, 'children'> & {
    label?: string | number;
    size?: 'sm' | 'md';
    labelProps?: Omit<TextProps, 'children'>;
};

const Badge = ({ style, label, size = 'md', labelProps = {}, ...rest }: Props) => {
    badgeStyles.useVariants({
        size: !label ? 'sm' : size,
    });

    return (
        <View style={[badgeStyles.root, style]} {...rest}>
            {label && size !== 'sm' && (
                <Text {...labelProps} style={[badgeStyles.label, labelProps?.style]}>
                    {label}
                </Text>
            )}
        </View>
    );
};

export default memo(Badge);
