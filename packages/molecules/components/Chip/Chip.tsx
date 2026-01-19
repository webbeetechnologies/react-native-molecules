import {
    type ComponentType,
    forwardRef,
    memo,
    type PropsWithoutRef,
    type ReactNode,
    useContext,
    useMemo,
} from 'react';
import {
    type GestureResponderEvent,
    type StyleProp,
    type TextProps,
    type TextStyle,
    View,
    type ViewProps,
    type ViewStyle,
} from 'react-native';

import { useActionState } from '../../hooks';
import type { WithElements } from '../../types';
import type { MD3Elevation } from '../../types/theme';
import { BackgroundContext, resolveStateVariant } from '../../utils';
import { ActivityIndicator, type ActivityIndicatorProps } from '../ActivityIndicator';
import { Icon, type IconProps } from '../Icon';
import { IconButton, type IconButtonProps } from '../IconButton';
import { StateLayer } from '../StateLayer';
import { Surface } from '../Surface';
import { Text } from '../Text';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import { type States, styles } from './utils';

export type Props = Omit<TouchableRippleProps, 'children'> &
    WithElements<ReactNode> & {
        /**
         * label of the chip
         * Will be truncated if it's longer than 20 characters
         */
        label: string;
        /**
         * character limit of the label
         */
        labelCharacterLimit?: number;
        /**
         * Variant of the chip.
         * - `elevated` - elevated chip with shadow and without outline.
         * - `outlined` - chip with an outline. (outline will always have elevation 0 even if it's specified)
         */
        variant?: 'elevated' | 'outlined';
        /**
         *
         * */
        size?: 'sm' | 'md';
        /**
         * callback event when the closeIcon is pressed
         */
        onClose?: () => void;
        /**
         * elevation level of the elevated chip
         */
        elevation?: MD3Elevation;
        /**
         * selected state
         */
        selected?: boolean;
        /**
         * props for the close icon
         * default is { name: 'close', onPress: onClose, disabled, accessibilityLabel: 'Close' }
         */
        closeIconProps?: Partial<IconButtonProps>;
        /**
         * props for the ActivityIndicator
         * default is { size: 18 }
         */
        activityIndicatorProps?: Partial<ActivityIndicatorProps>;
        /**
         * Whether to style the chip color as selected.
         */
        selectedColor?: string;
        /**
         * Whether to display overlay on selected chip
         */
        selectionBackgroundColor?: string;
        /**
         * Accessibility label for the chip. This is read by the screen reader when the user taps the chip.
         */
        accessibilityLabel?: string;
        /**
         * Whether the chip is disabled. A disabled chip is greyed out and `onPress` is not called on touch.
         */
        disabled?: boolean;
        /**
         * Function to execute on press.
         */
        onPress?: (e: GestureResponderEvent) => void;
        /**
         * Whether to show the ActivityIndicator or not
         */
        loading?: boolean;
        /**
         * left element container style
         */
        leftElementContainerStyle?: ViewStyle;
        /**
         * right element container style
         */
        rightElementContainerStyle?: ViewStyle;
        /**
         * label style
         */
        labelStyle?: Partial<TextStyle>;
        /**
         * Pass down testID from chip props to touchable for Detox tests.
         */
        /**
         * props for the stateLayer
         */
        stateLayerProps?: PropsWithoutRef<ViewProps>;
        testID?: string;
        containerProps?: Omit<PropsWithoutRef<ViewProps>, 'style'>;
        leftElementIconProps?: IconProps;
        rightElementIconProps?: IconProps;
        backgroundColor?: string;

        invertLabelColor?: boolean;
    };

