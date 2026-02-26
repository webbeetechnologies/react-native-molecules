import {
    createContext,
    memo,
    type ReactElement,
    type RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';

import { useToggle } from '../../hooks';
import { extractSubcomponents } from '../../utils/extractSubcomponents';

export type Props = {
    fadeInDelay?: number;
    fadeOutDelay?: number;
    hoverableContent?: boolean;
    children: ReactElement | ReactElement[];
};

export type TooltipContextValue = {
    isOpen: boolean;
    triggerRef: RefObject<any>;
    onOpen: () => void;
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

export const TooltipContext = createContext<TooltipContextValue>({
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
    triggerRef: { current: null },
});

const Tooltip = ({
    children,
    fadeInDelay = 100,
    fadeOutDelay = 300,
    hoverableContent = false,
}: Props) => {
    const { state: isOpen, setState: setIsOpen } = useToggle(false);
    const triggerRef = useRef(null);
    const timeOutRef = useRef<NodeJS.Timeout>(undefined);
    const preventCloseRef = useRef(false);

    const {
        Tooltip_Trigger,
        Tooltip_Content,
        rest: restChildren,
    } = extractSubcomponents({
        children,
        allowedChildren: [
            { name: 'Tooltip_Trigger', allowMultiple: false },
            { name: 'Tooltip_Content', allowMultiple: false },
        ],
        includeRest: true,
    });

    const onClose = useCallback(() => {
        if (preventCloseRef.current) return;
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => setIsOpen(false), fadeOutDelay);
    }, [fadeOutDelay, setIsOpen]);

    const onOpen = useCallback(() => {
        clearTimeout(timeOutRef.current);
        timeOutRef.current = setTimeout(() => setIsOpen(true), fadeInDelay);
    }, [fadeInDelay, setIsOpen]);

    const contextValue = useMemo<TooltipContextValue>(
        () => ({
            isOpen,
            triggerRef,
            onOpen,
            onClose,
            ...(hoverableContent
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
                : {}),
        }),
        [hoverableContent, isOpen, onClose, onOpen, setIsOpen],
    );

    useEffect(() => {
        return () => {
            clearTimeout(timeOutRef.current);
        };
    }, []);

    return (
        <TooltipContext.Provider value={contextValue}>
            {Tooltip_Trigger}
            {Tooltip_Content}
            {restChildren}
        </TooltipContext.Provider>
    );
};

export default memo(Tooltip);
