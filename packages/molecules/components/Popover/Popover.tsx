import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { ScopedTheme, StyleSheet, UnistylesRuntime } from 'react-native-unistyles';

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
    // @ts-ignore
    dataSet,
    withBackdropDismiss = false,
    offset = 8,
    backdropStyles,
    triggerDimensions,
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
            triggerRef.current.measureInWindow(
                (x: number, y: number, width: number, height: number) => {
                    if (width !== 0 || height !== 0) {
                        const newLayout = { x, y, width, height };
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
            );
        } else {
            targetLayoutRef.current = null;
            calculateAndSetPosition();
        }
    }, [triggerRef, calculateAndSetPosition, targetLayoutRef]);

    useLayoutEffect(() => {
        if (isOpen) {
            const timeoutId = setTimeout(measureTarget, 0);
            return () => clearTimeout(timeoutId);
        }
        return;
    }, [isOpen, measureTarget, triggerDimensions]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        const handleResize = () => {
            if (triggerRef.current && isOpen) {
                window.requestAnimationFrame(measureTarget);
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
        };
    }, [isOpen, measureTarget, triggerRef]);

    useEffect(() => {
        if (!isOpen || !onClose || withBackdropDismiss) return;
        const handleClickOutside = (event: MouseEvent) => {
            const popoverElement = popoverRef.current as any as HTMLElement;
            const targetElement = triggerRef.current as any as HTMLElement;
            if (
                popoverElement &&
                !popoverElement.contains(event.target as Node) &&
                targetElement &&
                !targetElement.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside, { capture: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, { capture: true });
        };
    }, [isOpen, onClose, popoverRef, triggerRef, withBackdropDismiss]);

    const arrowStyles = useArrowStyles({
        showArrow,
        arrowSize,
        style,
        calculatedPosition,
        targetLayoutRef,
        popoverLayoutRef,
        actualPositionRef,
    });

    const popoverStyle = useMemo(() => {
        if (!calculatedPosition) return popoverDefaultStyles;

        const scrollX = window.scrollX ?? window.pageXOffset ?? 0;
        const scrollY = window.scrollY ?? window.pageYOffset ?? 0;

        return {
            ...calculatedPosition,
            left: (calculatedPosition.left as number) + scrollX,
            top: (calculatedPosition.top as number) + scrollY,
        };
    }, [calculatedPosition]);

    const Wrapper = inverted ? ScopedTheme : Fragment;
    const WrapperProps = inverted
        ? { name: UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark', reset: false }
        : {};

    if (!isOpen && popoverStyle.opacity === 0) {
        return null;
    }

    return (
        <Portal>
            <Wrapper {...(WrapperProps as any)}>
                {withBackdropDismiss && (
                    <Pressable style={[styles.backdrop, backdropStyles]} onPress={onClose} />
                )}
                <View
                    onLayout={handlePopoverLayout}
                    style={[styles.popoverContainer, style, popoverStyle]}
                    {...{ dataSet }}
                    {...rest}
                    ref={popoverRef}>
                    {children}
                    {showArrow && popoverStyle.opacity === 1 && <View style={arrowStyles} />}
                </View>
            </Wrapper>
        </Portal>
    );
};

const styles = StyleSheet.create(theme => ({
    popoverContainer: {
        ...popoverDefaultStyles,
        backgroundColor: theme.colors.surface,
        borderRadius: 4,
        shadowColor: 'rgba(0, 0, 0, 1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.dark ? 0.7 : 0.3,
        shadowRadius: 10,
        zIndex: 100,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        _web: {
            cursor: 'default',
        },
    },
}));

export default memo(Popover);
