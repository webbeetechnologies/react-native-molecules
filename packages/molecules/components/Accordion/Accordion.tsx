import {
    type ComponentPropsWithRef,
    createContext,
    forwardRef,
    memo,
    type ReactElement,
    useCallback,
    useMemo,
} from 'react';
import { View } from 'react-native';

import { useControlledValue } from '../../hooks';
import { accordionStyles } from './utils';

export type Props = Omit<ComponentPropsWithRef<typeof View>, 'children'> & {
    children: ReactElement | ReactElement[];
    expandedItemIds?: string | string[];
    defaultExpandedItemIds?: string | string[];
    onChange?: (expandedItems: string | string[]) => void;
    multiple?: boolean;
};

const Accordion = (
    {
        children,
        style,
        expandedItemIds: expandedItemIdsProp,
        defaultExpandedItemIds,
        onChange: onChangeProp,
        multiple = false,
        ...rest
    }: Props,
    ref: any,
) => {
    const [expandedItemIds, onChange] = useControlledValue({
        value: expandedItemIdsProp,
        defaultValue: defaultExpandedItemIds,
        onChange: onChangeProp,
    });

    const onPressItem = useCallback(
        (id: string) => {
            const isSelected = Array.isArray(expandedItemIds)
                ? expandedItemIds.find(_id => _id === id)
                : expandedItemIds === id;

            const multipleValue = Array.isArray(expandedItemIds)
                ? isSelected
                    ? expandedItemIds.filter(_id => _id !== id)
                    : [...expandedItemIds, id]
                : [id];

            const singleValue = !isSelected ? id : '';

            onChange(multiple ? multipleValue : singleValue);
        },
        [multiple, onChange, expandedItemIds],
    );

    const contextValue = useMemo(() => {
        return {
            expandedItemIds,
            onChange,
            onPressItem,
            multiple,
        };
    }, [expandedItemIds, multiple, onChange, onPressItem]);

    return (
        <View style={[accordionStyles.root, style]} {...rest} ref={ref}>
            <AccordionContext.Provider value={contextValue}>{children}</AccordionContext.Provider>
        </View>
    );
};

export type AccordionContextType = {
    expandedItemIds: string | string[] | undefined;
    onChange: ((expandedItems: string | string[]) => void) | undefined;
    onPressItem: ((id: string) => void) | undefined;
    multiple: boolean;
} | null;

export const AccordionContext = createContext<AccordionContextType>(null);

export default memo(forwardRef(Accordion));
