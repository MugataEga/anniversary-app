import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Muncul } from '@/components/Muncul';
import { TombolUtama } from '@/components/TombolUtama';
import { Amplop } from '@/components/Amplop';
import { ParagrafSurat } from '@/components/ParagrafSurat';
import { PemutarMini } from '@/components/PemutarMini';
import { konten } from '@/data/content';
import { useProgres } from '@/hooks/useProgres';
import { warna } from '@/theme/warna';
import { tipografi } from '@/theme/tipografi';
import { radius, spasi } from '@/theme/spasi';

const PARAGRAF_TAMPIL_DARI_ATAS = 120; // px; paragraf muncul saat mendekat ke area ini

/**
 * Layar 2 — Surat Digital.
 * Amplop dibuka gesture swipe ke atas, lalu isi surat muncul bertahap
 * paragraf demi paragraf saat di-scroll. Scroll yang dipakai adalah
 * ScrollView dari <Screen scroll> — posisi tiap paragraf diukur via
 * onLayout dan dicocokkan dengan scroll offset.
 */
export default function LayarSurat() {
  const router = useRouter();
  const { tandaiSelesai } = useProgres();
  const [amplopTerbuka, setAmplopTerbuka] = useState(false);

  const paragraf = useMemo(
    () => konten.surat.paragraf.filter((p) => p.trim() !== ''),
    [],
  );

  // Paragraf mana yang sudah pernah terlihat (bertahap, tidak mundur)
  const [tampih, setTampih] = useState<boolean[]>(() => paragraf.map(() => false));
  const posisiRef = useRef<number[]>([]); // y tiap paragraf, relatif ke blok surat
  const offsetBlokRef = useRef(0); // posisi blok surat di dalam content scroll
  const tinggiKertasRef = useRef(0);
  const scrollYRef = useRef(0);

  const tandaiTampih = (i: number) => {
    setTampih((lama) => {
      if (lama[i]) return lama;
      const baru = [...lama];
      baru[i] = true;
      return baru;
    });
  };

  const periksaParagraf = () => {
    const y = scrollYRef.current;
    for (let i = 0; i < paragraf.length; i++) {
      const atas = posisiRef.current[i];
      if (atas === undefined) continue;
      if (y >= atas + offsetBlokRef.current - PARAGRAF_TAMPIL_DARI_ATAS) tandaiTampih(i);
    }
  };

  const saatGulir = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
    periksaParagraf();
  };

  const lanjut = () => {
    tandaiSelesai('surat');
    router.push('/kejutan');
  };

  // Jaring pengaman: setelah surat terbuka, cek lagi begitu layout stabil.
  // Kalau ternyata seluruh surat muat tanpa scroll (layar sangat tinggi),
  // tampilkan semua paragraf — jangan biarkan terkunci selamanya.
  useEffect(() => {
    if (!amplopTerbuka) return;
    const id = setTimeout(() => {
      const muatTanpaScroll =
        tinggiKertasRef.current > 0 &&
        offsetBlokRef.current + tinggiKertasRef.current + 160 <
          Dimensions.get('window').height;
      if (muatTanpaScroll) {
        setTampih(paragraf.map(() => true));
      } else {
        periksaParagraf();
      }
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplopTerbuka, paragraf.length]);

  return (
    <Screen scroll onScroll={amplopTerbuka ? saatGulir : undefined} extraBawah={120}>
      {!amplopTerbuka ? (
        <View style={styles.pusat}>
          <Muncul>
            <Text style={[tipografi.keterangan, styles.tengah]}>
              Ada sesuatu yang ditulis khusus buat kamu —
              geser amplopnya ke atas pelan-pelan ya
            </Text>
          </Muncul>
          <Amplop saatTerbuka={() => setAmplopTerbuka(true)} />
        </View>
      ) : (
        <Muncul>
          <View
            style={styles.kertas}
            onLayout={(e) => {
              offsetBlokRef.current = e.nativeEvent.layout.y;
              tinggiKertasRef.current = e.nativeEvent.layout.height;
            }}
          >
            <Text style={tipografi.subjudul}>{konten.surat.salamPembuka}</Text>

            <View style={styles.isi}>
              {paragraf.map((teks, i) => (
                <View
                  key={i}
                  onLayout={(e) => {
                    posisiRef.current[i] = e.nativeEvent.layout.y;
                    // Paragraf yang sudah berada di viewport awal langsung tampil
                    periksaParagraf();
                  }}
                >
                  <ParagrafSurat teks={teks} aktif={tampih[i]} urutan={0} />
                </View>
              ))}

              {tampih.every(Boolean) || paragraf.length === 0 ? (
                <Muncul>
                  <View style={styles.penutup}>
                    <Text style={tipografi.body}>{konten.surat.kalimatPenutup}</Text>
                    <Text style={[tipografi.subjudul, styles.ttd]}>{konten.surat.tandaTangan}</Text>
                    <TombolUtama label="Lanjut" onPress={lanjut} gaya={styles.tombol} />
                  </View>
                </Muncul>
              ) : null}
            </View>
          </View>
        </Muncul>
      )}

      <PemutarMini />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pusat: { flex: 1, justifyContent: 'center', gap: spasi.blok, minHeight: 360 },
  tengah: { textAlign: 'center' },
  kertas: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    padding: spasi.blok,
  },
  isi: { marginTop: spasi.blok },
  penutup: { gap: spasi.item, marginTop: spasi.blok },
  ttd: { color: warna.aksen, textAlign: 'right' },
  tombol: { alignSelf: 'stretch', marginTop: spasi.item },
});
