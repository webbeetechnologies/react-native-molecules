import { createContext, forwardRef, memo, type ReactNode, useMemo } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useActionState } from '../../hooks';
import type { WithElements } from '../../types';
import { resolveStateVariant } from '../../utils';
import { HorizontalDivider } from '../HorizontalDivider';
import { StateLayer } from '../StateLayer';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { listItemStyles } from './utils';

export type Props = Omit<TouchableRippleProps, 'children'> &
    WithElements<ReactNode | ((renderArgs: { hovered: boolean }) => ReactNode)> & {
        hovered?: boolean;
        /**
         * Description text for the list item or callback which returns a React element to display the description.
         */
        children: ReactNode;
        /**
         * Style that is passed to the wrapping TouchableRipple element.
         */
        style?: StyleProp<ViewStyle>;
        /**
         * Whether the divider shows or not.
         */
        divider?: boolean;
        /**
         * variant of the ListItem
         */
        variant?: 'default' | 'menuItem';
        /**
         * Whether the ListItem is selected or not
         */
        selected?: boolean;
        /**
         * Whether the ListItem is hoverable or not
         * @default true if onPress is passed
         */
        hoverable?: boolean;
    };

const ListItem = (
    {
        left,
        right,
        children,
        style: styleProp,
        disabled = false,
        divider = false,
        variant = 'default',
        selected = false,
        onPress,
        hoverable: hoverableProp = false,
        hovered: hoveredProp = false,
        ...props
    }: Props,
    ref: any,
) => {
    const { hovered: _hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });
    const hoverable = hoverableProp || !!onPress;
    const hovered = hoveredProp || _hovered;

    const state = resolveStateVariant({
        selected,
        disabled,
        hovered: hoverable && hovered,
    }) as any;

    listItemStyles.useVariants({
        state,
        variant: variant as any,
    });

    const {
        containerStyles,
        innerContainerStyle,
        contentStyle,
        leftElementStyle,
        rightElementStyle,
    } = useMemo(() => {
        const { innerContainer, content, leftElement, rightElement } = listItemStyles;
        return {
            containerStyles: [listItemStyles.root, styleProp],
            innerContainerStyle: innerContainer,
            contentStyle: content,
            leftElementStyle: leftElement,
            rightElementStyle: rightElement,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [styleProp, state, variant]);

    const contextValue = useMemo(
        () => ({ disabled, hovered: hoverable && hovered, selected, variant }),
        [disabled, hoverable, hovered, selected, variant],
    );

    return (
        <TouchableRipple
            {...props}
            style={containerStyles}
            disabled={disabled}
            onPress={onPress}
            ref={actionsRef}>
            <>
                <View style={innerContainerStyle}>
                    {left ? (
                        <View style={leftElementStyle}>
                            {typeof left === 'function' ? left({ hovered }) : left}
                        </View>
                    ) : null}
                    <View style={contentStyle}>
                        <ListItemContext.Provider value={contextValue}>
                            <>{children}</>
                        </ListItemContext.Provider>
                    </View>
                    {right ? (
                        <View style={rightElementStyle}>
                            {typeof right === 'function' ? right({ hovered }) : right}
                        </View>
                    ) : null}
                </View>
                {divider && <HorizontalDivider />}
                <StateLayer style={listItemStyles.stateLayer} />
            </>
        </TouchableRipple>
    );
};

export const ListItemContext = createContext({
    disabled: false,
    hovered: false,
    selected: false,
    variant: 'default',
});

export default memo(forwardRef(ListItem));
