import { forwardRef, memo, useMemo } from 'react';

import { Accordion, type AccordionProps } from '../../Accordion';
import { drawerCollapsibleStyles } from './utils';

export type Props = AccordionProps & {};

const DrawerCollapsible = memo(
    forwardRef(({ style, ...rest }: Props, ref: any) => {
        return (
            <Accordion
                {...rest}
                style={useMemo(() => [drawerCollapsibleStyles.root, style], [style])}
                ref={ref}
            />
        );
    }),
);

DrawerCollapsible.displayName = 'Drawer_Collapsible';

export default DrawerCollapsible;
