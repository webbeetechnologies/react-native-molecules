import { memo } from 'react';
import { type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

export type DividerProps = Omit<ViewProps, 'children'> & {
    /**
     * Line orientation. Defaults to horizontal.
     */
    mode?: 'horizontal' | 'vertical';
    /**
     * Left inset when `mode` is `"horizontal"`.
     */
    leftInset?: number;
    /**
     * Right inset when `mode` is `"horizontal"`.
     */
    rightInset?: number;
    /**
     * Top inset when `mode` is `"vertical"`.
     */
    topInset?: number;
    /**
     * Bottom inset when `mode` is `"vertical"`.
     */
    bottomInset?: number;
    /**
     * Whether the divider stroke should use the bold thickness.
     */
    bold?: boolean;
    /**
     * Margin added perpendicular to the divider line (`marginVertical` for horizontal,
     * `marginHorizontal` for vertical).
     */
    spacing?: number;
    style?: StyleProp<ViewStyle>;
};

export type Props = DividerProps;

const DividerHorizontalImpl = memo(function DividerHorizontalImpl({
    leftInset = 0,
    rightInset = 0,
    style,
    bold = false,
    spacing = 8,
    ...rest
}: Omit<DividerProps, 'mode' | 'topInset' | 'bottomInset'>) {
    horizontalDividerStyles.useVariants({
        isBold: bold,
    });

    return (
        <View
            {...rest}
            style={
                [
                    horizontalDividerStyles.root,
                    leftInset ? { marginLeft: leftInset } : undefined,
                    rightInset ? { marginRight: rightInset } : undefined,
                    spacing ? { marginVertical: spacing } : undefined,
                    style,
                ] as StyleProp<ViewStyle>
            }
        />
    );
});

const DividerVerticalImpl = memo(function DividerVerticalImpl({
    topInset = 0,
    bottomInset = 0,
    spacing = 0,
    style,
    bold = false,
    ...rest
}: Omit<DividerProps, 'mode' | 'leftInset' | 'rightInset'>) {
    verticalDividerStyles.useVariants({
        isBold: bold,
    });

    return (
        <View
            {...rest}
            style={
                [
                    verticalDividerStyles.root,
                    style,
                    topInset ? { marginTop: topInset } : undefined,
                    bottomInset ? { marginBottom: bottomInset } : undefined,
                    spacing ? { marginHorizontal: spacing } : undefined,
                ] as StyleProp<ViewStyle>
            }
        />
    );
});

function DividerRoot(props: DividerProps) {
    const mode = props.mode ?? 'horizontal';

    if (mode === 'vertical') {
        const {
            mode: _m,
            leftInset: _l,
            rightInset: _r,
            topInset,
            bottomInset,
            bold,
            spacing,
            style,
            ...viewRest
        } = props;

        return (
            <DividerVerticalImpl
                {...viewRest}
                topInset={topInset}
                bottomInset={bottomInset}
                bold={bold}
                spacing={spacing}
                style={style}
            />
        );
    }

    const {
        mode: _m,
        topInset: _t,
        bottomInset: _b,
        leftInset,
        rightInset,
        bold,
        spacing,
        style,
        ...viewRest
    } = props;

    return (
        <DividerHorizontalImpl
            {...viewRest}
            leftInset={leftInset}
            rightInset={rightInset}
            bold={bold}
            spacing={spacing}
            style={style}
        />
    );
}

export const Divider = memo(DividerRoot);

export const horizontalDividerStylesDefault = StyleSheet.create(theme => ({
    root: {
        height: StyleSheet.hairlineWidth,
        background: theme.colors.outlineVariant,

        variants: {
            isBold: {
                true: {
                    height: 1,
                },
            },
        },
    },
}));

export const verticalDividerStylesDefault = StyleSheet.create(theme => ({
    root: {
        width: StyleSheet.hairlineWidth,
        background: theme.colors.outlineVariant,

        variants: {
            isBold: {
                true: {
                    width: 1,
                },
            },
        },
    },
}));

export const horizontalDividerStyles = getRegisteredComponentStylesWithFallback(
    'HorizontalDivider',
    horizontalDividerStylesDefault,
);

export const verticalDividerStyles = getRegisteredComponentStylesWithFallback(
    'VerticalDivider',
    verticalDividerStylesDefault,
);

export default Divider;
