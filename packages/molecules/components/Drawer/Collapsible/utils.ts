import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../../core';

export const drawerCollapsibleStylesDefault = StyleSheet.create({
    root: {},
});

export const drawerCollapsibleItemStylesDefault = StyleSheet.create({
    root: {},
});

export const drawerCollapsibleItemHeaderStylesDefault = StyleSheet.create(theme => ({
    content: {
        color: theme.colors.onSurfaceVariant,
        ...theme.typescale.labelLarge,

        variants: {
            state: {
                active: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },
            },
        },
    },
    leftElement: {},
    rightElement: {},
}));

export const drawerCollapsibleItemContentStylesDefault = StyleSheet.create({
    root: {},
});

registerComponentsStyles({
    Drawer_Collapsible: drawerCollapsibleStylesDefault,
    Drawer_CollapsibleItem: drawerCollapsibleItemStylesDefault,
    Drawer_CollapsibleItem_Header: drawerCollapsibleItemHeaderStylesDefault,
    Drawer_CollapsibleItem_Content: drawerCollapsibleItemContentStylesDefault,
});

export const drawerCollapsibleStyles = getRegisteredMoleculesComponentStyles('Drawer_Collapsible');
export const drawerCollapsibleItemStyles =
    getRegisteredMoleculesComponentStyles('Drawer_CollapsibleItem');
export const drawerCollapsibleItemHeaderStyles = getRegisteredMoleculesComponentStyles(
    'Drawer_CollapsibleItem_Header',
);
export const drawerCollapsibleItemContentStyles = getRegisteredMoleculesComponentStyles(
    'Drawer_CollapsibleItem_Content',
);
