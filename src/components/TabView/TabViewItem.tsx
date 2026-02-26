import React from 'react';
import { View, ViewProps } from 'react-native';

export type TabViewItemProps = ViewProps & {
    name: string;
};

export const TabViewItem = ({ children, ...rest }: TabViewItemProps) => {
    return <View {...rest}>{React.isValidElement(children) && children}</View>;
};

TabViewItem.displayName = 'TabView_Item';
