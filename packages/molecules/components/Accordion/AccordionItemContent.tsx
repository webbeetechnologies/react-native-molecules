import { memo } from 'react';
import { View, type ViewProps } from 'react-native';

import { accordionItemContentStyles } from './utils';

export type Props = ViewProps & {};

const AccordionItemContent = memo(({ style, children, ...rest }: Props) => {
    return (
        <View style={[accordionItemContentStyles.root, style]} {...rest}>
            {children}
        </View>
    );
});

AccordionItemContent.displayName = 'AccordionItem_Content';

export default AccordionItemContent;
