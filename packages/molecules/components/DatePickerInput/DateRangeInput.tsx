import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import DatePickerModal from '../DatePickerModal/DatePickerModal';
import { IconButton } from '../IconButton';
import { Text } from '../Text';

// WORK IN PROGRESS
// PLEASE IGNORE THIS FILE
export default function DateRangeInput({
    locale,
    calendarIcon = 'calendar',
}: {
    locale: string;
    calendarIcon?: string;
}) {
    const [visible, setVisible] = useState<boolean>(false);
    const onDismiss = useCallback(() => {
        setVisible(false);
    }, [setVisible]);
    const onConfirm = useCallback(
        ({ startDate, endDate }: { startDate: any; endDate: any }) => {
            setVisible(false);
            // eslint-disable-next-line no-console
            console.log({ startDate, endDate });
        },
        [setVisible],
    );

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                {/*<DatePickerInput*/}
                {/*  value={''}*/}
                {/*  keyboardType={'numeric'}*/}
                {/*  placeholder={'DD-MM-YYY'}*/}
                {/*  mask={'DD-MM-YYY'}*/}
                {/*  onChangeText={() => {}}*/}
                {/*/>*/}
                <Text>Van</Text>
            </View>
            <View>
                <Text style={styles.text1}>to</Text>
                <Text style={styles.text2} accessible={false}>
                    tot
                </Text>
            </View>
            <View style={styles.textContainer}>
                {/*<DatePickerInput*/}
                {/*  // value={''}*/}
                {/*  // keyboardType={'numeric'}*/}
                {/*  // placeholder={'DD-MM-YYY'}*/}
                {/*  // mask={'DD-MM-YYY'}*/}
                {/*  // onChangeText={() => {}}*/}
                {/*/>*/}
                <Text>Tot</Text>
            </View>
            <View>
                <IconButton name={calendarIcon} onPress={() => setVisible(true)} />
                <Text style={styles.text2} accessible={false}>
                    tot
                </Text>
            </View>
            <DatePickerModal
                locale={locale}
                mode="range"
                isOpen={visible}
                onClose={onDismiss}
                onConfirm={onConfirm}
                startDate={undefined}
                endDate={undefined}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center' },
    textContainer: { flex: 1 },
    text1: {
        fontSize: 16,
        marginLeft: 12,
        marginRight: 12,
    },
    text2: {
        opacity: 0,
    },
});
