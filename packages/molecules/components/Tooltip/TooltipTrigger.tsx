import {
    cloneElement,
    memo,
    type ReactElement,
    type RefAttributes,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
} from 'react';
import { Platform } from 'react-native';

import { useActionState } from '../../hooks';
import { TooltipContext } from './Tooltip';

export type Props = {
    children: ReactElement;
};

const TooltipTrigger = memo(({ children }: { children: ReactElement }) => {
    const isWeb = Platform.OS === 'web';
    const { onOpen, onClose, triggerRef } = useContext(TooltipContext);
    const { hovered, actionsRef } = useActionState({ ref: triggerRef, actionsToListen: ['hover'] });

    // this will make sure children's ref is not overwritten by the triggerRef
    useImperativeHandle(
        // @ts-ignore
        (children as ReactElement & RefAttributes<any>)?.ref,
        () => triggerRef?.current,
    );

    const onPress = useCallback(() => {
        // @ts-ignore
        children?.props?.onPress?.();
    }, [children?.props]);

    const onLongPress = useCallback(() => {
        // @ts-ignore
        children?.props?.onLongPress?.();

        if (isWeb) return;
        onOpen();
    }, [children?.props, isWeb, onOpen]);

    const onPressOut = useCallback(() => {
        // @ts-ignore

        children?.props?.onPressOut?.();

        if (isWeb) return;
        onClose();
    }, [children?.props, isWeb, onClose]);

    const onHoverIn = useCallback(() => {
        // @ts-ignore
        children?.props?.onHoverIn?.();

        onOpen();
    }, [children?.props, onOpen]);

    const onHoverOut = useCallback(() => {
        // @ts-ignore
        children?.props?.onHoverOut?.();

        onClose();
    }, [onClose, children?.props]);

    useEffect(() => {
        if (!isWeb) return;

        if (hovered) {
            onHoverIn();
            return;
        }

        onHoverOut();
    }, [hovered, isWeb, onHoverIn, onHoverOut]);

    return useMemo(
        () =>
            cloneElement(children, {
                // @ts-ignore
                ref: actionsRef,
                onLongPress,
                onPressOut,
                onPress,
            }),
        [children, onLongPress, onPress, onPressOut, actionsRef],
    );
});

TooltipTrigger.displayName = 'Tooltip_Trigger';
export default TooltipTrigger;
