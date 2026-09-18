import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { warna } from '@/theme/warna';

const PALET = [warna.aksen, warna.emas, warna.magenta, warna.ungu, warna.aksenMuda];

type Partikel = {
  /** Posisi awal horizontal, relatif ke tengah layar (px) */
  x: number;
  /** Posisi awal vertikal dari atas layar (px) — area kotak kejutan */
  yAwal: number;
  /** Jarak jatuh sampai hilang (px) */
  jatuh: number;
  /** Simpangan horizontal saat jatuh (px) */
  driftX: number;
  /** Total putaran selama jatuh (derajat) */
  putaran: number;
  warna: string;
  lebar: number;
  tinggi: number;
  /** Jeda sebelum mulai jatuh (ms) — biar burst-nya bertahap */
  jeda: number;
  durasi: number;
};

const acak = (min: number, max: number) => min + Math.random() * (max - min);

function buatPartikel(jumlah: number): Partikel[] {
  return Array.from({ length: jumlah }, () => ({
    x: acak(-130, 130),
    yAwal: acak(150, 270),
    jatuh: acak(420, 660),
    driftX: acak(-90, 90),
    putaran: acak(-540, 540),
    warna: PALET[Math.floor(Math.random() * PALET.length)],
    lebar: acak(7, 13),
    tinggi: acak(9, 16),
    jeda: acak(0, 380),
    durasi: acak(1700, 2700),
  }));
}

/** Satu serutan: jatuh dipercepat (gravitasi) sambil berputar, lalu memudar. */
function Serutan({ p }: { p: Partikel }) {
  const maju = useSharedValue(0);

  useEffect(() => {
    maju.value = withDelay(
      p.jeda,
      withTiming(1, { duration: p.durasi, easing: Easing.in(Easing.quad) }),
    );
  }, [maju, p]);

  const gaya = useAnimatedStyle(() => ({
    transform: [
      { translateX: p.x + p.driftX * maju.value },
      { translateY: p.yAwal + p.jatuh * maju.value },
      { rotate: `${p.putaran * maju.value}deg` },
    ],
    opacity: maju.value < 0.72 ? 1 : Math.max(0, 1 - (maju.value - 0.72) / 0.28),
  }));

  return (
    <Animated.View
      style={[
        styles.serut,
        { width: p.lebar, height: p.tinggi, backgroundColor: p.warna },
        gaya,
      ]}
    />
  );
}

/**
 * Hujan confetti sekali pakai — dipasang saat kotak kejutan terbuka.
 * Reanimated murni, tanpa library tambahan. Overlay menutupi layar tapi
 * pointerEvents none, jadi sentuhan tetap tembus. Otomatis bersih sendiri.
 */
export function Confetti({ jumlah = 48 }: { jumlah?: number }) {
  const partikel = useMemo(() => buatPartikel(jumlah), [jumlah]);
  const [beres, setBeres] = useState(false);

  // Jeda maksimum (380) + durasi maksimum (2700) + margin -> bersihkan overlay
  useEffect(() => {
    const id = setTimeout(() => setBeres(true), 3800);
    return () => clearTimeout(id);
  }, []);

  if (beres) return null;

  return (
    <View pointerEvents="none" style={styles.panggung}>
      {partikel.map((p, i) => (
        <Serutan key={i} p={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panggung: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
  },
  serut: {
    position: 'absolute',
    left: '50%',
    top: 0,
    borderRadius: 2,
  },
});
