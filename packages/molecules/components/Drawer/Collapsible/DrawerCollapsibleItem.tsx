import { createContext, forwardRef, memo, useMemo } from 'react';

import { AccordionItem, type AccordionItemProps } from '../../Accordion';
import { drawerCollapsibleItemStyles } from './utils';

export type Props = AccordionItemProps & {
    active?: boolean;
};

const DrawerCollapsibleItem = memo(
    forwardRef(({ style, active = false, children, ...rest }: Props, ref: any) => {
        const contextValue = useMemo(
            () => ({
                active,
            }),
            [active],
        );

        return (
            <DrawerCollapsibleItemContext.Provider value={contextValue}>
                <AccordionItem
                    {...rest}
                    style={useMemo(() => [drawerCollapsibleItemStyles.root, style], [style])}
                    ref={ref}>
                    {children}
                </AccordionItem>
            </DrawerCollapsibleItemContext.Provider>
        );
    }),
);

export const DrawerCollapsibleItemContext = createContext({
    active: false,
});

DrawerCollapsibleItem.displayName = 'AccordionItem';

export default DrawerCollapsibleItem;
