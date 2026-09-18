import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { ProgresProvider } from '@/hooks/useProgres';
import { MusikProvider } from '@/hooks/useMusik';
import { warna } from '@/theme/warna';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Root aplikasi: font, provider (progres + musik), lalu Stack dengan
 * transisi fade + slide halus — bukan push default.
 * Semua layar pakai header kosong; judul digambar sendiri di tiap layar.
 */
export default function LayoutRoot() {
  const [fontTermuat] = useFonts({
    'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontTermuat) SplashScreen.hideAsync().catch(() => {});
  }, [fontTermuat]);

  if (!fontTermuat) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: warna.latar }}>
      <SafeAreaProvider>
        <ProgresProvider>
          <MusikProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: warna.latar },
                animation: 'fade_from_bottom',
                animationDuration: 450,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="surat" />
              <Stack.Screen name="kejutan" />
              <Stack.Screen name="kuis" />
              <Stack.Screen name="timeline" />
              <Stack.Screen name="momen/[id]" />
              <Stack.Screen name="galeri" />
              <Stack.Screen name="petunjuk" />
            </Stack>
          </MusikProvider>
        </ProgresProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
