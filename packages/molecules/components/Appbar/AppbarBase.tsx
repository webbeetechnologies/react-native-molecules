import { createContext, memo, useMemo } from 'react';
import { View } from 'react-native';

import { useSubcomponents } from '../../hooks';
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

    const { Appbar_Left, Appbar_Right, Appbar_Title } = useSubcomponents({
        children,
        allowedChildren: ['Appbar_Left', 'Appbar_Right', 'Appbar_Title'],
    });

    const contextValue = useMemo(() => ({ type: _type }), [_type]);

    return (
        <Surface elevation={elevation} style={containerStyle} {...rest}>
            <AppbarContext.Provider value={contextValue}>
                <View style={innerContainerStyle}>
                    {Appbar_Left[0]}
                    <>
                        {_type === 'center-aligned' || _type === 'small' ? (
                            Appbar_Title[0]
                        ) : (
                            <View />
                        )}
                    </>
                    {Appbar_Right[0]}
                </View>
                <>{(_type === 'medium' || _type === 'large') && Appbar_Title[0]}</>
            </AppbarContext.Provider>
        </Surface>
    );
};

export const AppbarContext = createContext<{ type: AppbarType }>({
    type: 'center-aligned',
});

export default memo(AppbarBase);
