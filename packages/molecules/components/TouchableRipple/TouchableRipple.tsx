import { forwardRef, memo, type ReactNode, useCallback, useRef } from 'react';
import {
    type GestureResponderEvent,
    Platform,
    Pressable,
    type PressableProps,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useTheme } from '../../hooks/useTheme';
import { noop } from '../../utils/lodash';
import { Slot } from '../Slot';
import { rippleColorFromBackground } from './rippleFromForegroundColor';
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
     * Alpha used for auto-derived ripple color when `rippleColor` is not provided.
     * @default 0.24
     */
    rippleAlpha?: number;
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
        rippleAlpha = 0.24,
        onPress = noop,
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
    const theme = useTheme();

    const componentStyles = touchableRippleStyles;

    const { rippleColor: themeRippleFallback } = componentStyles.root;

    const tokenResolvedColor =
        typeof rippleColorProp === 'string'
            ? theme.colors[rippleColorProp as keyof typeof theme.colors]
            : undefined;

    const rippleColorResolvedProp =
        typeof tokenResolvedColor === 'string' ? tokenResolvedColor : rippleColorProp;
    const containerStyle = [
        styles.touchable,
        { borderRadius: 'inherit' },
        borderless && styles.borderless,
        // ...(Platform.OS === 'web' && !disabled ? ({ cursor: 'pointer' } as any) : {}),
        componentStyles.root,
        style,
    ];

    // The active ripple is tracked so onPressOut can fade it. Driving the lifecycle
    // off Pressable's press events (instead of raw pointer events) means a nested
    // element that captures the gesture won't trigger an orphan ripple — Pressable
    // only fires onPressIn when its own press is being handled.
    const activeRippleRef = useRef<HTMLElement | null>(null);

    const startRipple = useCallback(
        (host: HTMLElement, x: number, y: number) => {
            const computedStyle = window.getComputedStyle(host);
            const dimensions = host.getBoundingClientRect();

            const resolvedRippleColor =
                rippleColorResolvedProp ??
                (Platform.OS === 'web'
                    ? rippleColorFromBackground(
                          computedStyle.backgroundColor,
                          String(themeRippleFallback),
                          rippleAlpha,
                      )
                    : String(themeRippleFallback));

            const size = centered
                ? Math.min(dimensions.width, dimensions.height) * 1.25
                : Math.max(dimensions.width, dimensions.height) * 2;

            const expandDuration = Math.min(size * 1.5, 350);

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

            const ripple = document.createElement('span');
            Object.assign(ripple.style, {
                position: 'absolute',
                pointerEvents: 'none',
                backgroundColor: resolvedRippleColor,
                borderRadius: '50%',
                transitionProperty: 'transform, opacity',
                transitionDuration: `${expandDuration}ms`,
                transitionTimingFunction: 'linear',
                transformOrigin: 'center',
                transform: 'translate3d(-50%, -50%, 0) scale3d(0.1, 0.1, 0.1)',
                opacity: '0.5',
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
            });

            container.appendChild(ripple);
            host.appendChild(container);
            activeRippleRef.current = container;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    Object.assign(ripple.style, {
                        transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
                        opacity: '1',
                    });
                });
            });
        },
        [centered, rippleColorResolvedProp, themeRippleFallback, rippleAlpha],
    );

    const fadeRipple = useCallback((container: HTMLElement | null) => {
        if (!container) return;
        const ripple = container.firstChild as HTMLElement | null;
        if (!ripple) {
            container.parentNode?.removeChild(container);
            return;
        }

        const onTransitionEnd = (ev: TransitionEvent) => {
            if (ev.propertyName !== 'opacity') return;
            ripple.removeEventListener('transitionend', onTransitionEnd);
            container.parentNode?.removeChild(container);
        };
        ripple.addEventListener('transitionend', onTransitionEnd);

        Object.assign(ripple.style, {
            transitionDuration: '250ms',
            opacity: '0',
        });
    }, []);

    const handlePressIn = useCallback(
        (e: GestureResponderEvent) => {
            onPressInProp?.(e);
            if (disabled) return;

            const host = e.currentTarget as unknown as HTMLElement | null;
            if (!host || typeof host.appendChild !== 'function') return;

            const rect = host.getBoundingClientRect();
            let x = rect.width / 2;
            let y = rect.height / 2;

            if (!centered) {
                const ne: any = e.nativeEvent;
                if (ne) {
                    if (typeof ne.locationX === 'number' && typeof ne.locationY === 'number') {
                        x = ne.locationX;
                        y = ne.locationY;
                    } else if (typeof ne.clientX === 'number' && typeof ne.clientY === 'number') {
                        x = ne.clientX - rect.left;
                        y = ne.clientY - rect.top;
                    }
                }
            }

            startRipple(host, x, y);
        },
        [onPressInProp, disabled, centered, startRipple],
    );

    const handlePressOut = useCallback(
        (e: GestureResponderEvent) => {
            onPressOutProp?.(e);
            const container = activeRippleRef.current;
            activeRippleRef.current = null;
            fadeRipple(container);
        },
        [onPressOutProp, fadeRipple],
    );

    const Component = asChild ? Slot : Pressable;

    const accessibilityRoleProp = (rest as { accessibilityRole?: unknown }).accessibilityRole;
    const roleProp = (rest as { role?: unknown }).role;
    const applyDefaultWebButtonRole =
        !!onPress && accessibilityRoleProp === undefined && roleProp === undefined;

    return (
        <Component
            {...(applyDefaultWebButtonRole ? { role: 'button' } : {})}
            {...rest}
            style={containerStyle}
            ref={ref}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}>
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
