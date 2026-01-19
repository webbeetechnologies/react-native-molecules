import { forwardRef, memo, type PropsWithoutRef, type ReactNode, useContext, useMemo } from 'react';
import {
    type StyleProp,
    type TextProps,
    type TextStyle,
    type ViewProps,
    type ViewStyle,
} from 'react-native';

import { useActionState } from '../../hooks';
import type { MD3Elevation } from '../../types/theme';
import { resolveStateVariant } from '../../utils';
import { ActivityIndicator, type ActivityIndicatorProps } from '../ActivityIndicator';
import { Icon, type IconProps } from '../Icon';
import { StateLayer } from '../StateLayer';
import { Surface, type SurfaceProps } from '../Surface';
import { Text } from '../Text';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import type { ButtonContextType, ButtonShape, ButtonSize, ButtonVariant } from './types';
import {
    buttonActivityIndicatorStyles,
    ButtonContext,
    buttonIconStyles,
    buttonStyles,
    buttonTextStyles,
    elevationMap,
    sizeToIconSizeMap,
} from './utils';

export type Props = Omit<SurfaceProps, 'style'> &
    Pick<TouchableRippleProps, 'onPress' | 'onPressIn' | 'onPressOut' | 'onLongPress'> & {
        /**
         * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
         * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
         * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
         * - `contained` - button with a background color, used for important action, have the most visual impact and high emphasis.
         * - `elevated` - button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background. @supported Available in v5.x with theme version 3
         * - `contained-tonal` - button with a secondary background color, an alternative middle ground between contained and outlined buttons. @supported Available in v5.x with theme version 3
         */
        variant?: ButtonVariant;
        /**
         * Shape of the button.
         * - `rounded` - fully rounded corners (default)
         * - `square` - square corners with medium border radius
         */
        shape?: ButtonShape;
        /**
         * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
         */
        disabled?: boolean;
        /**
         * Content of the button. Use Button.Icon and Button.Text compound components.
         */
        children?: ReactNode;
        /**
         * Accessibility label for the button. This is read by the screen reader when the user taps the button.
         */
        accessibilityLabel?: string;
        /**
         * Accessibility hint for the button. This is read by the screen reader when the user taps the button.
         */
        accessibilityHint?: string;
        style?: StyleProp<TextStyle>;
        /*
         * Size
         * */
        size?: ButtonSize;
        /*
         * Elevation level
         * */
        elevation?: MD3Elevation;
        /**
         * testID to be used on tests.
         */
        testID?: string;
        /**
         * props for the stateLayer
         */
        stateLayerProps?: PropsWithoutRef<ViewProps>;
        textRelatedStyle?: StyleProp<TextStyle>;
        disabledPress?: boolean;
    };

const Button = (
    {
        disabled = false,
        variant = 'text',
        shape = 'rounded',
        size = 'sm',
        children,
        accessibilityLabel,
        accessibilityHint,
        onPress,
        onPressIn,
        onPressOut,
        onLongPress,
        style: styleProp,
        testID,
        accessible,
        stateLayerProps = {},
        elevation: elevationProp,
        textRelatedStyle,
        disabledPress,
        ...restProps
    }: Props,
    ref: any,
) => {
    const { hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });

    const state = resolveStateVariant({
        disabled,
        hovered,
    });

    buttonStyles.useVariants({
        variant,
        // @ts-ignore // TODO - fix this
        state: state as any,
        size,
        shape,
    });
    const iconSize = sizeToIconSizeMap[size] ?? sizeToIconSizeMap.md;
    const elevationLevel = elevationMap[(!!hovered).toString()][variant] ?? 0;

    const { surfaceStyle, accessibilityState, stateLayerStyle, contextValue } = useMemo(() => {
        return {
            surfaceStyle: [buttonStyles.root, styleProp],
            accessibilityState: { disabled },
            stateLayerStyle: [buttonStyles.stateLayer, stateLayerProps?.style],
            contextValue: {
                variant,
                size,
                state: state as ButtonContextType['state'],
                disabled,
                iconSize,
                textRelatedStyle,
            } as ButtonContextType,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        shape,
        state,
        variant,
        size,
        disabled,
        stateLayerProps?.style,
        styleProp,
        iconSize,
        textRelatedStyle,
    ]);

    const elevation = elevationProp === undefined ? elevationLevel ?? 0 : elevationProp;

    return (
        <Surface
            {...restProps}
            style={surfaceStyle}
            elevation={
                (disabled
                    ? 0
                    : hovered
                    ? (elevationProp || 0) + elevationLevel
                    : elevation) as MD3Elevation
            }
            asChild>
            <TouchableRipple
                borderless
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole="button"
                accessibilityState={accessibilityState}
                accessible={accessible}
                disabled={disabled || disabledPress}
                ref={actionsRef}
                testID={testID}>
                <ButtonContext.Provider value={contextValue}>
                    <>
                        {children}

                        <StateLayer
                            testID={testID ? `${testID}-stateLayer` : ''}
                            {...stateLayerProps}
                            style={stateLayerStyle}
                        />
                    </>
                </ButtonContext.Provider>
            </TouchableRipple>
        </Surface>
    );
};

