import { forwardRef, memo, type ReactNode, useCallback, useMemo, useRef } from 'react';
import {
    type GestureResponderEvent,
    Pressable,
    type PressableProps,
    type StyleProp,
    View,
    type ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Slot } from '../Slot';
import { touchableRippleStyles } from './utils';

export type Props = PressableProps & {
    /**
     * Whether to render the ripple outside the view bounds.
     */
    borderless?: boolean;
    /**
     * Type of background drawabale to display the feedback (Android).
     * https://reactnative.dev/docs/touchablenativefeedback#background
     */
    background?: Object;
    /**
     * Whether to start the ripple at the center (Web).
     */
    centered?: boolean;
    /**
     * Whether to prevent interaction with the touchable.
     */
    disabled?: boolean;
    /**
     * Function to execute on press. If not set, will cause the touchable to be disabled.
     */
    onPress?: (e: GestureResponderEvent) => void;
    /**
     * Function to execute on long press.
     */
    onLongPress?: (e: GestureResponderEvent) => void;
    /**
     * Color of the ripple effect (Android >= 5.0 and Web).
     */
    rippleColor?: string;
    /**
     * Color of the underlay for the highlight effect (Android < 5.0 and iOS).
     */
    underlayColor?: string;
    /**
     * Content of the `TouchableRipple`.
     */
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    /**
     * When `true`, the component will not render a wrapper element. Instead, it will
     * merge its props (styles, event handlers, ref) onto its immediate child element.
     * This follows the Radix UI "Slot" pattern for flexible component composition.
     *
     * @example
     * ```tsx
     * // Without asChild - renders a Pressable wrapper
     * <TouchableRipple onPress={handlePress}>
     *   <View><Text>Click me</Text></View>
     * </TouchableRipple>
     *
     * // With asChild - merges props onto the child
     * <TouchableRipple asChild onPress={handlePress}>
     *   <Link href="/page"><Text>Navigate</Text></Link>
     * </TouchableRipple>
     * ```
     *
     * @note When `asChild` is `true`, only a single child element is allowed.
     * @default false
     */
    asChild?: boolean;
};

/**
 * A wrapper for views that should respond to touches.
 * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
 * On unsupported platforms, it falls back to a highlight effect.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/touchable-ripple.gif" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Text, TouchableRipple } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TouchableRipple
 *     onPress={() => console.log('Pressed')}
 *     rippleColor="rgba(0, 0, 0, .32)"
 *   >
 *     <Text>Press anywhere</Text>
 *   </TouchableRipple>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableWithoutFeedback props https://reactnative.dev/docs/touchablewithoutfeedback#props
 */
