import { TextStyle } from 'react-native';
import { warna } from './warna';

/**
 * Tipografi aplikasi.
 * Font dimuat di app/_layout.tsx lewat useFonts (lihat src/hooks/useFont.tsx).
 * Judul: Playfair Display (serif). Body: Inter (sans-serif).
 */
export const namaFont = {
  judul: 'PlayfairDisplay-Bold',
  body: 'Inter-Regular',
  bodySedang: 'Inter-Medium',
  bodyTebal: 'Inter-SemiBold',
} as const;

const dasar: TextStyle = {
  color: warna.teks,
  fontFamily: namaFont.body,
  fontSize: 16,
  lineHeight: 16 * 1.7, // body 16px, line-height 1.7 sesuai spesifikasi
};

export const tipografi = {
  /** Judul layar besar (28–32px, serif) */
  judulLayar: {
    fontFamily: namaFont.judul,
    fontSize: 30,
    lineHeight: 40,
    color: warna.teks,
  } as TextStyle,
  /** Judul bagian / kartu */
  subjudul: {
    fontFamily: namaFont.bodyTebal,
    fontSize: 18,
    lineHeight: 26,
    color: warna.teks,
  } as TextStyle,
  /** Teks body standar */
  body: dasar,
  /** Angka counter (tabular agar tidak goyang saat berubah) */
  angka: {
    fontFamily: namaFont.bodySedang,
    fontSize: 16,
    lineHeight: 24,
    fontVariant: ['tabular-nums'],
    color: warna.teks,
  } as TextStyle,
  /** Label kecil / keterangan */
  keterangan: {
    fontFamily: namaFont.body,
    fontSize: 13,
    lineHeight: 20,
    color: warna.teksSekunder,
  } as TextStyle,
} as const;
