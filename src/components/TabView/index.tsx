import { TabViewBase, TabViewProps } from './TabView';
import { TabViewItem, TabViewItemProps } from './TabViewItem';

export const TabView = Object.assign(TabViewBase, {
    Item: TabViewItem,
});

export type { TabViewProps, TabViewItemProps };
export { tabViewStyles, tabViewItemStyles } from './utils';
