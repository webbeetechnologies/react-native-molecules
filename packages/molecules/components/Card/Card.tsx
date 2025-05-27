import { forwardRef, memo, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { MD3Elevation } from '../../types/theme';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { CardVariant } from './types';
import { resolveStateVariant } from '../../utils';
import { Surface } from '../Surface';
import { useActionState } from '../../hooks';
import { getRegisteredMoleculesComponentStyles, registerComponentStyles } from '../../core';

export type Props = TouchableRippleProps & {
    variant?: CardVariant;
    touchableContainerStyle?: ViewStyle;
    elevation?: MD3Elevation;
    disableOnHoverElevation?: boolean;
};

const emptyObj = {};

const Card = (
    {
        variant = 'elevated',
        disabled,
        style,
        elevation: elevationProp = 0,
        children,
        touchableContainerStyle = emptyObj,
        disableOnHoverElevation = false,
        ...rest
    }: Props,
    ref: any,
) => {
    const { hovered, pressed } = useActionState({ ref, actionsToListen: ['hover', 'press'] });
    const state = resolveStateVariant({
        disabled: !!disabled,
        pressed: !!pressed,
        hovered: !!hovered,
    });

    cardStyles.useVariants({
        variant,
        state,
    });

    const elevationLevel = variant === 'elevated' ? (hovered ? 2 : 1) : hovered ? 1 : 0;

    const styles = useMemo(() => {
        return {
            container: [cardStyles.container, cardStyles.root, style],
            innerContainer: [cardStyles.innerContainer, touchableContainerStyle],
        };
        // eslint-disable-next-line
    }, [variant, state, style, touchableContainerStyle]);

    const elevation = elevationProp === undefined ? elevationLevel ?? 0 : elevationProp;

    return (
        <Surface
            style={styles.container}
            elevation={
                variant === 'outlined'
                    ? elevationProp
                    : ((!(disableOnHoverElevation && hovered)
                          ? (elevationProp || 0) + elevationLevel
                          : elevation) as MD3Elevation)
            }>
            <TouchableRipple style={styles.innerContainer} {...rest} disabled={disabled} ref={ref}>
                <>{children}</>
            </TouchableRipple>
        </Surface>
    );
};

const cardStylesDefault = StyleSheet.create(theme => ({
    root: {
        animationDuration: `${theme.animation.durations['1']}`,

        variants: {
            variant: {
                elevated: {},
                filled: {},
                outlined: {},
                undefined: {},
            },
        },
        compoundVariants: [
            {
                variant: 'outlined',
                state: 'disabled',
                styles: {
                    opacity: 0.12,
                },
            },
        ],
    },
    container: {
        borderRadius: theme.shapes.corner.medium,

        variants: {
            variant: {
                elevated: {
                    backgroundColor: theme.colors.surface,
                },

                filled: {
                    backgroundColor: theme.colors.surfaceVariant,
                },

                outlined: {
                    borderWidth: 1,
                    borderColor: theme.colors.outlineVariant,
                },
            },
        },

        compoundVariants: [
            {
                variant: 'elevated',
                state: 'disabled',
                styles: {
                    backgroundColor: theme.colors.surfaceVariant,
                    opacity: 0.38,
                },
            },

            {
                variant: 'filled',
                state: 'disabled',
                styles: {
                    backgroundColor: theme.colors.surface,
                    opacity: 0.38,
                },
            },
            {
                variant: 'outlined',
                state: 'disabled',
                styles: {
                    opacity: 0.38,
                },
            },
            {
                variant: 'outlined',
                state: 'hovered',
                styles: {
                    borderColor: theme.colors.outline,
                },
            },
        ],
    },
    innerContainer: {
        borderRadius: theme.shapes.corner.medium,
    },
}));

registerComponentStyles('Card', cardStylesDefault);
export const cardStyles = getRegisteredMoleculesComponentStyles('Card');

export default memo(forwardRef(Card));
