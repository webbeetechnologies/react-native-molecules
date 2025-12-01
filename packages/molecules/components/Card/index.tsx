import { getRegisteredComponentWithFallback } from '../../core';
import { default as CardComponent } from './Card';
import { default as CardActions } from './CardActions';
import { default as CardContent } from './CardContent';
import { default as CardHeader } from './CardHeader';
import { default as CardHeadline } from './CardHeadline';
import { default as CardMedia } from './CardMedia';
import { default as CardSubhead } from './CardSubhead';
import { default as CardText } from './CardText';
export const CardDefault = Object.assign(
    // @component ./Checkbox.tsx
    CardComponent,
    {
        Header: CardHeader,
        Content: CardContent,
        Media: CardMedia,
        Headline: CardHeadline,
        Subhead: CardSubhead,
        Text: CardText,
        Actions: CardActions,
    },
);

export const Card = getRegisteredComponentWithFallback('Card', CardDefault);

export { type Props as CardProps, cardStyles } from './Card';
export { type Props as CardActionsProps } from './CardActions';
export { type Props as CardContentProps, cardContentStyles } from './CardContent';
export { type Props as CardHeaderProps, cardHeaderStyles } from './CardHeader';
export { type Props as CardMediaProps, cardMediaStyles } from './CardMedia';
export { type Props as CardTextProps, cardTypograhyStyles } from './CardTypography';
export type { CardTypographyVariant } from './utils';
export type { CardTypographySize } from './utils';
export { cardActionsStyles } from './utils';
