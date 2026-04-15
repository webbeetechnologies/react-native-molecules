import {
    cloneElement,
    Fragment,
    memo,
    type ReactElement,
    type ReactNode,
    type Ref,
    useContext,
    useMemo,
    useRef,
} from 'react';
import { Pressable, type PressableProps, type StyleProp, View, type ViewStyle } from 'react-native';
import { ScopedTheme, UnistylesRuntime } from 'react-native-unistyles';

import { mergeRefs } from '../../utils';
import { Portal } from '../Portal';
import {
    DEFAULT_ARROW_SIZE,
    PopoverContext,
    PopoverPanelContext,
    type PopoverPanelContextValue,
    type PopoverProps,
    useArrowStyles,
    usePopover,
} from './common';
import { createPopoverRoot } from './PopoverRoot';
import { usePlatformMeasure } from './usePlatformMeasure';
import { popoverStyles } from './utils';

type PopoverPanelProps = PopoverProps & {
    overlay?: ReactNode;
};

const PopoverPanel = ({
    triggerRef,
    children,
    isOpen,
    onClose,
    position = 'bottom',
    align = 'center',
    style,
    inverted = false,
    // @ts-ignore
    dataSet,
    offset = 8,
    horizontalOffset = 0,
    triggerDimensions,
    overlay,
    ...rest
}: PopoverPanelProps) => {
    const {
        popoverLayoutRef,
        targetLayoutRef,
        actualPositionRef,
        calculatedPosition,
        calculateAndSetPosition,
        handlePopoverLayout,
    } = usePopover({ isOpen, position, align, offset, horizontalOffset });

    const popoverRef = useRef<View>(null);

    const { popoverStyle } = usePlatformMeasure({
        triggerRef,
        isOpen,
        onClose,
        calculatedPosition,
        calculateAndSetPosition,
        targetLayoutRef,
        popoverRef,
        triggerDimensions,
    });

    const panelContextValue = useMemo<PopoverPanelContextValue>(
        () => ({
            calculatedPosition,
            targetLayoutRef,
            popoverLayoutRef,
            actualPositionRef,
            containerStyle: style,
        }),
        [calculatedPosition, targetLayoutRef, popoverLayoutRef, actualPositionRef, style],
    );

    const Wrapper = inverted ? ScopedTheme : Fragment;
    const WrapperProps = inverted
        ? { name: UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark', reset: false }
        : {};

    if (!isOpen && popoverStyle.opacity === 0) {
        return null;
    }

    return (
        <Portal>
            <PopoverPanelContext value={panelContextValue}>
                <Wrapper {...(WrapperProps as any)}>
                    {overlay}
                    <View
                        onLayout={handlePopoverLayout}
                        style={[popoverStyles.popoverContainer, style, popoverStyle]}
                        {...{ dataSet }}
                        {...rest}
                        ref={popoverRef}>
                        {children}
                    </View>
                </Wrapper>
            </PopoverPanelContext>
        </Portal>
    );
};

type PopoverTriggerProps = {
    children: ReactElement;
    ref?: Ref<any>;
    triggerRef?: Ref<any>;
};

export const PopoverTrigger = memo(
    ({ children, ref: refProp, triggerRef: triggerRefProp }: PopoverTriggerProps) => {
        const { triggerRef } = useContext(PopoverContext);
        const mergedRef = useMemo(
            () => mergeRefs([triggerRef, refProp, triggerRefProp]),
            [triggerRef, refProp, triggerRefProp],
        );
        return cloneElement(children as ReactElement<{ ref?: unknown }>, { ref: mergedRef });
    },
);
PopoverTrigger.displayName = 'Popover_Trigger';

export const PopoverContent = memo(({ children }: { children?: ReactNode }) => <>{children}</>);
PopoverContent.displayName = 'Popover_Content';

export const PopoverOverlay = memo(({ style, onPress, ...rest }: PressableProps) => {
    const { isOpen, onClose } = useContext(PopoverContext);
    if (!isOpen) return null;
    return (
        <Pressable
            {...rest}
            onPress={onPress ?? onClose}
            style={[popoverStyles.overlay, style as StyleProp<ViewStyle>]}
        />
    );
});
PopoverOverlay.displayName = 'Popover_Overlay';

type PopoverArrowProps = {
    size?: number;
    style?: StyleProp<ViewStyle>;
};

export const PopoverArrow = memo(({ size = DEFAULT_ARROW_SIZE, style }: PopoverArrowProps) => {
    const {
        calculatedPosition,
        targetLayoutRef,
        popoverLayoutRef,
        actualPositionRef,
        containerStyle,
    } = useContext(PopoverPanelContext);

    const arrowStyles = useArrowStyles({
        arrowSize: size,
        containerStyle,
        calculatedPosition,
        targetLayoutRef,
        popoverLayoutRef,
        actualPositionRef,
    });

    if (!arrowStyles || Object.keys(arrowStyles).length === 0) return null;
    return <View style={[arrowStyles, style]} />;
});

PopoverArrow.displayName = 'Popover_Arrow';

export default memo(createPopoverRoot(PopoverPanel));
