import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="food/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="search/index" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/review" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/location" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/offers" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/searching" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/tracking" options={{ headerShown: false }} />
        <Stack.Screen name="communication/chat/[driverId]" options={{ headerShown: false }} />
        <Stack.Screen name="communication/call/[driverId]" options={{ headerShown: false }} />
        <Stack.Screen name="rating/[orderId]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
