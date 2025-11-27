import { memo } from 'react';

import { AccordionItem, type AccordionItemContentProps } from '../../Accordion';
import { drawerCollapsibleItemContentStyles } from './utils';

export type Props = AccordionItemContentProps & {};

const DrawerCollapsibleItemContent = memo(({ style, ...rest }: Props) => {
    return (
        <AccordionItem.Content {...rest} style={[drawerCollapsibleItemContentStyles.root, style]} />
    );
});

DrawerCollapsibleItemContent.displayName = 'AccordionItem_Content';

export default DrawerCollapsibleItemContent;
