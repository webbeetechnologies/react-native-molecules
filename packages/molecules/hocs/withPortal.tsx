import { type ComponentType } from 'react';

import { Portal } from '../components/Portal';

const withPortal =
    <T,>(Component: ComponentType<T>) =>
    (props: T) => {
        return (
            <Portal>
                {/* @ts-ignore */}
                <Component {...(props as T)} />
            </Portal>
        );
    };

export default withPortal;
