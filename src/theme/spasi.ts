import { Easing } from 'react-native-reanimated';

/**
 * Spasi, radius, dan gerak.
 * - Padding horizontal 24, jarak antarblok minimal 32 (spesifikasi).
 * - Sudut membulat 16, bayangan lembut, tanpa border tebal.
 * - Animasi 300–600ms dengan easing keluar-halus.
 */
export const spasi = {
  /** Padding horizontal layar */
  layar: 24,
  /** Jarak antarblok besar */
  blok: 32,
  /** Jarak antarelemen dalam satu blok */
  item: 16,
  /** Jarak kecil (label, ikon) */
  kecil: 8,
} as const;

export const radius = {
  /** Standar sudut membulat */
  sedang: 16,
  /** Kartu besar / amplop / kotak hadiah */
  besar: 24,
  /** Elemen bulat penuh (tombol pil, thumbnail) */
  penuh: 999,
} as const;

export const durasi = {
  cepat: 300,
  normal: 450,
  lambat: 600,
} as const;

/** Easing keluar-halus untuk semua transisi */
export const easingHalus = Easing.out(Easing.cubic);

/** Bayangan lembut siap pakai untuk kartu (platform iOS; Android pakai elevation) */
export const bayanganKartu = {
  shadowColor: '#000000',
  shadowOpacity: 0.45,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
} as const;
