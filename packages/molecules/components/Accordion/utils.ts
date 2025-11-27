import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';

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

registerComponentsStyles({
    Accordion: accordionStylesDefault,
    AccordionItem: accordionItemStylesDefault,
    AccordionItem_Header: accordionItemHeaderStylesDefault,
    AccordionItem_Content: accordionItemContentStylesDefault,
});

export const accordionStyles = getRegisteredMoleculesComponentStyles('Accordion');
export const accordionItemStyles = getRegisteredMoleculesComponentStyles('AccordionItem');
export const accordionItemHeaderStyles =
    getRegisteredMoleculesComponentStyles('AccordionItem_Header');
export const accordionItemContentStyles =
    getRegisteredMoleculesComponentStyles('AccordionItem_Content');
