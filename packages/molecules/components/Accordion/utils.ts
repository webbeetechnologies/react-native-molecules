import { createContext } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export const AccordionItemContext = createContext({
    expanded: false,
    onExpandedChange: (_expanded: boolean) => {},
});

const accordionStylesDefault = StyleSheet.create({
    root: {},
});
const accordionItemStylesDefault = StyleSheet.create({
    root: {},
});

const accordionItemHeaderStylesDefault = StyleSheet.create(theme => ({
    root: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.shapes.corner.full,
        paddingLeft: theme.spacings['4'],
        paddingRight: theme.spacings['6'],
        elementColor: theme.colors.onSurfaceVariant,
        state: {
            expandedAndHovered: {
                backgroundColor: theme.colors.stateLayer.hover.onSurface,
            },
            expanded: {},
            hovered: {
                backgroundColor: theme.colors.stateLayer.hover.onSurface,
            },
        },
    },

    leftElement: {
        marginRight: theme.spacings['3'],
    },
    rightElement: {
        marginLeft: theme.spacings['3'],
    },
    content: {
        color: theme.colors.onSurfaceVariant,
        ...theme.typescale.titleMedium,
    },
}));

const accordionItemContentStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingLeft: theme.spacings['6'],
    },
}));

export const accordionStyles = getRegisteredComponentStylesWithFallback(
    'Accordion',
    accordionStylesDefault,
);
export const accordionItemStyles = getRegisteredComponentStylesWithFallback(
    'AccordionItem',
    accordionItemStylesDefault,
);
export const accordionItemHeaderStyles = getRegisteredComponentStylesWithFallback(
    'AccordionItem_Header',
    accordionItemHeaderStylesDefault,
);
export const accordionItemContentStyles = getRegisteredComponentStylesWithFallback(
    'AccordionItem_Content',
    accordionItemContentStylesDefault,
);
