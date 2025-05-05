import { RefObject, useRef } from 'react';
import { useHover } from './useHover';
import { useActive } from './useActive';
import { useFocus } from './useFocus';

export type UseActionStateProps = {
    pressed?: boolean;
    hovered?: boolean;
    focused?: boolean;
    actionsToListen?: ('press' | 'hover' | 'focus')[];
};

export const useActionState = (
    props: UseActionStateProps & { ref?: RefObject<any> | React.ForwardedRef<any> } = {},
) => {
    const ref = useRef(null);
    const actionsRef = (
        (props.ref as any)?.current === undefined ? ref : props.ref
    ) as RefObject<any>;
    const hovered =
        useHover(actionsRef, props.actionsToListen?.includes('hover')) || !!props.hovered;
    const pressed =
        useActive(actionsRef, props.actionsToListen?.includes('press')) || !!props.pressed;
    const focused =
        useFocus(actionsRef, props.actionsToListen?.includes('focus')) || !!props.focused;

    return {
        actionsRef,
        hovered,
        pressed,
        focused,
    };
};
