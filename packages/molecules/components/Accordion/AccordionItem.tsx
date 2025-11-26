import {
    createContext,
    forwardRef,
    memo,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import { View, type ViewProps } from 'react-native';

import { useControlledValue, useSubcomponents } from '../../hooks';
import type { WithElements } from '../../types';
import { AccordionContext } from './Accordion';
import { accordionItemStyles } from './utils';

export type Props = Omit<ViewProps, 'children'> &
    WithElements<ReactNode> & {
        id?: string;
        expanded?: boolean;
        setExpanded?: (expanded: boolean) => void;
        children: ReactElement | ReactElement[];
    };

const AccordionItem = memo(
    forwardRef(
        (
            {
                id,
                expanded: expandedProp,
                setExpanded: setExpandedProp,
                children,
                style,
                ...rest
            }: Props,
            ref: any,
        ) => {
            const [expanded, onExpandedChange] = useControlledValue({
                value: expandedProp,
                onChange: setExpandedProp,
            });

            const expandedInternal = expandedProp !== undefined ? expandedProp : expanded;

            const groupContext = useContext(AccordionContext);

            const { AccordionItem_Header, AccordionItem_Content } = useSubcomponents({
                children,
                allowedChildren: ['AccordionItem_Header', 'AccordionItem_Content'],
            });

            useEffect(() => {
                if (groupContext !== null && !id) {
                    throw new Error(
                        'AccordionItem is used inside Accordion without specifying an id prop.',
                    );
                }
            }, [groupContext, id]);

            const contextValue = useMemo(() => {
                const isExpanded = groupContext
                    ? Array.isArray(groupContext.expandedItemIds)
                        ? !!groupContext.expandedItemIds.find(_id => _id === id)
                        : groupContext.expandedItemIds === id
                    : expandedInternal;

                const handleExpandChange =
                    groupContext && id !== undefined
                        ? () => groupContext.onPressItem?.(id)
                        : onExpandedChange;

                return { expanded: isExpanded, onExpandedChange: handleExpandChange };
            }, [groupContext, id, expandedInternal, onExpandedChange]);

            return (
                <View style={[accordionItemStyles.root, style]} {...rest} ref={ref}>
                    <AccordionItemContext.Provider value={contextValue}>
                        {AccordionItem_Header[0]}
                        {contextValue.expanded ? AccordionItem_Content[0] : null}
                    </AccordionItemContext.Provider>
                </View>
            );
        },
    ),
);

export const AccordionItemContext = createContext({
    expanded: false,
    onExpandedChange: (_expanded: boolean) => {},
});

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
