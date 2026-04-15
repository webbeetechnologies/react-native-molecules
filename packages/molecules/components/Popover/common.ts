import type { ReactNode, RefObject } from 'react';
import { createContext } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutRectangle, StyleProp, View, ViewStyle } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';

export type Position = 'top' | 'left' | 'right' | 'bottom';
export type Align = 'start' | 'center' | 'end';

export const DEFAULT_ARROW_SIZE = 10;

export const popoverDefaultStyles = {
    position: 'absolute' as const,
    top: -9999,
    left: -9999,
    opacity: 0,
};

export type PopoverContextValue = {
    triggerRef: RefObject<View | any>;
    isOpen: boolean;
    onClose?: () => void;
};

export const PopoverContext = createContext<PopoverContextValue>({
    isOpen: false,
    triggerRef: { current: null },
});

export type PopoverPanelContextValue = {
    calculatedPosition: ViewStyle | null;
    targetLayoutRef: RefObject<LayoutRectangle | null>;
    popoverLayoutRef: RefObject<LayoutRectangle | null>;
    actualPositionRef: RefObject<Position | undefined>;
    containerStyle?: StyleProp<ViewStyle>;
};

export const PopoverPanelContext = createContext<PopoverPanelContextValue>({
    calculatedPosition: null,
    targetLayoutRef: { current: null },
    popoverLayoutRef: { current: null },
    actualPositionRef: { current: undefined },
});

export type PopoverProps = {
    inverted?: boolean;
    /** Reference to the element the popover should anchor to */
    triggerRef?: RefObject<View | any>;
    /** Content to display inside the popover */
    children: ReactNode;
    /** Whether the popover is visible */
    isOpen: boolean;
    /** Callback when the popover requests to be closed */
    onClose?: () => void;
    /** Preferred position of the popover relative to the target */
    position?: Position;
    /** Alignment of the popover relative to the target */
    align?: Align;
    /** Optional style for the popover container */
    style?: StyleProp<ViewStyle>;
    /** Gap between the popover and the trigger along the main axis */
    offset?: number;
    /** Additional horizontal shift applied to the popover (positive = right) */
    horizontalOffset?: number;
    /** Optional trigger dimensions to trigger re-measurement when changed */
    triggerDimensions?: { width: number; height: number } | null;
};

// --- Positioning Helper Functions ---

export const getInitialPosition = (
    position: PopoverProps['position'],
    align: PopoverProps['align'],
    targetLayout: LayoutRectangle,
    popoverLayout: LayoutRectangle,
    effectiveArrowSize: number,
): { top: number; left: number } => {
    const { x: targetX, y: targetY, width: targetWidth, height: targetHeight } = targetLayout;
    const { width: popoverWidth, height: popoverHeight } = popoverLayout;
    let top = 0;
    let left = 0;

    switch (position) {
        case 'top':
            top = targetY - popoverHeight - effectiveArrowSize;
            break;
        case 'bottom':
            top = targetY + targetHeight + effectiveArrowSize;
            break;
        case 'left':
            left = targetX - popoverWidth - effectiveArrowSize;
            break;
        case 'right':
            left = targetX + targetWidth + effectiveArrowSize;
            break;
    }

    switch (position) {
        case 'top':
        case 'bottom':
            switch (align) {
                case 'start':
                    left = targetX;
                    break;
                case 'center':
                    left = targetX + targetWidth / 2 - popoverWidth / 2;
                    break;
                case 'end':
                    left = targetX + targetWidth - popoverWidth;
                    break;
            }
            break;
        case 'left':
        case 'right':
            switch (align) {
                case 'start':
                    top = targetY;
                    break;
                case 'center':
                    top = targetY + targetHeight / 2 - popoverHeight / 2;
                    break;
                case 'end':
                    top = targetY + targetHeight - popoverHeight;
                    break;
            }
            break;
    }

    return { top, left };
};

