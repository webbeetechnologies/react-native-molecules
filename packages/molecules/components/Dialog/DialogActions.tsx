import {
    Children,
    cloneElement,
    type ComponentPropsWithRef,
    type ComponentType,
    forwardRef,
    isValidElement,
    memo,
    type ReactElement,
    type ReactNode,
    useMemo,
} from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { dialogActionsStyles } from './utils';

export type Props = ViewProps &
    ComponentPropsWithRef<ComponentType<ViewProps>> & {
        /**
         * Content of the `DialogActions`.
         */
        children: ReactNode;

        style?: StyleProp<ViewStyle>;
    };

/**
 * A component to show a list of actions in a Dialog.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/dialog-actions.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Actions>
 *           <Button onPress={() => console.log('Cancel')}>Cancel</Button>
 *           <Button onPress={() => console.log('Ok')}>Ok</Button>
 *         </Dialog.Actions>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogActions = ({ children, style, ...rest }: Props, ref: any) => {
    const { spacing, containerStyle, childrenProps } = useMemo(() => {
        return {
            spacing: dialogActionsStyles.root.spacing,
            containerStyle: [dialogActionsStyles.container, style],
            childrenProps: (i: number, child: ReactElement) => ({
                style: [
                    {
                        marginLeft: i === 0 ? 0 : spacing,
                    },
                    (child.props as ViewProps)?.style,
                ],
            }),
        };
    }, [style]);

    return (
        <View {...rest} style={containerStyle} ref={ref}>
            {Children.map(children, (child, i) =>
                isValidElement(child) ? cloneElement(child, childrenProps(i, child)) : child,
            )}
        </View>
    );
};

DialogActions.displayName = 'Dialog_Actions';

export default memo(forwardRef(DialogActions));
