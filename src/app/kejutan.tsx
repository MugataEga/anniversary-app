import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Screen } from '@/components/Screen';
import { Muncul } from '@/components/Muncul';
import { Judul } from '@/components/Judul';
import { TombolUtama } from '@/components/TombolUtama';
import { PemutarMini } from '@/components/PemutarMini';
import { Confetti } from '@/components/Confetti';
import { konten } from '@/data/content';
import { useProgres } from '@/hooks/useProgres';
import {
  duaDigit,
  gunakanHitungMundur,
  masihPlaceholder,
  parseTanggal,
} from '@/hooks/gunakanHitungWaktu';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, durasi, radius, spasi } from '@/theme/spasi';

/**
 * Layar 3 — Kejutan Terkunci.
 * Kotak hadiah hanya bisa dibuka pada/setelah tanggalAnniversary.
 * Sebelum tanggal: hitung mundur + kunci. Sesudah: animasi terbuka +
 * pesanKejutan. Flag bypassKunci di content.ts untuk testing.
 */
export default function LayarKejutan() {
  const router = useRouter();
  const { tandaiSelesai } = useProgres();
  const [terbuka, setTerbuka] = useState(false);
  const maju = useSharedValue(0);

  const target = parseTanggal(konten.identitas.tanggalAnniversary);
  const sisa = gunakanHitungMundur(target);
  const placeholder = masihPlaceholder(konten.identitas.tanggalAnniversary);

  const bolehBuka = konten.identitas.bypassKunci || (target !== null && (sisa?.hari ?? 1) <= 0);

  useEffect(() => {
    if (terbuka) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      maju.value = withTiming(1, { duration: durasi.normal });
    }
  }, [terbuka, maju]);

  const buka = () => {
    if (!bolehBuka || terbuka) return;
    setTerbuka(true);
  };

  // Kotak: sedikit mengembang & miring saat membuka
  const gayaKotak = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(maju.value, [0, 1], [1, 1.06]) },
      { rotate: `${interpolate(maju.value, [0, 1], [0, -2])}deg` },
    ],
  }));

  // Tutup kotak terbuka ke belakang
  const gayaTutup = useAnimatedStyle(() => ({
    transform: [{ rotateX: `${interpolate(maju.value, [0, 1], [0, -110])}deg` }],
  }));

  const lanjut = () => {
    tandaiSelesai('kejutan');
    router.push('/kuis');
  };

  return (
    <Screen scroll extraBawah={120}>
      <Judul teks={terbuka ? 'Buat kamu' : 'Satu kotak kejutan'} />

      {terbuka ? <Confetti /> : null}

      {placeholder ? (
        <Muncul>
          <View style={[styles.kartuKunci, bayanganKartu]}>
            <Ionicons name="key" size={22} color={warna.emas} />
            <Text style={tipografi.keterangan}>
              Isi `tanggalAnniversary` di src/data/content.ts (format YYYY-MM-DD) biar kotaknya
              tahu kapan boleh dibuka.
            </Text>
          </View>
        </Muncul>
      ) : terbuka ? (
        <Muncul>
          <View style={[styles.kartuPesan, bayanganKartu]}>
            <Text style={styles.isiPesan}>{konten.kejutan.pesanKejutan}</Text>
          </View>
          <TombolUtama label="Lanjut" onPress={lanjut} gaya={styles.tombol} />
        </Muncul>
      ) : (
        <>
          <View style={styles.panggung}>
            <Animated.View style={[styles.kotak, bayanganKartu, gayaKotak]}>
              {/* pita vertikal */}
              <View style={styles.pitaV} />
              <Animated.View style={[styles.tutup, gayaTutup]}>
                <View style={styles.pitaTutup} />
                <Ionicons
                  name={bolehBuka ? 'gift' : 'lock-closed'}
                  size={26}
                  color={warna.emas}
                  style={styles.ikonTutup}
                />
              </Animated.View>
            </Animated.View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={bolehBuka ? 'Buka kotak kejutan' : 'Kotak masih terkunci'}
              onPress={buka}
              disabled={!bolehBuka}
              style={styles.sentuhKotak}
            >
              <View style={styles.sentuhIsi} />
            </Pressable>
          </View>

          {bolehBuka ? (
            <Muncul>
              <Text style={[tipografi.keterangan, styles.tengah]}>
                Kotaknya sudah boleh dibuka — ketuk pelan-pelan
              </Text>
            </Muncul>
          ) : (
            <Muncul>
              <View style={[styles.kartuKunci, bayanganKartu]}>
                {sisa ? (
                  <>
                    <Text style={styles.mundur}>
                      {sisa.hari} hari {duaDigit(sisa.jam)} jam {duaDigit(sisa.menit)} menit{' '}
                      {duaDigit(sisa.detik)} detik
                    </Text>
                    <Text style={tipografi.keterangan}>Sabar ya, masih dikunci sampai hari-H</Text>
                  </>
                ) : (
                  <Text style={tipografi.keterangan}>Menghitung mundur...</Text>
                )}
              </View>
            </Muncul>
          )}
        </>
      )}

      <PemutarMini />
    </Screen>
  );
}

const styles = StyleSheet.create({
  panggung: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kotak: {
    width: 200,
    height: 170,
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    overflow: 'hidden',
  },
  pitaV: {
    position: 'absolute',
    left: 88,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: 'rgba(171, 3, 169, 0.55)',
  },
  tutup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 62,
    backgroundColor: '#2F1A55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pitaTutup: {
    position: 'absolute',
    left: 88,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: 'rgba(255, 213, 30, 0.45)',
  },
  ikonTutup: { zIndex: 2 },
  sentuhKotak: {
    position: 'absolute',
    width: 240,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentuhIsi: { width: '100%', height: '100%' },
  kartuKunci: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    padding: 24,
    gap: 10,
    alignItems: 'center',
  },
  kartuPesan: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    padding: 24,
  },
  isiPesan: {
    fontFamily: namaFont.body,
    fontSize: 16,
    lineHeight: 16 * 1.7,
    color: warna.teks,
  },
  mundur: {
    fontFamily: namaFont.bodySedang,
    fontSize: 16,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
    color: warna.teks,
    textAlign: 'center',
  },
  tengah: { textAlign: 'center' },
  tombol: { alignSelf: 'stretch', marginTop: spasi.item },
});
