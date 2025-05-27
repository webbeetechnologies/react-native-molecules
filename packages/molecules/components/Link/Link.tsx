import { forwardRef, memo, useCallback } from 'react';
import { Linking, Platform, type GestureResponderEvent, type TextProps } from 'react-native';

import { Text } from '../Text';

import { resolveStateVariant } from '../../utils';
import { linkStyles } from './utils';

export type Props = TextProps & {
    href?: string;
    disabled?: boolean;
};

const Link = (
    { style, children, onPress: onPressProp, href, disabled = false, ...rest }: Props,
    ref: any,
) => {
    linkStyles.useVariants({
        state: resolveStateVariant({
            disabled,
        }) as any,
    });

    const onPress = useCallback(
        (e: GestureResponderEvent) => {
            if (disabled) return;

            onPressProp?.(e);

            if (Platform.OS === 'web') return;
            if (href) Linking.openURL(href);
        },
        [disabled, onPressProp, href],
    );

    return (
        <Text
            style={[linkStyles.root, style]}
            {...(Platform.OS === 'web' ? { href } : {})}
            onPress={onPress}
            accessibilityRole="link"
            {...rest}
            ref={ref}>
            {children}
        </Text>
    );
};

export default memo(forwardRef(Link));
