import { useCallback, useMemo, useState } from 'react';

const useToggle = (initialState = false) => {
    const [state, setState] = useState<boolean>(initialState);

    const toggle = useCallback(() => setState(prevState => !prevState), []);

    const handleClose = useCallback(() => setState(false), [setState]);

    const handleOpen = useCallback(() => setState(true), [setState]);

    return useMemo(
        () => ({
            state,
            onToggle: toggle,
            setState,
            handleOpen,
            handleClose,
        }),
        [state, toggle, setState, handleOpen, handleClose],
    );
};

export default useToggle;
