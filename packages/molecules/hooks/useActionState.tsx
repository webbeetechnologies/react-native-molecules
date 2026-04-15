import { type RefObject, useCallback, useRef } from 'react';

import { useActive } from './useActive';
import { useFocus } from './useFocus';
import { useHover } from './useHover';

export type UseActionStateProps = {
    pressed?: boolean;
    hovered?: boolean;
    focused?: boolean;
    actionsToListen?: ('press' | 'hover' | 'focus')[];
};

export const useActionState = (
    props: UseActionStateProps & { ref?: RefObject<any> | React.ForwardedRef<any> } = {},
) => {
    const internalRef = useRef(null);
    const externalRef = props.ref;

    const actionsRef = useCallback(
        (node: any) => {
            internalRef.current = node;
            if (typeof externalRef === 'function') {
                externalRef(node);
            } else if (externalRef) {
                (externalRef as RefObject<any>).current = node;
            }
        },
        [externalRef],
    ) as unknown as RefObject<any>;

    const hovered =
        useHover(internalRef, props.actionsToListen?.includes('hover')) || !!props.hovered;
    const pressed =
        useActive(internalRef, props.actionsToListen?.includes('press')) || !!props.pressed;
    const focused =
        useFocus(internalRef, props.actionsToListen?.includes('focus')) || !!props.focused;

    return {
        actionsRef,
        hovered,
        pressed,
        focused,
    };
};
