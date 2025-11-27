import {
    createContext,
    memo,
    type ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { Text, type ViewProps, type ViewStyle } from 'react-native';

import { useSubcomponents, useToggle } from '../../hooks';
import { Popover, type PopoverProps } from '../Popover';
import { tooltipStyles } from './utils';

export type Props = Omit<PopoverProps, 'isOpen' | 'triggerRef'> & {
    fadeInDelay?: number;
    fadeOutDelay?: number;
    showArrow?: boolean;
    style?: ViewStyle;
    children: ReactElement | ReactElement[];
    hoverableContent?: boolean;
};

const Tooltip = ({
    style,
    children,
    fadeInDelay = 100,
    fadeOutDelay = 300,
    showArrow = false,
    hoverableContent = false,
    ...rest
}: Props) => {
    const { state: isOpen, setState: setIsOpen } = useToggle(false);
    const triggerRef = useRef(null);
    const timeOutRef = useRef<NodeJS.Timeout>(undefined);
    const popoverTimeoutRef = useRef<NodeJS.Timeout>(undefined);
    const preventCloseRef = useRef(false);

    const onClose = useCallback(() => {
        if (preventCloseRef.current) return;
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => setIsOpen(false), fadeOutDelay);
    }, [fadeOutDelay, setIsOpen]);

    const onOpen = useCallback(() => {
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => setIsOpen(true), fadeInDelay);
    }, [fadeInDelay, setIsOpen]);

    // const setPopoverOpen = useCallback(
    //     (_isOpen: boolean) => {
    //         clearTimeout(popoverTimeoutRef.current);
    //         popoverTimeoutRef.current = setTimeout(
    //             () => setIsOpen(_isOpen),
    //             isOpen ? fadeInDelay : fadeOutDelay,
    //         );
    //     },
    //     [fadeInDelay, fadeOutDelay, isOpen, setIsOpen],
    // );

    const { Tooltip_Trigger, Tooltip_Content } = useSubcomponents({
        children,
        allowedChildren: ['Tooltip_Trigger', 'Tooltip_Content'],
    });

    const contextValue = useMemo(
        () => ({
            triggerRef,
            onOpen,
            onClose,
        }),
        [onClose, onOpen],
    );

    const { popoverContentProps, popoverStyle } = useMemo(
        () => ({
            popoverContentProps: (hoverableContent
                ? {
                      onMouseEnter: () => {
                          preventCloseRef.current = true;
                          clearTimeout(timeOutRef.current);
                          setIsOpen(true);
                      },
                      onMouseLeave: () => {
                          preventCloseRef.current = false;
                          clearTimeout(timeOutRef.current);
                          setIsOpen(false);
                      },
                  }
                : {}) as ViewProps,
            popoverStyle: [tooltipStyles.content, style],
        }),
        [hoverableContent, setIsOpen, style],
    );

    useEffect(() => {
        const popoverTimeout = popoverTimeoutRef;

        return () => {
            clearTimeout(timeOutRef.current);
            clearTimeout(popoverTimeout.current);
        };
    }, []);

    return (
        <TooltipContext.Provider value={contextValue}>
            {Tooltip_Trigger[0]}
            {isOpen && (
                <Popover
                    isOpen={isOpen}
                    inverted
                    // placement={placement}
                    showArrow={showArrow}
                    // backdropStyles={styles.backdrop}
                    triggerRef={triggerRef}
                    // setIsOpen={setPopoverOpen}
                    {...popoverContentProps}
                    {...rest}
                    style={popoverStyle}
                    // contentTextStyles={contentTextStyles}
                    // popoverContentProps={popoverContentProps}
                    onClose={onClose}>
                    <Text style={tooltipStyles.contentText}>{Tooltip_Content[0]}</Text>
                </Popover>
            )}
        </TooltipContext.Provider>
    );
};

export const TooltipContext = createContext({
    onOpen: () => {},
    onClose: () => {},
    triggerRef: null as any,
});

export default memo(Tooltip);
