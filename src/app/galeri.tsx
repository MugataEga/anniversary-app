import { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { Judul } from '@/components/Judul';
import { PemutarMini } from '@/components/PemutarMini';
import { konten } from '@/data/content';
import { useProgres } from '@/hooks/useProgres';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, radius, spasi } from '@/theme/spasi';

const { width: LEBAR_LAYAR } = Dimensions.get('window');
const LEBAR_SEL = (LEBAR_LAYAR - spasi.layar * 2 - 12) / 2;

type Foto = (typeof konten.galeri.foto)[number];

/** Sel grid galeri. */
function SelFoto({ foto, urutan, ketuk }: { foto: Foto; urutan: number; ketuk: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Buka foto ${urutan + 1}`}
      onPress={ketuk}
      style={({ pressed }) => [styles.sel, bayanganKartu, pressed && styles.tekan]}
    >
      <Image source={foto.sumber} style={styles.fotoSel} resizeMode="cover" />
    </Pressable>
  );
}

/**
 * Layar penuh: FlatList horizontal antarfoto + caption.
 * Swipe ke bawah cukup jauh -> tutup (dengan haptic).
 */
function PenampilPenuh({ indeksAwal, tutup }: { indeksAwal: number; tutup: () => void }) {
  const fotoList = konten.galeri.foto;
  const listRef = useRef<FlatList<Foto>>(null);
  const [indeks, setIndeks] = useState(indeksAwal);
  const geserY = useSharedValue(0);

  const tutupDariGestur = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    tutup();
  };

  const gestur = Gesture.Pan()
    .activeOffsetY(18)
    .failOffsetX([-30, 30])
    .onUpdate((e) => {
      geserY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 130) {
        runOnJS(tutupDariGestur)();
        return;
      }
      geserY.value = withSpring(0, { damping: 20, stiffness: 240 });
    });

  const gayaSlide = useAnimatedStyle(() => ({
    transform: [{ translateY: geserY.value }],
    opacity: 1 - Math.min(0.6, geserY.value / 500),
  }));

  const saatGulir = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / LEBAR_LAYAR);
    if (i !== indeks) setIndeks(i);
  };

  return (
    <Animated.View style={[styles.penampil, gayaSlide]}>
      <FlatList
        ref={listRef}
        data={fotoList}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        initialScrollIndex={indeksAwal}
        getItemLayout={(_, i) => ({
          length: LEBAR_LAYAR,
          offset: LEBAR_LAYAR * i,
          index: i,
        })}
        onMomentumScrollEnd={saatGulir}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <GestureDetector gesture={gestur}>
            <Animated.View style={styles.halaman}>
              <Image source={item.sumber} style={styles.fotoPenuh} resizeMode="contain" />
            </Animated.View>
          </GestureDetector>
        )}
      />
      <View style={styles.captionWrap}>
        <Text style={tipografi.keterangan}>{fotoList[indeks]?.caption}</Text>
        <Text style={[tipografi.keterangan, styles.hitung]}>
          {indeks + 1} / {fotoList.length} — geser ke bawah buat nutup
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tutup penampil foto"
        onPress={tutup}
        style={styles.tutupTombol}
        hitSlop={12}
      >
        <Ionicons name="close" size={26} color={warna.teks} />
      </Pressable>
    </Animated.View>
  );
}

/**
 * Layar 6 — Galeri. Grid 2 kolom; ketuk -> layar penuh dengan
 * swipe antarfoto, caption di bawah, swipe ke bawah untuk menutup.
 */
export default function LayarGaleri() {
  const router = useRouter();
  const { tandaiSelesai } = useProgres();
  const [buka, setBuka] = useState<number | null>(null);

  const foto = konten.galeri.foto;
  const dataSel = useMemo(() => foto.map((f, i) => ({ foto: f, urutan: i })), [foto]);

  return (
    <View style={styles.root}>
      <FlatList
        style={StyleSheet.absoluteFill}
        data={dataSel}
        keyExtractor={(item) => String(item.urutan)}
        numColumns={2}
        columnWrapperStyle={styles.barisGrid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.isi}
        ListHeaderComponent={
          <Judul teks="Galeri kita" keterangan="Kumpulan potongan momen favorit" />
        }
        renderItem={({ item }: { item: { foto: Foto; urutan: number } }) => (
          <SelFoto
            foto={item.foto}
            urutan={item.urutan}
            ketuk={() => {
              setBuka(item.urutan);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }}
          />
        )}
      />

      {buka !== null ? (
        <PenampilPenuh indeksAwal={buka} tutup={() => setBuka(null)} />
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        onPress={() => {
          tandaiSelesai('galeri');
          router.back();
        }}
        style={styles.kembali}
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={24} color={warna.teks} />
        <Text style={styles.kembaliLabel}>Kembali</Text>
      </Pressable>

      <View style={styles.pemutarWrap}>
        <PemutarMini />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: warna.latar },
  isi: {
    paddingTop: 116,
    paddingBottom: 140,
    paddingHorizontal: spasi.layar,
    gap: 12,
  },
  barisGrid: { gap: 12 },
  sel: {
    width: LEBAR_SEL,
    height: LEBAR_SEL,
    borderRadius: radius.sedang,
    overflow: 'hidden',
    backgroundColor: warna.permukaan,
  },
  tekan: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  fotoSel: { width: '100%', height: '100%' },
  penampil: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 7, 35, 0.98)',
    zIndex: 20,
  },
  halaman: { width: LEBAR_LAYAR, flex: 1, alignItems: 'center', justifyContent: 'center' },
  fotoPenuh: { width: '100%', height: '100%' },
  captionWrap: {
    paddingHorizontal: spasi.layar,
    paddingBottom: 96,
    gap: 4,
    alignItems: 'center',
  },
  hitung: { color: warna.teksSekunder },
  tutupTombol: {
    position: 'absolute',
    top: 56,
    right: spasi.layar,
    width: 44,
    height: 44,
    borderRadius: radius.penuh,
    backgroundColor: 'rgba(36, 18, 67, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kembali: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'absolute',
    top: 56,
    left: spasi.layar,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.penuh,
    backgroundColor: 'rgba(36, 18, 67, 0.9)',
  },
  kembaliLabel: {
    fontFamily: namaFont.bodySedang,
    fontSize: 14,
    color: warna.teks,
  },
  pemutarWrap: { position: 'absolute', left: 0, right: 0, bottom: 16 },
});
