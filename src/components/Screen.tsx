import { useEffect, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { warna } from '@/theme/warna';
import { spasi } from '@/theme/spasi';

/**
 * Bingkai layar standar: latar gelap, padding 24, fade + slide halus
 * tiap layar dibuka (bukan transisi push default).
 * scroll = konten digulir; extraBawah = ruang tambahan untuk pemutar mini.
 */
export function Screen({
  children,
  scroll = false,
  extraBawah = 0,
  gaya,
  onScroll,
}: {
  children: ReactNode;
  scroll?: boolean;
  extraBawah?: number;
  gaya?: ViewStyle;
  /** Dipanggil saat konten scroll (hanya saat scroll = true) */
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const insets = useSafeAreaInsets();
  const maju = useSharedValue(0);

  useEffect(() => {
    maju.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) });
  }, [maju]);

  const gayaMasuk = useAnimatedStyle(() => ({
    opacity: maju.value,
    transform: [{ translateY: (1 - maju.value) * 18 }],
  }));

  const isi = scroll ? (
    <ScrollView
      style={StyleSheet.absoluteFill}
      contentContainerStyle={[
        styles.isiScroll,
        { paddingTop: insets.top + spasi.blok, paddingBottom: insets.bottom + 48 + extraBawah },
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.isi,
        { paddingTop: insets.top + spasi.blok, paddingBottom: insets.bottom + 48 + extraBawah },
        gaya,
      ]}
    >
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <Animated.View style={[styles.root, gayaMasuk]}>{isi}</Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: warna.latar },
  isi: {
    flex: 1,
    paddingHorizontal: spasi.layar,
    gap: spasi.blok,
  },
  isiScroll: {
    paddingHorizontal: spasi.layar,
    gap: spasi.blok,
  },
});
