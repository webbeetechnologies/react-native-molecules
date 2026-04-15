import { useCallback, useEffect, useLayoutEffect } from 'react';
import { AppState, Dimensions, Platform } from 'react-native';

import { popoverDefaultStyles } from './common';
import type { UsePlatformMeasureArgs, UsePlatformMeasureResult } from './usePlatformMeasure';

export const usePlatformMeasure = ({
    triggerRef,
    isOpen,
    calculatedPosition,
    calculateAndSetPosition,
    targetLayoutRef,
    triggerDimensions,
}: UsePlatformMeasureArgs): UsePlatformMeasureResult => {
    const measureTarget = useCallback(() => {
        if (triggerRef?.current) {
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

    return {
        popoverStyle: (calculatedPosition ?? popoverDefaultStyles) as any,
    };
};
