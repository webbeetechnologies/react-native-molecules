import '../unistyles';

import { Slot } from 'expo-router';
import { PortalProvider } from 'react-native-molecules/core';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PortalProvider>
                <SafeAreaView style={styles.container}>
                    <Slot />
                </SafeAreaView>
            </PortalProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
