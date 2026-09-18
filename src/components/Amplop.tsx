import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { warna } from '@/theme/warna';
import { namaFont } from '@/theme/tipografi';
import { bayanganKartu, durasi, radius } from '@/theme/spasi';

const TINGGI_AMPLOP = 240;
const AMBANG_BUKA = 110; // px geser ke atas untuk terbuka

/**
 * Amplop tertutup. Geser ke atas sampai ambang -> flap terbuka (rotateX),
 * surat naik dari dalam amplop, haptic medium, lalu panggil saatTerbuka.
 * Kalau gesernya kurang, kembali tertutup dengan pegas.
 */
export function Amplop({ saatTerbuka }: { saatTerbuka: () => void }) {
  const geser = useSharedValue(0); // 0..1, 1 = terbuka penuh
  const sudahBuka = useSharedValue(false);
  const [terbuka, setTerbuka] = useState(false);

  const buka = () => {
    setTerbuka(true);
    saatTerbuka();
  };

  const gestur = Gesture.Pan()
    .activeOffsetY(-12)
    .failOffsetX([-24, 24])
    .onUpdate((e) => {
      if (sudahBuka.value) return;
      const maju = Math.max(0, -e.translationY);
      geser.value = Math.min(1, maju / AMBANG_BUKA);
      if (geser.value >= 1) {
        sudahBuka.value = true;
        runOnJS(buka)();
      }
    })
    .onEnd(() => {
      if (sudahBuka.value) {
        geser.value = withTiming(1, { duration: durasi.cepat });
        return;
      }
      geser.value = withSpring(0, { damping: 18, stiffness: 220 });
    });

  useEffect(() => {
    if (terbuka) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, [terbuka]);

  // Surat yang naik dari dalam amplop
  const gayaSurat = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(geser.value, [0, 1], [0, -150]) }],
    opacity: interpolate(geser.value, [0, 0.45, 1], [0, 0.85, 1]),
  }));

  // Flap: rotateX dari tertutup (0deg) ke terbuka (terbalik ke belakang)
  const gayaFlap = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { rotateX: `${interpolate(geser.value, [0, 1], [0, -170])}deg` },
    ],
  }));

  const gayaBadan = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(geser.value, [0, 1], [0, 10]) }],
  }));

  return (
    <View style={styles.panggung}>
      {/* Surat di dalam — muncul di atas flap saat terbuka */}
      <Animated.View style={[styles.kertas, bayanganKartu, gayaSurat, terbuka && styles.kertasTampil]}>
        <Ionicons name="heart" size={20} color={warna.emas} />
        <Text style={styles.kertasTeks}>Ada surat buat kamu</Text>
      </Animated.View>

      {/* Flap tertutup (segitiga) — terbalik ke belakang saat dibuka */}
      <Animated.View style={[styles.flap, gayaFlap]} pointerEvents="none" />

      {/* Badan amplop */}
      <Animated.View style={[styles.badan, bayanganKartu, gayaBadan]}>
        <LinearGradient
          colors={[warna.permukaan, warna.latar]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.badanGradasi}
        >
          <View style={styles.segel}>
            <Ionicons name="heart" size={18} color={warna.emas} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* area gesture */}
      {!terbuka && (
        <GestureDetector gesture={gestur}>
          <Animated.View style={styles.areaSentuh}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Amplop surat"
              accessibilityHint="Geser ke atas untuk membuka"
              style={styles.areaSentuh}
            />
          </Animated.View>
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panggung: {
    height: TINGGI_AMPLOP,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  kertas: {
    position: 'absolute',
    bottom: 70,
    width: 250,
    height: 150,
    borderRadius: radius.sedang,
    backgroundColor: warna.teks,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 3,
  },
  kertasTampil: { zIndex: 30 },
  kertasTeks: {
    fontFamily: namaFont.bodyTebal,
    fontSize: 14,
    color: warna.permukaan,
  },
  flap: {
    position: 'absolute',
    bottom: 70,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 130,
    borderRightWidth: 130,
    borderTopWidth: 70,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2F1A55',
    zIndex: 10,
  },
  badan: {
    width: 260,
    height: 70,
    borderBottomLeftRadius: radius.sedang,
    borderBottomRightRadius: radius.sedang,
    overflow: 'hidden',
    zIndex: 20,
  },
  badanGradasi: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  segel: {
    position: 'absolute',
    bottom: 12,
    width: 40,
    height: 40,
    borderRadius: radius.penuh,
    backgroundColor: 'rgba(255, 213, 30, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaSentuh: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
  },
});
