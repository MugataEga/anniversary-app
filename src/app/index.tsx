import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { Screen } from '@/components/Screen';
import { Muncul } from '@/components/Muncul';
import { TombolUtama } from '@/components/TombolUtama';
import { PemutarMini } from '@/components/PemutarMini';
import { konten } from '@/data/content';
import { useMusik } from '@/hooks/useMusik';
import {
  duaDigit,
  gunakanHitungBersama,
  masihPlaceholder,
  parseTanggal,
} from '@/hooks/gunakanHitungWaktu';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, radius, spasi } from '@/theme/spasi';

/**
 * Layar 1 — Pembuka.
 * Nama penerima muncul dengan fade, lalu counter hidup
 * "kita sudah bersama ..." dari tanggalJadian. Tombol "Buka" di bawah.
 * Musik tidak autoplay — ada tombol nyalakan tersendiri.
 */
export default function LayarPembuka() {
  const router = useRouter();
  const musik = useMusik();

  const jadian = parseTanggal(konten.identitas.tanggalJadian);
  const hitung = gunakanHitungBersama(jadian);
  const placeholder = masihPlaceholder(konten.identitas.tanggalJadian);

  // Pintu rahasia: ketuk kartu hitungan 5x -> layar petunjuk pengisian
  const [ketukan, setKetukan] = useState(0);
  const resetId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saatKetukHitungan = () => {
    if (resetId.current) clearTimeout(resetId.current);
    resetId.current = setTimeout(() => setKetukan(0), 2500);
    setKetukan((k) => {
      if (k + 1 >= 5) {
        router.push('/petunjuk');
        return 0;
      }
      return k + 1;
    });
  };

  return (
    <Screen extraBawah={musik.dimulai ? 120 : 0}>
      <View style={styles.pusat}>
        <Muncul jedaMs={200}>
          <Text style={tipografi.keterangan}>{konten.pembuka.kalimatPembuka}</Text>
        </Muncul>

        <Muncul jedaMs={600}>
          <Text style={[tipografi.judulLayar, styles.nama]}>{konten.identitas.namaPenerima}</Text>
        </Muncul>

        <Muncul jedaMs={1100}>
          <Pressable
            onPress={saatKetukHitungan}
            accessibilityLabel="Hitungan waktu bersama"
            style={[styles.kartuHitung, bayanganKartu]}
          >
            {hitung && !placeholder ? (
              <>
                <Text style={tipografi.angka}>
                  {hitung.hari} hari {duaDigit(hitung.jam)} jam {duaDigit(hitung.menit)} menit
                </Text>
                <Text style={tipografi.keterangan}>...dan masih terus berjalan</Text>
              </>
            ) : (
              <Text style={tipografi.keterangan}>
                Isi `tanggalJadian` di src/data/content.ts (format YYYY-MM-DD) biar hitungannya
                jalan.
              </Text>
            )}
          </Pressable>
        </Muncul>
      </View>

      <View style={styles.bawah}>
        <Muncul jedaMs={1400}>
          <TombolUtama label="Buka" onPress={() => router.push('/surat')} gaya={styles.tombol} />
        </Muncul>

        {!musik.dimulai ? (
          <Muncul jedaMs={1700}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Nyalakan musik"
              onPress={() => musik.nyalakan()}
              style={styles.tombolMusik}
              hitSlop={10}
            >
              <Ionicons name="musical-notes" size={16} color={warna.teksSekunder} />
              <Text style={styles.labelMusik}>Nyalakan musiknya dulu, yuk</Text>
            </Pressable>
          </Muncul>
        ) : null}
      </View>

      {musik.dimulai ? <PemutarMini /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pusat: { flex: 1, justifyContent: 'center', gap: spasi.blok },
  nama: { color: warna.teks },
  kartuHitung: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 6,
    alignItems: 'center',
  },
  bawah: { gap: spasi.item, alignItems: 'center', paddingBottom: spasi.item },
  tombol: { alignSelf: 'stretch' },
  tombolMusik: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  labelMusik: {
    fontFamily: namaFont.bodySedang,
    fontSize: 14,
    color: warna.teksSekunder,
  },
});
