import { forwardRef, memo, ReactNode, useCallback, useContext, useMemo } from 'react';
import { type GestureResponderEvent, type TextStyle, View, type ViewStyle } from 'react-native';

import { useActionState } from '../../hooks';
import type { WithElements } from '../../types';
import { resolveStateVariant } from '../../utils';
import { Text } from '../Text';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { AccordionItemContext } from './AccordionItem';
import { accordionItemHeaderStyles } from './utils';

export type AccordionHeaderElementProps = {
    color: string;
    expanded: boolean;
};

type Element = ReactNode | ((props: AccordionHeaderElementProps) => ReactNode);

export type Props = Omit<TouchableRippleProps, 'children'> &
    WithElements<Element> & {
        children: ReactNode;
        leftElementStyle?: ViewStyle;
        rightElementStyle?: ViewStyle;
        contentStyle?: TextStyle;
    };

const emptyArr = {};

const AccordionItemHeader = memo(
    forwardRef(
        (
            {
                left,
                right,
                style,
                children,
                leftElementStyle: leftElementStyleProp = emptyArr,
                rightElementStyle: rightElementStyleProp = emptyArr,
                contentStyle: contentStyleProp = emptyArr,
                onPress: onPressProp,
                ...rest
            }: Props,
            ref: any,
        ) => {
            const { hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });

            const { expanded, onExpandedChange } = useContext(AccordionItemContext);

            const state = resolveStateVariant({
                expandedAndHovered: expanded && hovered,
                expanded,
                hovered,
            });

            // @ts-ignore // TODO - fix this issue
            accordionItemHeaderStyles.useVariants({
                state,
            });

            const onPress = useCallback(
                (e: GestureResponderEvent) => {
                    onPressProp?.(e);

                    onExpandedChange(!expanded);
                },
                [expanded, onPressProp, onExpandedChange],
            );

            const { containerStyle } = useMemo(() => {
                return {
                    containerStyle: [accordionItemHeaderStyles.root, style],
                };
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [style, state]);

            const elementProps = useMemo(
                () => ({
                    color: accordionItemHeaderStyles.root.elementColor,
                    expanded,
                }),
                [expanded],
            );

            return (
                <TouchableRipple
                    style={containerStyle}
                    {...rest}
                    onPress={onPress}
                    ref={actionsRef}>
                    <>
                        {left && (
                            <View
                                style={[
                                    accordionItemHeaderStyles.leftElement,
                                    leftElementStyleProp,
                                ]}>
                                {typeof left === 'function' ? left(elementProps) : left}
                            </View>
                        )}
                        <Text
                            style={[accordionItemHeaderStyles.content, contentStyleProp]}
                            selectable={false}>
                            {children}
                        </Text>
                        {right && (
                            <View
                                style={[
                                    accordionItemHeaderStyles.rightElement,
                                    rightElementStyleProp,
                                ]}>
                                {typeof right === 'function' ? right(elementProps) : right}
                            </View>
                        )}
                    </>
                </TouchableRipple>
            );
        },
    ),
);

AccordionItemHeader.displayName = 'AccordionItem_Header';

export default AccordionItemHeader;
