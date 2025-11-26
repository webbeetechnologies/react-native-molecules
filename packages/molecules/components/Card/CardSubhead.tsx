import { forwardRef, memo } from 'react';

import CardTypography, { type Props as TypographyProps } from './CardTypography';

export type Props = Omit<TypographyProps, 'variant'>;

const CardSubhead = memo(
    forwardRef(({ size = 'md', ...rest }: Props, ref: any) => {
        return (
            <CardTypography ref={ref} selectable={false} size={size} {...rest} variant="subhead" />
        );
    }),
);

export default CardSubhead;