export const adjustPositionForBoundaries = (
    currentPosition: PopoverProps['position'],
    top: number,
    left: number,
    targetLayout: LayoutRectangle,
    popoverLayout: LayoutRectangle,
    screenHeight: number,
    screenWidth: number,
    effectiveArrowSize: number,
): { finalTop: number; finalLeft: number; finalPosition: PopoverProps['position'] } => {
    const { x: targetX, y: targetY, width: targetWidth, height: targetHeight } = targetLayout;
    const { width: popoverWidth, height: popoverHeight } = popoverLayout;
    let adjustedPosition = currentPosition;
    let adjustedTop = top;
    let adjustedLeft = left;

    // Check vertical adjustments
    if (
        adjustedPosition === 'top' &&
        adjustedTop < 0 &&
        targetY + targetHeight + popoverHeight + effectiveArrowSize <= screenHeight
    ) {
        adjustedPosition = 'bottom';
        adjustedTop = targetY + targetHeight + effectiveArrowSize;
    } else if (
        adjustedPosition === 'bottom' &&
        adjustedTop + popoverHeight > screenHeight &&
        targetY - popoverHeight - effectiveArrowSize >= 0
    ) {
        adjustedPosition = 'top';
        adjustedTop = targetY - popoverHeight - effectiveArrowSize;
    }

    // Check horizontal adjustments
    if (
        adjustedPosition === 'left' &&
        adjustedLeft < 0 &&
        targetX + targetWidth + popoverWidth + effectiveArrowSize <= screenWidth
    ) {
        adjustedPosition = 'right';
        adjustedLeft = targetX + targetWidth + effectiveArrowSize;
    } else if (
        adjustedPosition === 'right' &&
        adjustedLeft + popoverWidth > screenWidth &&
        targetX - popoverWidth - effectiveArrowSize >= 0
    ) {
        adjustedPosition = 'left';
        adjustedLeft = targetX - popoverWidth - effectiveArrowSize;
    }

    // Final clamping to screen bounds
    const finalTop = Math.max(0, Math.min(adjustedTop, screenHeight - popoverHeight));
    const finalLeft = Math.max(0, Math.min(adjustedLeft, screenWidth - popoverWidth));

    return { finalTop, finalLeft, finalPosition: adjustedPosition };
};

// --- Arrow Style Hook ---

interface UseArrowStylesProps {
    arrowSize: number;
    containerStyle?: StyleProp<ViewStyle>;
    calculatedPosition: ViewStyle | null;
    targetLayoutRef: RefObject<LayoutRectangle | null>;
    popoverLayoutRef: RefObject<LayoutRectangle | null>;
    actualPositionRef: RefObject<Position | undefined>;
}

// Define a base style for the popover container to extract default background
const basePopoverStyle = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        zIndex: 100,
    },
});

export const useArrowStyles = ({
    arrowSize,
    containerStyle,
    calculatedPosition,
    targetLayoutRef,
    popoverLayoutRef,
    actualPositionRef,
}: UseArrowStylesProps): ViewStyle => {
    return useMemo(() => {
        if (
            !targetLayoutRef.current ||
            !popoverLayoutRef.current ||
            !calculatedPosition ||
            calculatedPosition.opacity !== 1 ||
            !actualPositionRef.current
        )
            return {};

        const popoverX = calculatedPosition.left as number;
        const popoverY = calculatedPosition.top as number;
        const { width: popoverWidth, height: popoverHeight } = popoverLayoutRef.current;
        const {
            x: targetX,
            y: targetY,
            width: targetWidth,
            height: targetHeight,
        } = targetLayoutRef.current;

        const arrowHalfSize = arrowSize / 2;
        const popoverStyleFlat = StyleSheet.flatten(containerStyle || {});
        const containerStyleFlat = StyleSheet.flatten(basePopoverStyle.container);

        const backgroundColor =
            popoverStyleFlat.backgroundColor || containerStyleFlat.backgroundColor;
        const zIndex = popoverStyleFlat.zIndex ?? containerStyleFlat.zIndex;

        const baseArrowStyle: ViewStyle = {
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            backgroundColor: 'transparent',
            zIndex: typeof zIndex === 'number' ? zIndex + 1 : 101, // Ensure arrow is above popover
        };

        let arrowTop = 0;
        let arrowLeft = 0;

        switch (actualPositionRef.current) {
            case 'bottom':
                arrowTop = -arrowSize; // Relative to popover container
                arrowLeft = Math.max(
                    arrowHalfSize,
                    Math.min(
                        targetX + targetWidth / 2 - popoverX - arrowHalfSize,
                        popoverWidth - arrowHalfSize * 2,
                    ),
                );
                return {
                    ...baseArrowStyle,
                    top: arrowTop,
                    left: arrowLeft,
                    borderTopWidth: 0,
                    borderRightWidth: arrowHalfSize,
                    borderBottomWidth: arrowSize,
                    borderLeftWidth: arrowHalfSize,
                    borderRightColor: 'transparent',
                    borderBottomColor: backgroundColor,
                    borderLeftColor: 'transparent',
                };
            case 'top':
                arrowTop = popoverHeight; // Relative to popover container
                arrowLeft = Math.max(
                    arrowHalfSize,
                    Math.min(
                        targetX + targetWidth / 2 - popoverX - arrowHalfSize,
                        popoverWidth - arrowHalfSize * 2,
                    ),
                );
                return {
                    ...baseArrowStyle,
                    top: arrowTop,
                    left: arrowLeft,
                    borderTopWidth: arrowSize,
                    borderRightWidth: arrowHalfSize,
                    borderBottomWidth: 0,
                    borderLeftWidth: arrowHalfSize,
                    borderTopColor: backgroundColor,
                    borderRightColor: 'transparent',
                    borderLeftColor: 'transparent',
                };
            case 'right':
                arrowLeft = -arrowSize; // Relative to popover container
                arrowTop = Math.max(
                    arrowHalfSize,
                    Math.min(
                        targetY + targetHeight / 2 - popoverY - arrowHalfSize,
                        popoverHeight - arrowHalfSize * 2,
                    ),
                );
                return {
                    ...baseArrowStyle,
                    top: arrowTop,
                    left: arrowLeft,
                    borderTopWidth: arrowHalfSize,
                    borderRightWidth: arrowSize,
                    borderBottomWidth: arrowHalfSize,
                    borderLeftWidth: 0,
                    borderTopColor: 'transparent',
                    borderRightColor: backgroundColor,
                    borderBottomColor: 'transparent',
                };
            case 'left':
                arrowLeft = popoverWidth; // Relative to popover container
                arrowTop = Math.max(
                    arrowHalfSize,
                    Math.min(
                        targetY + targetHeight / 2 - popoverY - arrowHalfSize,
                        popoverHeight - arrowHalfSize * 2,
                    ),
                );
                return {
                    ...baseArrowStyle,
                    top: arrowTop,
                    left: arrowLeft,
                    borderTopWidth: arrowHalfSize,
                    borderRightWidth: 0,
                    borderBottomWidth: arrowHalfSize,
                    borderLeftWidth: arrowSize,
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderLeftColor: backgroundColor,
                };
            default:
                return {};
        }
    }, [
        arrowSize,
        containerStyle,
        calculatedPosition,
        targetLayoutRef,
        popoverLayoutRef,
        actualPositionRef,
    ]);
};

