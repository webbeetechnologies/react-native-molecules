import { memo, useContext } from 'react';
import { View, type ViewProps } from 'react-native';

import { AccordionItemContext } from './utils';
import { accordionItemContentStyles } from './utils';

export type Props = ViewProps & {};

const AccordionItemContent = memo(({ style, children, ...rest }: Props) => {
    const { expanded } = useContext(AccordionItemContext);

    if (!expanded) return null;

    return (
        <View style={[accordionItemContentStyles.root, style]} {...rest}>
            {children}
        </View>
    );
});

AccordionItemContent.displayName = 'AccordionItem_Content';

export default AccordionItemContent;
