import { type RefObject, useRef } from 'react';

export type UseActionStateProps = {
    pressed?: boolean;
    hovered?: boolean;
    focused?: boolean;
    actionsToListen?: ('pressed' | 'hovered' | 'focused')[];
};

export const useActionState = (
    props: UseActionStateProps & { ref?: RefObject<any> | React.ForwardedRef<any> } = {},
) => {
    const ref = useRef(null);
    const actionsRef = (props.ref ?? ref) as RefObject<any>;

    return {
        actionsRef,
        hovered: false,
        pressed: false,
        focused: false,
    };
};