// --- Core Popover Logic Hook ---

interface UsePopoverProps {
    isOpen: boolean;
    position: Position | undefined;
    align: Align | undefined;
    offset?: number;
    horizontalOffset?: number;
}

export const usePopover = ({
    isOpen,
    position = 'bottom',
    align = 'center',
    offset = 0,
    horizontalOffset = 0,
}: UsePopoverProps) => {
    const popoverLayoutRef = useRef<LayoutRectangle | null>(null);
    const targetLayoutRef = useRef<LayoutRectangle | null>(null);
    const actualPositionRef = useRef<Position | undefined>(position);
    const [calculatedPosition, setCalculatedPosition] = useState<ViewStyle>(popoverDefaultStyles);

    const calculateAndSetPosition = useCallback(() => {
        if (!targetLayoutRef.current || !popoverLayoutRef.current) {
            setCalculatedPosition(popoverDefaultStyles);
            return;
        }

        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

        let { top: initialTop, left: initialLeft } = getInitialPosition(
            position,
            align,
            targetLayoutRef.current,
            popoverLayoutRef.current,
            0,
        );

        switch (position) {
            case 'top':
                initialTop -= offset;
                break;
            case 'bottom':
                initialTop += offset;
                break;
            case 'left':
                initialLeft -= offset;
                break;
            case 'right':
                initialLeft += offset;
                break;
        }

        initialLeft += horizontalOffset;

        const { finalTop, finalLeft, finalPosition } = adjustPositionForBoundaries(
            position,
            initialTop,
            initialLeft,
            targetLayoutRef.current,
            popoverLayoutRef.current,
            screenHeight,
            screenWidth,
            0,
        );

        actualPositionRef.current = finalPosition;

        setCalculatedPosition({
            position: 'absolute',
            top: finalTop,
            left: finalLeft,
            opacity: 1,
        });
    }, [position, align, offset, horizontalOffset]);

    const handlePopoverLayout = useCallback(
        (event: { nativeEvent: { layout: LayoutRectangle } }) => {
            const layout = event.nativeEvent.layout;
            if (layout.width > 0 && layout.height > 0) {
                const changed =
                    !popoverLayoutRef.current ||
                    popoverLayoutRef.current.width !== layout.width ||
                    popoverLayoutRef.current.height !== layout.height;
                if (changed) {
                    popoverLayoutRef.current = layout;
                    // Trigger recalculation after popover layout is known/updated
                    calculateAndSetPosition();
                }
            }
        },
        [calculateAndSetPosition],
    );

    // Effect to recalculate position if relevant props change while open
    useEffect(() => {
        if (isOpen) {
            calculateAndSetPosition();
        }
        // This effect specifically handles prop changes
    }, [isOpen, position, align, calculateAndSetPosition]);

    // Effect to reset layout refs when popover is closed
    useEffect(() => {
        if (!isOpen) {
            targetLayoutRef.current = null;
            popoverLayoutRef.current = null;
            // Optionally reset calculatedPosition here too, though the initial measure effect also handles hiding
            setCalculatedPosition(popoverDefaultStyles);
        }
    }, [isOpen]);

    return {
        popoverLayoutRef,
        targetLayoutRef,
        actualPositionRef,
        calculatedPosition,
        calculateAndSetPosition, // Expose for measureTarget
        handlePopoverLayout, // Expose for onLayout prop
        setCalculatedPosition, // Expose for direct hiding if needed
    };
};
