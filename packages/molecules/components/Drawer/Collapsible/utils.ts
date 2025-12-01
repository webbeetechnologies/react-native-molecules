import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../../core';

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

export const drawerCollapsibleStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_Collapsible',
    drawerCollapsibleStylesDefault,
);
export const drawerCollapsibleItemStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_CollapsibleItem',
    drawerCollapsibleItemStylesDefault,
);
export const drawerCollapsibleItemHeaderStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_CollapsibleItem_Header',
    drawerCollapsibleItemHeaderStylesDefault,
);
export const drawerCollapsibleItemContentStyles = getRegisteredComponentStylesWithFallback(
    'Drawer_CollapsibleItem_Content',
    drawerCollapsibleItemContentStylesDefault,
);
