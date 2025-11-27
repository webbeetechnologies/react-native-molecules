import {
    type ComponentPropsWithRef,
    type ComponentType,
    forwardRef,
    memo,
    type ReactNode,
} from 'react';
import { type StyleProp, Text, type TextProps, type TextStyle } from 'react-native';

import { dialogTitleStyles } from './utils';

export type Props = ComponentPropsWithRef<ComponentType<TextProps>> & {
    /**
     * Title text for the `DialogTitle`.
     */
    children: ReactNode;
    style?: StyleProp<TextStyle>;
};

/**
 * A component to show a title in a Dialog.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/dialog-title.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Paragraph, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.Title>This is a title</Dialog.Title>
 *         <Dialog.Content>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </Dialog.Content>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogTitle = ({ children, style, ...rest }: Props, ref: any) => {
    return (
        <Text
            {...rest}
            accessibilityRole="header"
            style={[dialogTitleStyles.root, style]}
            ref={ref}>
            {children}
        </Text>
    );
};

DialogTitle.displayName = 'Dialog_Title';

export default memo(forwardRef(DialogTitle));
