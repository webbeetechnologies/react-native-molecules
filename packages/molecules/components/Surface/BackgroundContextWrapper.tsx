import { memo, type ReactNode, useContext, useMemo } from 'react';

import { useContrastColor } from '../../hooks/useContrastColor';
import { BackgroundContext } from '../../utils/backgroundContext';

export const BackgroundContextWrapper = memo(
    ({ backgroundColor, children }: { backgroundColor: string; children: ReactNode }) => {
        const contrastColor = useContrastColor(backgroundColor, undefined, undefined);

        const parentContext = useContext(BackgroundContext);
        const isTransparent = backgroundColor === 'transparent';

        const surfaceContextValue = useMemo(
            () => ({
                backgroundColor,
                color: contrastColor,
            }),
            [backgroundColor, contrastColor],
        );

        return (
            <BackgroundContext.Provider value={isTransparent ? parentContext : surfaceContextValue}>
                {children}
            </BackgroundContext.Provider>
        );
    },
);