const TouchableRipple = (
    {
        style,
        background: _background,
        borderless = false,
        disabled: disabledProp,
        rippleColor: rippleColorProp,
        underlayColor: _underlayColor,
        onPress,
        children,
        onPressIn: onPressInProp,
        onPressOut: onPressOutProp,
        centered,
        asChild = false,
        ...rest
    }: Props,
    ref: any,
) => {
    // TODO - enable ripple onLongPress, need to check for mobile as well
    const disabled = disabledProp;

    const componentStyles = touchableRippleStyles;

    const { rippleColor, containerStyle } = useMemo(() => {
        const { rippleColor: defaultRippleColor } = componentStyles.root;

        return {
            rippleColor: rippleColorProp || defaultRippleColor,
            containerStyle: [
                styles.touchable,
                { borderRadius: 'inherit' },
                borderless && styles.borderless,
                // ...(Platform.OS === 'web' && !disabled ? ({ cursor: 'pointer' } as any) : {}),
                componentStyles.root,
                style,
            ],
        };
    }, [borderless, componentStyles.root, rippleColorProp, style]);

    // Track whether pointer is currently down for handling pointer leave
    const isPointerDownRef = useRef(false);
    // Store current target element to clean up ripples on pointer up/leave
    const currentTargetRef = useRef<HTMLElement | null>(null);

    // Using 'any' for event types to support both React DOM PointerEvent and React Native events
    // This is a web-only file, so we primarily handle DOM pointer events
    const handlePointerDown = useCallback(
        (e: any) => {
            onPressInProp?.(e as GestureResponderEvent);

            if (disabled) return;

            isPointerDownRef.current = true;

            const button = e.currentTarget as HTMLElement;
            currentTargetRef.current = button;
            const computedStyle = window.getComputedStyle(button);
            const dimensions = button.getBoundingClientRect();

            let touchX: number;
            let touchY: number;

            if (centered) {
                // If centered, always position ripple at center
                touchX = dimensions.width / 2;
                touchY = dimensions.height / 2;
            } else if ('clientX' in e && 'clientY' in e) {
                // Web pointer event - calculate position relative to element
                touchX = e.clientX - dimensions.left;
                touchY = e.clientY - dimensions.top;
            } else if (e.nativeEvent) {
                // React Native gesture event
                const { changedTouches, touches } = e.nativeEvent;
                const touch = touches?.[0] ?? changedTouches?.[0];
                if (touch) {
                    touchX = touch.locationX ?? dimensions.width / 2;
                    touchY = touch.locationY ?? dimensions.height / 2;
                } else {
                    touchX = dimensions.width / 2;
                    touchY = dimensions.height / 2;
                }
            } else {
                // Fallback to center (keyboard activation)
                touchX = dimensions.width / 2;
                touchY = dimensions.height / 2;
            }

            // Get the size of the button to determine how big the ripple should be
            const size = centered
                ? // If ripple is always centered, we don't need to make it too big
                  Math.min(dimensions.width, dimensions.height) * 1.25
                : // Otherwise make it twice as big so clicking on one end spreads ripple to other
                  Math.max(dimensions.width, dimensions.height) * 2;

            // Create a container for our ripple effect so we don't need to change the parent's style
            const container = document.createElement('span');

            container.setAttribute('data-molecules-ripple', '');

            Object.assign(container.style, {
                position: 'absolute',
                pointerEvents: 'none',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                borderTopLeftRadius: computedStyle.borderTopLeftRadius,
                borderTopRightRadius: computedStyle.borderTopRightRadius,
                borderBottomRightRadius: computedStyle.borderBottomRightRadius,
                borderBottomLeftRadius: computedStyle.borderBottomLeftRadius,
                overflow: centered ? 'visible' : 'hidden',
            });

            // Create span to show the ripple effect
            const ripple = document.createElement('span');

            Object.assign(ripple.style, {
                position: 'absolute',
                pointerEvents: 'none',
                backgroundColor: rippleColor,
                borderRadius: '50%',

                /* Transition configuration */
                transitionProperty: 'transform opacity',
                transitionDuration: `${Math.min(size * 1.5, 350)}ms`,
                transitionTimingFunction: 'linear',
                transformOrigin: 'center',

                /* We'll animate these properties */
                transform: 'translate3d(-50%, -50%, 0) scale3d(0.1, 0.1, 0.1)',
                opacity: '0.5',

                // Position the ripple where cursor was
                left: `${touchX}px`,
                top: `${touchY}px`,
                width: `${size}px`,
                height: `${size}px`,
            });

            // Finally, append it to DOM
            container.appendChild(ripple);
            button.appendChild(container);

            // rAF runs in the same frame as the event handler
            // Use double rAF to ensure the transition class is added in next frame
            // This will make sure that the transition animation is triggered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    Object.assign(ripple.style, {
                        transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
                        opacity: '1',
                    });
                });
            });
        },
        [onPressInProp, disabled, centered, rippleColor],
    );

    const fadeOutRipples = useCallback((target: HTMLElement) => {
        const containers = target.querySelectorAll(
            '[data-molecules-ripple]',
        ) as NodeListOf<HTMLElement>;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                containers.forEach(container => {
                    const ripple = container.firstChild as HTMLSpanElement;

                    Object.assign(ripple.style, {
                        transitionDuration: '250ms',
                        opacity: 0,
                    });

                    // Finally remove the span after the transition
                    setTimeout(() => {
                        const { parentNode } = container;

                        if (parentNode) {
                            parentNode.removeChild(container);
                        }
                    }, 500);
                });
            });
        });
    }, []);

    const handlePointerUp = useCallback(
        (e: any) => {
            onPressOutProp?.(e as GestureResponderEvent);

            if (disabled || !isPointerDownRef.current) return;

            isPointerDownRef.current = false;
            currentTargetRef.current = null;

            const target = e.currentTarget as HTMLElement;
            fadeOutRipples(target);
        },
        [onPressOutProp, disabled, fadeOutRipples],
    );

    const handlePointerLeave = useCallback(
        (e: any) => {
            // Only fade out if pointer was down (dragging out of element)
            if (disabled || !isPointerDownRef.current) return;

            isPointerDownRef.current = false;
            currentTargetRef.current = null;

            const target = e.currentTarget as HTMLElement;
            fadeOutRipples(target);
        },
        [disabled, fadeOutRipples],
    );

    const handlePointerCancel = useCallback(
        (e: any) => {
            if (disabled || !isPointerDownRef.current) return;

            isPointerDownRef.current = false;
            currentTargetRef.current = null;

            const target = e.currentTarget as HTMLElement;
            fadeOutRipples(target);
        },
        [disabled, fadeOutRipples],
    );

    const Component = asChild ? Slot : onPress ? Pressable : View;

    // Use pointer events for universal compatibility (works on any HTML element)
    // These events work with mouse, touch, and stylus inputs
    const pointerEventProps = {
        onPointerDown: handlePointerDown,
        onPointerUp: handlePointerUp,
        onPointerLeave: handlePointerLeave,
        onPointerCancel: handlePointerCancel,
    };

    return (
        <Component
            {...(onPress ? { role: 'button' } : {})}
            {...rest}
            style={containerStyle}
            ref={ref}
            onPress={onPress}
            disabled={disabled}
            {...pointerEventProps}>
            {children}
        </Component>
    );
};

/**
 * Whether ripple effect is supported.
 */
TouchableRipple.supported = true;

const styles = StyleSheet.create({
    touchable: {
        position: 'relative',
    },
    borderless: {
        overflow: 'hidden',
    },
});

export default memo(forwardRef(TouchableRipple));
