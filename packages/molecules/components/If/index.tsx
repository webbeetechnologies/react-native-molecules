import type { PropsWithChildren } from 'react';

import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';

const IfDefault = (props: PropsWithChildren<{ shouldRender?: boolean }>) => {
    return <>{!!props.shouldRender && props.children}</>;
};

registerMoleculesComponents({
    If: IfDefault,
});

export const If = getRegisteredComponentWithFallback('If', IfDefault);
