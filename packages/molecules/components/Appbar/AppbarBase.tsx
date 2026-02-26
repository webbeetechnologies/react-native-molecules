import { createContext, memo, useMemo } from 'react';
import { View } from 'react-native';

import { extractSubcomponents } from '../../utils/extractSubcomponents';
import { Surface } from '../Surface';
import type { AppbarBaseProps, AppbarType } from './types';
import { appbarBaseStyles } from './utils';

const AppbarBase = ({
    _type = 'center-aligned',
    elevation = 0,
    children,
    style,
    innerContainerStyle: innerContainerStyleProp,
    scrolling = false,
    ...rest
}: AppbarBaseProps) => {
    const { containerStyle, innerContainerStyle } = useMemo(() => {
        return {
            containerStyle: [
                scrolling ? { backgroundColor: 'colors.surfaceVariant' } : {},
                appbarBaseStyles.root,
                style,
            ],
            innerContainerStyle: [appbarBaseStyles.innerContainer, innerContainerStyleProp],
        };
    }, [innerContainerStyleProp, scrolling, style]);

    const {
        Appbar_Left,
        Appbar_Right,
        Appbar_Title,
        rest: restChildren,
    } = extractSubcomponents({
        children,
        allowedChildren: [
            { name: 'Appbar_Left', allowMultiple: false },
            { name: 'Appbar_Right', allowMultiple: false },
            { name: 'Appbar_Title', allowMultiple: false },
        ],
        includeRest: true,
    });

    const contextValue = useMemo(() => ({ type: _type }), [_type]);

    return (
        <Surface elevation={elevation} style={containerStyle} {...rest}>
            <AppbarContext.Provider value={contextValue}>
                <View style={innerContainerStyle}>
                    {Appbar_Left}
                    <>{_type === 'center-aligned' || _type === 'small' ? Appbar_Title : <View />}</>
                    {Appbar_Right}
                </View>
                {(_type === 'medium' || _type === 'large') && Appbar_Title}
                {restChildren}
            </AppbarContext.Provider>
        </Surface>
    );
};

export const AppbarContext = createContext<{ type: AppbarType }>({
    type: 'center-aligned',
});

export default memo(AppbarBase);
