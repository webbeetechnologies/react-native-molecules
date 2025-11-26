import { createContext, memo, type ReactElement, useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { Popover, type PopoverProps } from '../Popover';
import { menuStyles } from './utils';

export type Props = Omit<PopoverProps, 'setIsOpen' | 'onClose' | 'children'> & {
    style?: ViewStyle;
    closeOnSelect?: boolean;
    onClose: () => void;
    children: ReactElement | ReactElement[];
};

const emptyObj = {} as ViewStyle;

const Menu = ({
    isOpen,
    onClose,
    children,
    style: styleProp,
    backdropStyles = emptyObj,
    closeOnSelect = true,
    ...rest
}: Props) => {
    const { backdropStyle, style } = useMemo(() => {
        return {
            backdropStyle: [menuStyles.backdrop, backdropStyles] as unknown as ViewStyle,
            style: [menuStyles.root, styleProp] as unknown as ViewStyle,
        };
    }, [backdropStyles, styleProp]);

    const contextValue = useMemo(
        () => ({
            closeOnSelect,
            onClose,
        }),
        [closeOnSelect, onClose],
    );

    // const { menuItemsLength } = useMemo(
    //     () => ({
    //         menuItemsLength:
    //             Children.map(children, child => child)?.filter(
    //                 child => (child.type as FC)?.displayName === 'MenuItem',
    //             )?.length || 0,
    //     }),
    //     [children],
    // );
    //
    // console.log({ menuItemsLength });

    return (
        <Popover
            isOpen={isOpen}
            onClose={onClose}
            backdropStyles={backdropStyle}
            style={style}
            {...rest}>
            <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
        </Popover>
    );
};

export const MenuContext = createContext({
    closeOnSelect: true,
    onClose: () => {},
});

export default memo(Menu);
