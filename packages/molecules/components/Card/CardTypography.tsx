import { forwardRef, memo } from 'react';
import { type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { Text } from '../Text';

export type Props = TextProps & {
    variant?: 'headline' | 'subhead' | 'text';
    size?: 'sm' | 'md' | 'lg';
};

const CardTypography = ({ style, variant = 'text', size = 'md', ...rest }: Props, ref: any) => {
    cardTypograhyStyles.useVariants({
        variant,
        // @ts-ignore
        size,
    });

    return (
        <Text ref={ref} selectable={false} {...rest} style={[cardTypograhyStyles.root, style]} />
    );
};

const cardTypograhyStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.onSurface,

        variants: {
            variant: {
                headline: {
                    marginBottom: theme.spacings['3'],
                },
                subhead: {
                    marginBottom: theme.spacings['3'],
                },
                text: {
                    marginBottom: theme.spacings['1'],
                },
            },
        },
        compoundVariants: [
            {
                variant: 'headline',
                size: 'sm',
                styles: {
                    ...theme.typescale.headlineSmall,
                },
            },
            {
                variant: 'headline',
                size: 'md',
                styles: {
                    ...theme.typescale.headlineMedium,
                },
            },
            {
                variant: 'headline',
                size: 'lg',
                styles: {
                    ...theme.typescale.headlineLarge,
                },
            },
            {
                variant: 'subhead',
                size: 'sm',
                styles: {
                    ...theme.typescale.titleSmall,
                },
            },
            {
                variant: 'subhead',
                size: 'md',
                styles: {
                    ...theme.typescale.titleMedium,
                },
            },
            {
                variant: 'subhead',
                size: 'lg',
                styles: {
                    ...theme.typescale.titleLarge,
                },
            },
            {
                variant: 'text',
                size: 'sm',
                styles: {
                    ...theme.typescale.bodySmall,
                },
            },
            {
                variant: 'text',
                size: 'md',
                styles: {
                    ...theme.typescale.bodyMedium,
                },
            },
            {
                variant: 'text',
                size: 'lg',
                styles: {
                    ...theme.typescale.bodyLarge,
                },
            },
        ],
    },
}));

export const cardTypograhyStyles = getRegisteredComponentStylesWithFallback(
    'Card_Typography',
    cardTypograhyStylesDefault,
);

export default memo(forwardRef(CardTypography));