const Chip = (
    {
        style,
        label: _label,
        labelCharacterLimit = 20,
        variant = 'outlined',
        size = 'md',
        disabled,
        elevation: elevationProp = 1,
        left,
        right,
        loading = false,
        onClose,
        closeIconProps,
        activityIndicatorProps,
        selected = false,
        leftElementContainerStyle,
        rightElementContainerStyle,
        labelStyle: labelStyleProp,
        accessibilityLabel,
        selectedColor,
        selectionBackgroundColor,
        stateLayerProps = {},
        testID = 'chip',
        containerProps,
        leftElementIconProps,
        invertLabelColor,
        backgroundColor,
        onPress,
        ...rest
    }: Props,
    ref: any,
) => {
    const { hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });
    const Wrapper = onPress ? TouchableRipple : View;

    const state = resolveStateVariant({
        disabled: !!disabled,
        selected,
        selectedAndHovered: selected && hovered,
        hovered,
    });

    styles.useVariants({
        variant,
        size,
        state: state as States,
    });

    const iconSize = size === 'sm' ? 15 : 18;
    // const componentStyles = useComponentStyles('Chip', [
    //     style,
    //     {
    //         container: containerStyleProp || {},
    //         leftElement: leftElementContainerStyleProp || {},
    //         rightElement: rightElementContainerStyleProp || {},
    //         label: labelStyleProp || {},
    //     },
    //     selectionBackgroundColorProp
    //         ? { selectionBackgroundColor: selectionBackgroundColorProp }
    //         : {},
    //     selectedColorProp ? { selectedColor: selectedColorProp } : {},
    // ]);

    const { containerStyle, leftElementStyle, rightElementStyle, labelStyle, stateLayerStyle } =
        useMemo(() => {
            return {
                containerStyle: [
                    styles.container,
                    selected && selectionBackgroundColor
                        ? { backgroundColor: selectionBackgroundColor }
                        : {},
                    style,
                ],
                leftElementStyle: [styles.leftElement, leftElementContainerStyle],
                rightElementStyle: [styles.rightElement, rightElementContainerStyle],
                labelStyle: [
                    styles.label,
                    selected && selectedColor ? { color: selectedColor } : {},
                    labelStyleProp,
                ],
                stateLayerStyle: [styles.stateLayer, stateLayerProps?.style],
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            leftElementContainerStyle,
            rightElementContainerStyle,
            selected,
            selectedColor,
            selectionBackgroundColor,
            stateLayerProps?.style,
            style,
            labelStyleProp,
            state,
            size,
            variant,
        ]);

    const { accessibilityState, elevation } = useMemo(
        () => ({
            accessibilityState: {
                selected,
                disabled,
            },
            elevation: variant === 'outlined' || disabled ? 0 : elevationProp,
        }),
        [disabled, elevationProp, selected, variant],
    );
    const label = `${_label}`.trim();

    return (
        <Surface
            {...containerProps}
            elevation={elevation}
            style={containerStyle}
            backgroundColor={backgroundColor}
            asChild>
            <Wrapper
                borderless
                {...rest}
                disabled={disabled}
                accessibilityLabel={accessibilityLabel}
                accessibilityState={accessibilityState}
                ref={actionsRef}
                testID={testID}>
                <>
                    <LeftElement
                        iconSize={iconSize}
                        leftElementStyle={leftElementStyle}
                        left={left}
                        activityIndicatorProps={activityIndicatorProps}
                        loading={loading}
                        selected={selected}
                        iconProps={leftElementIconProps}
                        invert={invertLabelColor}
                    />
                    <Label
                        selectable={false}
                        style={labelStyle as TextProps['style']}
                        invert={invertLabelColor}>
                        {label.length < labelCharacterLimit
                            ? label
                            : `${label.substring(0, labelCharacterLimit - 3)}...`}
                    </Label>
                    <RightElement
                        rightElementStyle={rightElementStyle}
                        accessibilityState={accessibilityState}
                        right={right}
                        disabled={disabled}
                        onClose={onClose}
                        closeIconProps={closeIconProps}
                        invert={invertLabelColor}
                    />

                    <StateLayer
                        testID={testID ? `${testID}-stateLayer` : ''}
                        {...stateLayerProps}
                        style={stateLayerStyle}
                    />
                </>
            </Wrapper>
        </Surface>
    );
};

type LeftElementProps = Pick<Props, 'activityIndicatorProps' | 'left' | 'loading' | 'selected'> & {
    leftElementStyle: StyleProp<ViewStyle>;
    iconSize: number;
    iconProps?: IconProps;
    invert?: boolean;
};
const LeftElement = memo(
    ({
        iconSize,
        loading,
        left,
        selected,
        activityIndicatorProps,
        leftElementStyle,
        iconProps,
        invert,
    }: LeftElementProps) => {
        return loading || left || selected ? (
            <View style={leftElementStyle}>
                {loading ? (
                    <ActivityIndicator size={iconSize} {...(activityIndicatorProps || {})} />
                ) : (
                    left || (
                        <IconWithContrastColor
                            name="check"
                            size={iconSize}
                            {...iconProps}
                            invert={invert}
                        />
                    )
                )}
            </View>
        ) : (
            <></>
        );
    },
);

type RightElementProps = Pick<
    Props,
    'onClose' | 'right' | 'closeIconProps' | 'disabled' | 'accessibilityState'
> & {
    rightElementStyle: StyleProp<ViewStyle>;
    invert?: boolean;
};
const RightElement = memo(
    ({
        onClose,
        right,
        disabled,
        closeIconProps,
        rightElementStyle,
        accessibilityState,
        invert,
    }: RightElementProps) => {
        return onClose || right ? (
            <View style={rightElementStyle}>
                {onClose ? (
                    <IconButtonWithContrastColor
                        name="close"
                        size={14}
                        accessibilityLabel="Close"
                        disabled={disabled}
                        onPress={onClose}
                        accessibilityState={accessibilityState}
                        {...(closeIconProps || {})}
                        invert={invert}
                    />
                ) : (
                    right
                )}
            </View>
        ) : (
            <></>
        );
    },
);

const withInvertColorResolved =
    <T extends { style?: TextProps['style'] } = {}>(
        Component: ComponentType<T>,
        prop: string = 'style',
    ) =>
    ({ invert, ...props }: T & { invert?: boolean }) => {
        const { color: contrastColor } = useContext(BackgroundContext);

        const componentStyle = useMemo(
            () => (!invert ? props.style : [props.style, { color: contrastColor }]),
            [invert, props.style, contrastColor],
        );

        const normalizedProps = {
            ...props,
            [prop]: componentStyle,
        } as unknown as T;

        return <Component {...normalizedProps} />;
    };

const Label = withInvertColorResolved((props: TextProps) => {
    return <Text {...props} />;
});

const IconWithContrastColor = withInvertColorResolved((props: IconProps) => {
    return <Icon {...props} />;
});

const IconButtonWithContrastColor = withInvertColorResolved((props: IconButtonProps) => {
    return <IconButton {...props} />;
}, 'iconStyle');

export default memo(forwardRef(Chip));