export default memo(forwardRef(Button));

/**
 * Button.Icon - Renders an icon within the button
 */
export const ButtonIcon = memo(
    ({ type, name, size: sizeProp, color: colorProp, style, ...rest }: IconProps) => {
        const { labelColor, iconSize, variant, state, disabled, textRelatedStyle } =
            useContext(ButtonContext);

        const iconSizeResolved = sizeProp ?? iconSize;
        const colorResolved =
            colorProp ?? (typeof labelColor === 'string' ? labelColor : undefined);

        buttonIconStyles.useVariants({
            variant,
            // @ts-ignore - state includes 'default' which is valid but not typed
            state,
        });

        return (
            <Icon
                type={type}
                name={name}
                size={iconSizeResolved}
                color={disabled ? undefined : colorResolved}
                style={[buttonIconStyles.root, textRelatedStyle, style]}
                {...rest}
            />
        );
    },
);

ButtonIcon.displayName = 'Button_Icon';

/**
 * Button.Text - Renders text within the button
 */
export const ButtonText = memo(({ children, style, ...rest }: TextProps) => {
    const { variant, state, size, textRelatedStyle } = useContext(ButtonContext);

    buttonTextStyles.useVariants({
        variant,
        // @ts-ignore - state includes 'default' which is valid but not typed
        state,
        // @ts-ignore - size type mismatch
        size,
    });

    return (
        // @ts-ignore - deep type instantiation
        <Text
            selectable={false}
            numberOfLines={1}
            {...rest}
            style={[buttonTextStyles.root, textRelatedStyle, style]}>
            {children}
        </Text>
    );
});

ButtonText.displayName = 'Button_Text';

/**
 * Button.Loading - Renders a loading indicator within the button
 */
export const ButtonActivityIndicator = memo(
    ({
        size: sizeProp,
        color: colorProp,
        style,
        ...rest
    }: Omit<ActivityIndicatorProps, 'animating'>) => {
        const { iconSize, variant, state } = useContext(ButtonContext);

        const sizeResolved = sizeProp ?? iconSize;
        // Default to onPrimary for contained variants, primary for others
        const colorResolved = colorProp ?? (variant === 'contained' ? 'onPrimary' : 'primary');

        buttonActivityIndicatorStyles.useVariants({
            variant,
            // @ts-ignore - state includes 'default' which is valid but not typed
            state,
        });
        const activityIndicatorStyle = useMemo(() => {
            return [buttonActivityIndicatorStyles.root, style] as StyleProp<ViewStyle>;
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [style, variant, state]);

        return (
            <ActivityIndicator
                size={sizeResolved}
                color={colorResolved}
                style={activityIndicatorStyle}
                {...rest}
            />
        );
    },
);

ButtonActivityIndicator.displayName = 'Button_ActivityIndicator';
