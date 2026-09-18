import { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { warna } from '@/theme/warna';
import { tipografi } from '@/theme/tipografi';
import { durasi } from '@/theme/spasi';

/**
 * Satu paragraf surat yang memudar + naik saat pertama kali muncul
 * (dipakai di dalam ScrollView onScroll — komponen induk mengatur
 * kapan `aktif` jadi true, biasanya begitu paragraf masuk viewport).
 * `urutan` dipakai untuk stagger kecil antarparagraf.
 */
function ParagrafSuratImpl({
  teks,
  aktif,
  urutan = 0,
}: {
  teks: string;
  aktif: boolean;
  urutan?: number;
}) {
  const maju = useSharedValue(0);

  useEffect(() => {
    if (aktif) {
      maju.value = withDelay(
        urutan * 90,
        withTiming(1, { duration: durasi.lambat, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [aktif, maju, urutan]);

  const gaya = useAnimatedStyle(() => ({
    opacity: maju.value,
    transform: [{ translateY: (1 - maju.value) * 18 }],
  }));

  return (
    <Animated.Text style={[tipografi.body, styles.paragraf, gaya]} selectionColor={warna.aksen}>
      {teks}
    </Animated.Text>
  );
}

export const ParagrafSurat = memo(ParagrafSuratImpl);

const styles = StyleSheet.create({
  paragraf: { marginBottom: 24 },
});
