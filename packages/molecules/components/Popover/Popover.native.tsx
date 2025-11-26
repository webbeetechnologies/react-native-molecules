import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { AppState, Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import { ScopedTheme, UnistylesRuntime } from 'react-native-unistyles';

import { Portal } from '../Portal';
import {
    DEFAULT_ARROW_SIZE,
    popoverDefaultStyles,
    type PopoverProps,
    useArrowStyles,
    usePopover,
} from './common';

const Popover = ({
    triggerRef,
    children,
    isOpen,
    onClose,
    position = 'bottom',
    align = 'center',
    style,
    showArrow = false,
    arrowSize = DEFAULT_ARROW_SIZE,
    inverted = false,
    triggerDimensions,
    offset = 8,
    ...rest
}: PopoverProps) => {
    const {
        popoverLayoutRef,
        targetLayoutRef,
        actualPositionRef,
        calculatedPosition,
        calculateAndSetPosition,
        handlePopoverLayout,
    } = usePopover({
        isOpen,
        position,
        align,
        showArrow,
        arrowSize,
        offset,
    });

    const popoverRef = useRef<View>(null);

    const measureTarget = useCallback(() => {
        if (triggerRef.current) {
            triggerRef.current.measure(
                (
                    _fx: number,
                    _fy: number,
                    width: number,
                    height: number,
                    px: number,
                    py: number,
                ) => {
                    if (width !== 0 || height !== 0) {
                        const newLayout = { x: px, y: py, width, height };
                        const changed =
                            !targetLayoutRef.current ||
                            targetLayoutRef.current.x !== newLayout.x ||
                            targetLayoutRef.current.y !== newLayout.y ||
                            targetLayoutRef.current.width !== newLayout.width ||
                            targetLayoutRef.current.height !== newLayout.height;

                        if (changed) {
                            targetLayoutRef.current = newLayout;
                            calculateAndSetPosition();
                        }
                    } else {
                        targetLayoutRef.current = null;
                        calculateAndSetPosition();
                    }
                },
                () => {
                    console.error('Failed to measure target element for Popover.');
                    targetLayoutRef.current = null;
                    calculateAndSetPosition();
                },
            );
        } else {
            targetLayoutRef.current = null;
            calculateAndSetPosition();
        }
    }, [triggerRef, calculateAndSetPosition, targetLayoutRef]);

    useLayoutEffect(() => {
        if (isOpen) {
            measureTarget();
        }
    }, [isOpen, measureTarget, triggerDimensions]);

    useEffect(() => {
        if (!isOpen) return;
        const subscription = Dimensions.addEventListener('change', measureTarget);
        return () => {
            if (typeof subscription?.remove === 'function') {
                subscription.remove();
            }
        };
    }, [isOpen, measureTarget]);

    useEffect(() => {
        if (!isOpen || Platform.OS === 'web') return;
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active') {
                setTimeout(measureTarget, 50);
            }
        };
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            if (typeof subscription?.remove === 'function') {
                subscription.remove();
            }
        };
    }, [isOpen, measureTarget]);

    const arrowStyles = useArrowStyles({
        showArrow,
        arrowSize,
        style,
        calculatedPosition,
        targetLayoutRef,
        popoverLayoutRef,
        actualPositionRef,
    });

    const popoverStyle = calculatedPosition ?? popoverDefaultStyles;
    const Wrapper = inverted ? ScopedTheme : Fragment;

    if (!isOpen && popoverStyle.opacity === 0) {
        return null;
    }

    const handleOutsidePress = () => {
        if (isOpen && onClose) {
            onClose();
        }
    };

    return (
        <Portal>
            <Wrapper
                {...(inverted
                    ? { name: UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark' }
                    : ({} as { name: 'light' }))}>
                <Pressable onPress={handleOutsidePress} style={styles.overlay} />

                <View
                    ref={popoverRef}
                    onLayout={handlePopoverLayout}
                    style={[styles.popoverContainer, style, popoverStyle]}
                    {...rest}>
                    {children}
                    {showArrow && popoverStyle.opacity === 1 && <View style={arrowStyles} />}
                </View>
            </Wrapper>
        </Portal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    popoverContainer: {
        ...popoverDefaultStyles,
        backgroundColor: 'white',
        borderRadius: 4,
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 100,
    },
});

export default memo(Popover);
