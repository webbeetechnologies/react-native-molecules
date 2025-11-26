import { Children, cloneElement, forwardRef, memo, type ReactElement, useMemo } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { isNil } from '../../utils/lodash';
import { elementGroupStyles } from './utils';

export enum Orientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}

export type Props = Omit<ViewProps, 'style'> & {
    orientation?: `${Orientation}`;
    borderRadius?: number | string;
    style?: ViewStyle;
};

export const ElementGroup = (
    {
        orientation: orientationProp = Orientation.Horizontal,
        children,
        style,
        borderRadius: borderRadiusProp,
        ...props
    }: Props,
    ref: any,
) => {
    const orientation = orientationProp === Orientation.Vertical ? 'vertial' : 'horizontal';
    elementGroupStyles.useVariants({
        orientation: orientation as any,
    });
    // const componentStyles = useComponentStyles(
    //     'ElementGroup',
    //     [style, !isNil(borderRadiusProp) ? { borderRadius: borderRadiusProp } : {}],
    //     {
    //         orientation: orientation === Orientation.Vertical ? 'vertial' : 'horizontal',
    //     },
    // );

    const { containerStyle, borderRadius, borderRadiuses } = useMemo(() => {
        const {
            borderRadius: _borderRadius,
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
            ...restStyle
        } = elementGroupStyles.root as any;
        const {
            borderTopLeftRadius: _borderTopLeftRadius,
            borderTopRightRadius: _borderTopRightRadius,
            borderBottomLeftRadius: _borderBottomLeftRadius,
            borderBottomRightRadius: _borderBottomRightRadius,
            ..._restStyle
        } = style ?? {};

        return {
            containerStyle: [restStyle, _restStyle],
            borderRadius: borderRadiusProp || _borderRadius,
            borderRadiuses: {
                borderTopLeftRadius: borderTopLeftRadius || _borderTopLeftRadius,
                borderTopRightRadius: borderTopRightRadius || _borderTopRightRadius,
                borderBottomLeftRadius: borderBottomLeftRadius || _borderBottomLeftRadius,
                borderBottomRightRadius: borderBottomRightRadius || _borderBottomRightRadius,
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [style, borderRadiusProp, orientation]);

    const modifiedChildren = useMemo(() => {
        if (!children) return null;

        if (!Array.isArray(children) || children.length <= 1) return children;

        // if we have enough elements for left, right
        return Children.map(children, (child: ReactElement, index) => {
            const [firstBorderProp, lastBorderProp] = {
                [Orientation.Horizontal]: ['borderTopRightRadius', 'borderBottomLeftRadius'],
                [Orientation.Vertical]: ['borderBottomLeftRadius', 'borderTopRightRadius'],
            }[orientation as Orientation];

            const isFirstChild = index === 0;
            const isLastChild = index === children.length - 1;

            const prop = isFirstChild ? 'first' : isLastChild ? 'last' : 'middle';

            type KeyOfBorderRadiuses = keyof typeof borderRadiuses;

            const mapBorderRadiusFromProp = {
                [firstBorderProp]: !isNil(borderRadiuses[firstBorderProp as KeyOfBorderRadiuses])
                    ? borderRadiuses[firstBorderProp as KeyOfBorderRadiuses]
                    : borderRadius,
                [lastBorderProp]: !isNil(borderRadiuses[lastBorderProp as KeyOfBorderRadiuses])
                    ? borderRadiuses[lastBorderProp as KeyOfBorderRadiuses]
                    : borderRadius,
            };

            const borderRadiusStyles = {
                first: {
                    [firstBorderProp]: 0,
                    borderBottomRightRadius: 0,

                    borderTopLeftRadius: !isNil(borderRadiuses.borderTopLeftRadius)
                        ? borderRadiuses.borderTopLeftRadius
                        : borderRadius,
                    [lastBorderProp]: mapBorderRadiusFromProp[lastBorderProp],
                },
                middle: {
                    borderTopLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 0,
                },
                last: {
                    borderTopLeftRadius: 0,
                    [lastBorderProp]: 0,

                    borderBottomRightRadius: !isNil(borderRadiuses.borderBottomRightRadius)
                        ? borderRadiuses.borderBottomRightRadius
                        : borderRadius,
                    [firstBorderProp]: mapBorderRadiusFromProp[firstBorderProp],
                },
            };

            return cloneElement(child, {
                ...(child.props as any),
                style: [(child.props as any).style, borderRadiusStyles[prop]].flat(),
            });
        });
    }, [borderRadius, borderRadiuses, children, orientation]);

    return (
        <View {...props} style={containerStyle} ref={ref}>
            {modifiedChildren}
        </View>
    );
};

export default memo(forwardRef(ElementGroup));
