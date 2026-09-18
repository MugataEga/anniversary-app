import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { PemutarMini } from '@/components/PemutarMini';
import { konten } from '@/data/content';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { radius, spasi } from '@/theme/spasi';

/**
 * Detail satu momen timeline — layar penuh: foto besar di atas,
 * tanggal, judul serif, cerita penuh. Tombol kembali di kiri atas.
 */
export default function LayarMomen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const indeks = Number(Array.isArray(id) ? id[0] : id);
  const momen = konten.timeline.momen[indeks];

  if (!momen) {
    return (
      <View style={[styles.root, styles.pusat]}>
        <Text style={tipografi.body}>Momen ini nggak ada. Coba buka dari timeline ya.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.isi}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali ke timeline"
          onPress={() => router.back()}
          style={styles.kembali}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={26} color={warna.teks} />
        </Pressable>

        <View style={styles.fotoWrap}>
          <Image
            source={momen.foto}
            style={styles.foto}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.tanggal}>{momen.tanggal}</Text>
        <Text style={styles.judul}>{momen.judul}</Text>
        <Text style={tipografi.body}>{momen.cerita}</Text>
      </ScrollView>

      <View style={styles.pemutarWrap}>
        <PemutarMini />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: warna.latar },
  pusat: { alignItems: 'center', justifyContent: 'center' },
  isi: {
    paddingTop: 64,
    paddingBottom: 140,
    paddingHorizontal: spasi.layar,
    gap: spasi.item,
  },
  kembali: {
    position: 'absolute',
    top: 56,
    left: spasi.layar,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: radius.penuh,
    backgroundColor: 'rgba(36, 18, 67, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoWrap: { marginTop: spasi.item },
  foto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.besar,
    backgroundColor: warna.permukaan,
  },
  tanggal: {
    fontFamily: namaFont.bodySedang,
    fontSize: 13,
    color: warna.emas,
    fontVariant: ['tabular-nums'],
  },
  judul: {
    fontFamily: namaFont.judul,
    fontSize: 30,
    lineHeight: 38,
    color: warna.teks,
  },
  pemutarWrap: { position: 'absolute', left: 0, right: 0, bottom: 16 },
});
