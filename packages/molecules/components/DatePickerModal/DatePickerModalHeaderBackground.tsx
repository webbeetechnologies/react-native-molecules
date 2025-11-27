import { Animated, SafeAreaView } from 'react-native';

import { datePickerModalHeaderBackgroundStyles } from './utils';

export default function DatePickerModalHeaderBackground({ children }: { children: any }) {
    return (
        <Animated.View style={datePickerModalHeaderBackgroundStyles.header}>
            <SafeAreaView style={datePickerModalHeaderBackgroundStyles.safeContent}>
                {children}
            </SafeAreaView>
        </Animated.View>
    );
}
