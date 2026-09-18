import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Screen } from '@/components/Screen';
import { Muncul } from '@/components/Muncul';
import { TombolUtama } from '@/components/TombolUtama';
import { PemutarMini } from '@/components/PemutarMini';
import { konten } from '@/data/content';
import { useProgres } from '@/hooks/useProgres';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, radius, spasi } from '@/theme/spasi';

const JEDA_FEEDBACK_MS = 1400;

type Fase = 'soal' | 'benar' | 'salah' | 'selesai';

/**
 * Layar 4 — Mini-game "Seberapa kenal kita".
 * 7 pertanyaan, satu per layar. Feedback manis, tidak menghukum.
 * Skor akhir 3 rentang pesan. Selesai -> timeline terbuka.
 */
export default function LayarKuis() {
  const router = useRouter();
  const { tandaiSelesai } = useProgres();

  const soal = konten.kuis.soal;
  const [indeks, setIndeks] = useState(0);
  const [skor, setSkor] = useState(0);
  const [fase, setFase] = useState<Fase>('soal');
  const [pilih, setPilih] = useState<number | null>(null);

  const soalKini = soal[indeks];
  const selesaiKuis = indeks >= soal.length;

  const jawab = (pilihan: number) => {
    if (fase !== 'soal') return;
    const benar =
      pilihan === soalKini.indeksBenar ||
      (soalKini.indeksBenarTambahan ?? []).includes(pilihan);
    setPilih(pilihan);
    setFase(benar ? 'benar' : 'salah');
    if (benar) setSkor((s) => s + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    setTimeout(() => {
      const soalBaru = indeks + 1;
      setIndeks(soalBaru);
      setPilih(null);
      setFase(soalBaru >= soal.length ? 'selesai' : 'soal');
      if (soalBaru >= soal.length) {
        tandaiSelesai('kuis');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }, JEDA_FEEDBACK_MS);
  };

  const lanjutTimeline = () => router.push('/timeline');

  const pesanAkhir =
    skor <= 3
      ? konten.kuis.pesanSkor.rendah
      : skor <= 6
        ? konten.kuis.pesanSkor.sedang
        : konten.kuis.pesanSkor.tinggi;

  if (selesaiKuis) {
    return (
      <Screen extraBawah={120}>
        <Muncul>
          <View style={styles.pusat}>
            <View style={[styles.kartuSkor, bayanganKartu]}>
              <Ionicons name="heart" size={28} color={warna.aksen} />
              <Text style={styles.skor}>
                {skor} dari {soal.length}
              </Text>
              <Text style={[tipografi.body, styles.pesanAkhir]}>{pesanAkhir}</Text>
            </View>
            <TombolUtama label="Buka timeline kita" onPress={lanjutTimeline} gaya={styles.tombol} />
          </View>
        </Muncul>
        <PemutarMini />
      </Screen>
    );
  }

  return (
    <Screen extraBawah={120}>
      {/* Progres titik kecil */}
      <View style={styles.progres}>
        {soal.map((_, i) => (
          <View key={i} style={[styles.titik, i < indeks && styles.titikLewat, i === indeks && fase !== 'soal' && styles.titikLewat]} />
        ))}
      </View>

      {fase === 'soal' ? (
        <Muncul key={`soal-${indeks}`}>
          <Text style={[tipografi.keterangan, styles.nomor]}>
            Soal {indeks + 1} dari {soal.length}
          </Text>
          <Text style={[tipografi.judulLayar, styles.pertanyaan]}>{soalKini.pertanyaan}</Text>
          <View style={styles.pilihan}>
            {soalKini.pilihan.map((teks, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Pilihan ${i + 1}: ${teks}`}
                onPress={() => jawab(i)}
                style={({ pressed }) => [styles.kartuPilihan, bayanganKartu, pressed && styles.tekan]}
              >
                <Text style={styles.teksPilihan}>{teks}</Text>
              </Pressable>
            ))}
          </View>
        </Muncul>
      ) : (
        <Muncul key={`feedback-${indeks}`}>
          <View style={styles.pusatFeedback}>
            <Ionicons
              name={fase === 'benar' ? 'heart' : 'cloud'}
              size={40}
              color={fase === 'benar' ? warna.aksen : warna.teksSekunder}
            />
            <Text style={[tipografi.subjudul, styles.tengah]}>
              {fase === 'benar'
                ? (soalKini.pesanBenar ?? 'Bener! Kamu memang paling kenal kita.')
              : (soalKini.pesanSalah ?? 'Belum tepat, tapi gapapa — yang penting kita terus belajar satu sama lain.')}
            </Text>
            {fase === 'salah' ? (
              <Text style={[tipografi.keterangan, styles.tengah]}>
                Jawabannya: {[soalKini.indeksBenar, ...(soalKini.indeksBenarTambahan ?? [])]
                  .map((i) => soalKini.pilihan[i])
                  .join(' / ')}
              </Text>
            ) : null}
          </View>
        </Muncul>
      )}

      <PemutarMini />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progres: { flexDirection: 'row', gap: 8, alignSelf: 'center' },
  titik: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: warna.permukaan,
  },
  titikLewat: { backgroundColor: warna.aksen },
  nomor: { color: warna.emas },
  pertanyaan: { color: warna.teks },
  pilihan: { gap: 12 },
  kartuPilihan: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  tekan: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  teksPilihan: {
    fontFamily: namaFont.bodySedang,
    fontSize: 15,
    lineHeight: 22,
    color: warna.teks,
  },
  pusat: { flex: 1, justifyContent: 'center', gap: spasi.blok },
  kartuSkor: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    padding: spasi.blok,
    gap: 12,
    alignItems: 'center',
  },
  skor: {
    fontFamily: namaFont.judul,
    fontSize: 40,
    color: warna.teks,
  },
  pesanAkhir: { textAlign: 'center' },
  tombol: { alignSelf: 'stretch' },
  pusatFeedback: { flex: 1, justifyContent: 'center', gap: spasi.item, alignItems: 'center' },
  tengah: { textAlign: 'center' },
});
