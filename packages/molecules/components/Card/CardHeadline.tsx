import { forwardRef, memo } from 'react';

import CardTypography, { type Props as TypographyProps } from './CardTypography';

export type Props = Omit<TypographyProps, 'variant'>;

const CardHeadline = memo(
    forwardRef(({ size = 'md', ...rest }: Props, ref: any) => {
        return (
            <CardTypography ref={ref} selectable={false} size={size} {...rest} variant="headline" />
        );
    }),
);

export default memo(CardHeadline);
