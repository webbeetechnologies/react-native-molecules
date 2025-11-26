import { Children, cloneElement, isValidElement, memo, type ReactNode, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { IconProps } from '../Icon';
import { Modal, type ModalProps } from '../Modal';
import DialogIcon from './DialogIcon';
import { dialogStyles } from './utils';

export type Props = ModalProps & {
    /**
     * Callback that is called when the user dismisses the dialog.
     */
    onClose?: () => void;
    /**
     * Determines Whether the dialog is visible.
     */
    isOpen: boolean;
    /**
     * Content of the `Dialog`.
     */
    children: ReactNode;
    iconProps?: IconProps;
    style?: StyleProp<ViewStyle>;
};

const emptyObj = {};

const Dialog = ({ children, onClose, iconProps, style = emptyObj, ...rest }: Props) => {
    const { containerStyle, childStyle } = useMemo(() => {
        const { spacing, ...restStyle } = dialogStyles.root;

        return {
            childStyle: {
                marginTop: spacing,
            },
            containerStyle: [restStyle, style],
        };
    }, [style]);

    const dialogChildren = useMemo(
        () =>
            Children.toArray(children)
                .filter(child => child != null && typeof child !== 'boolean')
                .map((child, i) => {
                    if (i === 0 && isValidElement(child) && !iconProps) {
                        return cloneElement(child, {
                            // @ts-ignore
                            style: [childStyle, child.props.style],
                        });
                    }
                    return child;
                }),
        [childStyle, children, iconProps],
    );

    return (
        <Modal elevation={2} {...rest} onClose={onClose} style={containerStyle}>
            <>
                {iconProps ? <DialogIcon {...iconProps} /> : null}
                {dialogChildren}
            </>
        </Modal>
    );
};

export default memo(Dialog);
