import '../unistyles';

import { PortalProvider } from 'react-native-molecules/core';
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PortalProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Slot />
                </SafeAreaView>
            </PortalProvider>
        </SafeAreaProvider>
    );
}
