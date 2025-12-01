import type { PropsWithChildren } from 'react';

import { getRegisteredComponentWithFallback } from '../../core';

const IfDefault = (props: PropsWithChildren<{ shouldRender?: boolean }>) => {
    return <>{!!props.shouldRender && props.children}</>;
};

export const If = getRegisteredComponentWithFallback('If', IfDefault);
