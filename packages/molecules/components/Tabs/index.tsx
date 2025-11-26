import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import type { TabItemProps } from './TabItem';
import { default as TabItem } from './TabItem';
import type { TabLabelProps } from './TabLabel';
import { default as TabLabel } from './TabLabel';
import type { TabsProps } from './Tabs';
import { TabBase } from './Tabs';

export const TabsDefault = Object.assign(TabBase, {
    Item: TabItem,
    Label: TabLabel,
});

registerMoleculesComponents({
    Tabs: TabsDefault,
});

export const Tabs = getRegisteredComponentWithFallback('Tabs', TabsDefault);

export type { TabItemProps, TabLabelProps, TabsProps };
export { tabsItemStyles, tabsLabelStyles, tabsStyles } from './utils';
