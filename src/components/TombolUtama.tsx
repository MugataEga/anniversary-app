import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { warna } from '@/theme/warna';
import { namaFont } from '@/theme/tipografi';
import { bayanganKartu, radius } from '@/theme/spasi';

/**
 * Tombol utama aplikasi (pil besar, tanpa border tebal).
 * varian 'utama' = isi dusty rose; 'sekunder' = permukaan gelap.
 */
export function TombolUtama({
  label,
  onPress,
  nonaktif = false,
  varian = 'utama',
  gaya,
}: {
  label: string;
  onPress: () => void;
  nonaktif?: boolean;
  varian?: 'utama' | 'sekunder';
  gaya?: ViewStyle;
}) {
  const utama = varian === 'utama';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: nonaktif }}
      disabled={nonaktif}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.dasar,
        utama ? styles.utama : styles.sekunder,
        bayanganKartu,
        pressed && !nonaktif && styles.tekan,
        nonaktif && styles.nonaktif,
        gaya,
      ]}
    >
      <Text style={[styles.label, { color: utama ? warna.latar : warna.aksen }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dasar: {
    borderRadius: radius.penuh,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utama: { backgroundColor: warna.aksen },
  sekunder: { backgroundColor: warna.permukaan },
  tekan: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  nonaktif: { opacity: 0.4 },
  label: {
    fontFamily: namaFont.bodyTebal,
    fontSize: 16,
    lineHeight: 22,
  },
});
