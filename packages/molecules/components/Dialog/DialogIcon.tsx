import { memo, useMemo } from 'react';
import { View, type ViewStyle } from 'react-native';

import { Icon, type IconProps } from '../Icon';
import { dialogIconStyles } from './utils';

export type Props = IconProps & {
    containerStyle?: ViewStyle;
};

/**
 * A component to show an icon in a Dialog.
 *
 *  <div class="screenshots">
 *   <img class="small" src="screenshots/dialog-icon.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
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
 *         <Dialog.Icon icon="alert" />
 *         <Dialog.Title style={styles.title}>This is a title</Dialog.Title>
 *         <Dialog.Content>
 *           <Paragraph>This is simple dialog</Paragraph>
 *         </Dialog.Content>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   title: {
 *     textAlign: 'center',
 *   },
 * })
 *
 * export default MyComponent;
 * ```
 */
const DialogIcon = ({ containerStyle, color: colorProp, style, size = 24, ...rest }: Props) => {
    const { container, iconColor, iconStyle } = useMemo(() => {
        return {
            container: [dialogIconStyles.container, containerStyle],
            iconColor: colorProp || dialogIconStyles.root.color,
            iconStyle: [dialogIconStyles.root, style],
        };
    }, [colorProp, containerStyle, style]);

    return (
        <View style={container}>
            <Icon {...rest} color={iconColor} style={iconStyle} size={size} />
        </View>
    );
};

DialogIcon.displayName = 'Dialog_Icon';

export default memo(DialogIcon);
