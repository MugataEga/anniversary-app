import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Judul } from '@/components/Judul';
import { TombolUtama } from '@/components/TombolUtama';
import { PemutarMini } from '@/components/PemutarMini';
import { konten } from '@/data/content';
import { useProgres } from '@/hooks/useProgres';
import { MasukViewport } from '@/components/MasukViewport';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, radius, spasi } from '@/theme/spasi';

/**
 * Layar 5 — Timeline.
 * Garis waktu di kiri, kartu di kanan (tanggal, judul, foto, cerita).
 * Kartu muncul dengan animasi saat masuk viewport; ketuk -> detail penuh.
 */
export default function LayarTimeline() {
  const router = useRouter();
  const { tandaiSelesai } = useProgres();
  useEffect(() => {
    tandaiSelesai('timeline');
  }, [tandaiSelesai]);

  const momen = konten.timeline.momen;
  const [tampih, setTampih] = useState<boolean[]>(() => momen.map(() => false));
  const posisiRef = useRef<number[]>([]); // y baris relatif ke daftar
  const offsetDaftarRef = useRef(0); // posisi daftar di dalam konten scroll
  const scrollYRef = useRef(0);

  const tandaiTampih = useCallback((i: number) => {
    setTampih((lama) => {
      if (lama[i]) return lama;
      const baru = [...lama];
      baru[i] = true;
      return baru;
    });
  }, []);

  // Kartu muncul begitu mendekat ke viewport (paragraf atas - 120px).
  const periksaTampih = useCallback(() => {
    const y = scrollYRef.current;
    for (let i = 0; i < momen.length; i++) {
      const atas = posisiRef.current[i];
      if (atas === undefined) continue;
      if (y >= atas + offsetDaftarRef.current - 120) tandaiTampih(i);
    }
  }, [momen.length, tandaiTampih]);

  // Saat layar dibuka, kartu-kartu di viewport awal langsung tampil
  // tanpa perlu menunggu scroll pertama.
  useEffect(() => {
    const id = setTimeout(periksaTampih, 300);
    return () => clearTimeout(id);
  }, [periksaTampih]);

  const saatGulir = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
    periksaTampih();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={styles.isi}
        showsVerticalScrollIndicator={false}
        onScroll={saatGulir}
        scrollEventThrottle={16}
      >
        <Judul teks="Cerita kita" keterangan="Dari momen pertama sampai hari ini" />

        <View
          style={styles.daftar}
          onLayout={(e) => {
            offsetDaftarRef.current = e.nativeEvent.layout.y;
          }}
        >
          {momen.map((m, i) => (
            <View
              key={i}
              style={styles.baris}
              onLayout={(e) => {
                posisiRef.current[i] = e.nativeEvent.layout.y;
                periksaTampih();
              }}
            >
              {/* Kolom garis waktu */}
              <View style={styles.kolomWaktu}>
                <View style={[styles.titik, tampih[i] && styles.titikAktif]} />
                {i < momen.length - 1 ? <View style={styles.garis} /> : null}
              </View>

              {/* Kartu momen */}
              <MasukViewport aktif={tampih[i]} style={styles.kartuWrap}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Momen: ${m.judul}`}
                  onPress={() => router.push(`/momen/${i}`)}
                  style={({ pressed }) => [
                    styles.kartu,
                    bayanganKartu,
                    pressed && styles.tekan,
                  ]}
                >
                  <Text style={styles.tanggal}>{m.tanggal}</Text>
                  <Text style={styles.judulMomen}>{m.judul}</Text>
                  <Image source={m.foto} style={styles.foto} resizeMode="cover" />
                  <Text style={tipografi.keterangan} numberOfLines={3}>
                    {m.cerita}
                  </Text>
                </Pressable>
              </MasukViewport>
            </View>
          ))}

          <TombolUtama
            label="Buka galeri kita"
            onPress={() => router.push('/galeri')}
            gaya={styles.tombolLanjut}
          />
        </View>
      </ScrollView>

      <View style={styles.pemutarWrap}>
        <PemutarMini />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: warna.latar },
  isi: {
    paddingTop: spasi.blok * 2,
    paddingBottom: 140,
    paddingHorizontal: spasi.layar,
    gap: spasi.blok,
  },
  daftar: { gap: spasi.blok },
  tombolLanjut: { alignSelf: 'stretch' },
  baris: { flexDirection: 'row' },
  kolomWaktu: { width: 24, alignItems: 'center' },
  titik: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: warna.permukaan,
    marginTop: 6,
  },
  titikAktif: { backgroundColor: warna.aksen },
  garis: { flex: 1, width: 2, backgroundColor: warna.permukaan, marginVertical: 4 },
  kartuWrap: { flex: 1, marginLeft: 12 },
  kartu: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    padding: 16,
    gap: 8,
  },
  tekan: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  tanggal: {
    fontFamily: namaFont.bodySedang,
    fontSize: 12,
    color: warna.emas,
    fontVariant: ['tabular-nums'],
  },
  judulMomen: {
    fontFamily: namaFont.judul,
    fontSize: 20,
    lineHeight: 26,
    color: warna.teks,
  },
  foto: {
    width: '100%',
    height: 140,
    borderRadius: radius.sedang - 6,
    backgroundColor: warna.latar,
  },
  pemutarWrap: { position: 'absolute', left: 0, right: 0, bottom: 16 },
});
