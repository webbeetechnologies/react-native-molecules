import { memo, type ReactNode, useMemo } from 'react';
import { type TextProps, View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';
import { HorizontalDivider, type HorizontalDividerProps } from '../HorizontalDivider';
import { Text } from '../Text';

export type Props = ViewProps & {
    title?: ReactNode;
    showDivider?: boolean;
    dividerProps?: HorizontalDividerProps;
    titleProps?: TextProps;
};

const DrawerItemGroup = memo(
    ({
        title,
        style,
        children,
        showDivider,
        dividerProps = {},
        titleProps = {},
        ...rest
    }: Props) => {
        const { containerStyle, titleStyle, dividerStyle, dividerRestProps } = useMemo(() => {
            const { title: _titleStyle, divider: _dividerStyle } = drawerItemGroupStyles;
            const { style: dividerStyleProp, ..._dividerRestProps } = dividerProps;

            return {
                containerStyle: [drawerItemGroupStyles.root, style],
                titleStyle: _titleStyle,
                dividerStyle: [_dividerStyle, dividerStyleProp],
                dividerRestProps: _dividerRestProps,
            };
        }, [dividerProps, style]);

        return (
            <View style={containerStyle} {...rest}>
                <>
                    {title && (
                        <Text {...titleProps} style={[titleStyle, titleProps?.style]}>
                            {title}
                        </Text>
                    )}
                </>
                {children}
                <>
                    {showDivider && (
                        <HorizontalDivider style={dividerStyle} {...dividerRestProps} />
                    )}
                </>
            </View>
        );
    },
);

const drawerItemGroupStylesDefault = StyleSheet.create(theme => ({
    root: {
        marginBottom: theme.spacings['1'],
    },
    title: {
        color: theme.colors.onSurfaceVariant,
        lineHeight: theme.typescale.titleSmall.lineHeight,
        fontSize: theme.typescale.titleSmall.fontSize,
        fontWeight: theme.typescale.titleSmall.fontWeight,
        marginVertical: theme.spacings['4'],
        marginHorizontal: theme.spacings['3'],
    },

    divider: {
        marginTop: theme.spacings['1'],
    },
}));

registerComponentStyles('Drawer_ItemGroup', drawerItemGroupStylesDefault);

export const drawerItemGroupStyles = getRegisteredMoleculesComponentStyles('Drawer_ItemGroup');

DrawerItemGroup.displayName = 'Drawer_ItemGroup';

export default DrawerItemGroup;
