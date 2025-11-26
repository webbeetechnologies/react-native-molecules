import { useMemo } from 'react';
import Toast, { type ToastConfig, type ToastProps } from 'react-native-toast-message';

import MaterialToast from './MaterialToast';

export type Props = ToastProps;

const ToastContainer = ({ config, ...rest }: ToastProps) => {
    const toastConfig = useMemo(
        () =>
            ({
                material: MaterialToast,
                ...config,
            } as ToastConfig),
        [config],
    );

    return <Toast config={toastConfig} type="material" position="bottom" {...rest} />;
};

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
