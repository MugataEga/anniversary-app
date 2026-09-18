import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { konten } from '@/data/content';
import { useMusik } from '@/hooks/useMusik';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, radius } from '@/theme/spasi';

/**
 * Pemutar mini persisten di bawah layar (mulai dari layar Surat).
 * Diketuk -> meluas, menampilkan alasan personal lagu yang sedang diputar.
 * Kalau belum ada lagu aktif (belum dinyalakan), tampil bar dengan ajakan.
 */
export function PemutarMini() {
  const musik = useMusik();
  const [terbuka, setTerbuka] = useState(false);

  const lagu = musik.laguAktif !== null ? konten.musik.lagu[musik.laguAktif] : null;

  const ubah = () => setTerbuka((t) => !t);

  return (
    <View style={[styles.kartu, bayanganKartu]}>
      {/* Baris utama: kontrol + judul */}
      <View style={styles.baris}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            if (!musik.dimulai || musik.laguAktif === null) musik.nyalakan();
            else if (musik.sedangPutar) musik.jeda();
            else musik.lanjut();
          }}
          accessibilityRole="button"
          accessibilityLabel={musik.sedangPutar ? 'Jeda musik' : 'Putar musik'}
          style={styles.tombolUtama}
          hitSlop={8}
        >
          <Ionicons
            name={musik.sedangPutar ? 'pause' : 'play'}
            size={20}
            color={warna.latar}
            style={musik.sedangPutar ? undefined : styles.geserPlay}
          />
        </Pressable>

        <View style={styles.teks}>
          {lagu ? (
            <>
              <Text numberOfLines={1} style={styles.judulLagu}>
                {lagu.judul} — {lagu.artis}
              </Text>
              <Text numberOfLines={1} style={styles.subLagu}>
                {terbuka ? 'Ketuk untuk tutup' : 'Ketuk untuk alasan lagu ini'}
              </Text>
            </>
          ) : (
            <>
              <Text numberOfLines={1} style={styles.judulLagu}>
                Musik belum nyala
              </Text>
              <Text numberOfLines={1} style={styles.subLagu}>
                Tekan tombol putar buat mulai
              </Text>
            </>
          )}
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            musik.berikutnya();
          }}
          accessibilityRole="button"
          accessibilityLabel="Lagu berikutnya"
          style={styles.tombolKecil}
          hitSlop={8}
        >
          <Ionicons name="play-skip-forward" size={18} color={warna.teksSekunder} />
        </Pressable>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            musik.sebelumnya();
          }}
          accessibilityRole="button"
          accessibilityLabel="Lagu sebelumnya"
          style={styles.tombolKecil}
          hitSlop={8}
        >
          <Ionicons name="play-skip-back" size={18} color={warna.teksSekunder} />
        </Pressable>
      </View>

      {/* Bagian meluas: alasan personal lagu */}
      {terbuka && lagu ? (
        <Pressable onPress={ubah} style={styles.alasanBlok}>
          <Text style={styles.alasanJudul}>Kenapa lagu ini?</Text>
          <Text style={tipografi.keterangan}>{lagu.alasan}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  baris: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  tombolUtama: {
    width: 40,
    height: 40,
    borderRadius: radius.penuh,
    backgroundColor: warna.aksen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geserPlay: { marginLeft: 2 },
  teks: { flex: 1, marginLeft: 12, marginRight: 6 },
  judulLagu: {
    fontFamily: namaFont.bodyTebal,
    fontSize: 14,
    color: warna.teks,
  },
  subLagu: {
    fontFamily: namaFont.body,
    fontSize: 12,
    color: warna.teksSekunder,
    marginTop: 2,
  },
  tombolKecil: { paddingHorizontal: 8, paddingVertical: 10 },
  alasanBlok: { marginTop: 10, gap: 4, paddingBottom: 4 },
  alasanJudul: {
    fontFamily: namaFont.bodyTebal,
    fontSize: 13,
    color: warna.emas,
  },
});
