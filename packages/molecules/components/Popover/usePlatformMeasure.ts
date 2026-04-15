import { type RefObject, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import type { LayoutRectangle, View, ViewStyle } from 'react-native';

import { popoverDefaultStyles } from './common';

export type UsePlatformMeasureArgs = {
    triggerRef: RefObject<View | any> | undefined;
    isOpen: boolean;
    onClose?: () => void;
    calculatedPosition: ViewStyle | null;
    calculateAndSetPosition: () => void;
    targetLayoutRef: RefObject<LayoutRectangle | null>;
    popoverRef: RefObject<View | null>;
    triggerDimensions?: { width: number; height: number } | null;
};

export type UsePlatformMeasureResult = {
    /** Platform-adjusted popover position (includes scroll offset on web) */
    popoverStyle: ViewStyle;
};

export const usePlatformMeasure = ({
    triggerRef,
    isOpen,
    onClose,
    calculatedPosition,
    calculateAndSetPosition,
    targetLayoutRef,
    popoverRef,
    triggerDimensions,
}: UsePlatformMeasureArgs): UsePlatformMeasureResult => {
    const measureTarget = useCallback(() => {
        if (triggerRef?.current) {
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
            if (triggerRef?.current && isOpen) {
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
        if (!isOpen || !onClose) return;
        const handleClickOutside = (event: MouseEvent) => {
            const popoverElement = popoverRef.current as any as HTMLElement;
            const targetElement = triggerRef?.current as any as HTMLElement;
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
    }, [isOpen, onClose, popoverRef, triggerRef]);

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

    return { popoverStyle };
};
