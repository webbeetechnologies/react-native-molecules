import { forwardRef, memo, useContext, useMemo } from 'react';
import { AccordionItem, type AccordionItemHeaderProps } from '../../Accordion';
import { DrawerCollapsibleItemContext } from './DrawerCollapsibleItem';
import { resolveStateVariant } from '../../../utils';
import { drawerCollapsibleItemHeaderStyles } from './utils';

export type Props = AccordionItemHeaderProps & {};

const DrawerCollapsibleItemHeader = memo(
    forwardRef(({ style, ...rest }: Props, ref: any) => {
        const { active } = useContext(DrawerCollapsibleItemContext);

        const state = resolveStateVariant({
            active,
        });
        drawerCollapsibleItemHeaderStyles.useVariants({
            state: state as any,
        });

        const { leftElementStyle, rightElementStyle, contentStyle, headerStyle } = useMemo(() => {
            const { content, leftElement, rightElement } = drawerCollapsibleItemHeaderStyles;

            return {
                headerStyle: [style],
                leftElementStyle: leftElement,
                rightElementStyle: rightElement,
                contentStyle: content,
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [style, state]);

        return (
            <AccordionItem.Header
                {...rest}
                style={headerStyle}
                contentStyle={contentStyle}
                leftElementStyle={leftElementStyle}
                rightElementStyle={rightElementStyle}
                ref={ref}
            />
        );
    }),
);

DrawerCollapsibleItemHeader.displayName = 'AccordionItem_Header';

export default DrawerCollapsibleItemHeader;
