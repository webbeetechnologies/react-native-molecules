import color from 'color';
import { memo, useMemo } from 'react';
import {
    Platform,
    StatusBar,
    type StatusBarStyle,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';

import { Modal } from '../Modal';
import { Portal } from '../Portal';
import { DatePickerModalContent } from './DatePickerModalContent';
import type { DatePickerModalProps } from './types';
import { datePickerModalStyles } from './utils';

export function DatePickerModal(props: DatePickerModalProps) {
    const dimensions = useWindowDimensions();

    const {
        isOpen,
        disableStatusBar,
        disableStatusBarPadding,
        mode = 'single',
        style: styleProp,
        ...rest
    } = props;

    const { containerStyle, headerStyle, barStyle, modalContentStyle } = useMemo(() => {
        let isHeaderBackgroundLight = true;
        try {
            isHeaderBackgroundLight = color(
                datePickerModalStyles.header?.backgroundColor,
            ).isLight();
        } catch (e) {}

        return {
            containerStyle: [StyleSheet.absoluteFill, styleProp],
            headerStyle: [
                datePickerModalStyles.header,
                {
                    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // on IOS StatusBar.currentHeight isn't available
                },
            ],
            barStyle: (isHeaderBackgroundLight
                ? 'dark-content'
                : 'light-content') as StatusBarStyle,
            modalContentStyle:
                dimensions.width > 650
                    ? { flex: 1, maxHeight: 600 }
                    : { flex: 1, maxWidth: undefined, borderRadius: 0 },
        };
    }, [dimensions.width, styleProp]);

    return (
        <View style={containerStyle} pointerEvents="box-none">
            <Portal>
                <Modal
                    isOpen={isOpen}
                    onClose={rest.onClose}
                    style={modalContentStyle}
                    elevation={0}>
                    <>
                        <>
                            {disableStatusBar ? null : (
                                <StatusBar translucent={true} barStyle={barStyle} />
                            )}
                        </>

                        <>{disableStatusBarPadding ? null : <View style={headerStyle} />}</>

                        <DatePickerModalContent
                            {...rest}
                            mode={mode as any}
                            disableSafeTop={disableStatusBar}
                        />
                    </>
                </Modal>
            </Portal>
        </View>
    );
}

export default memo(DatePickerModal);
