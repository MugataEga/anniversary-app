/**
 * Palet warna "Dua Tahun" — versi ungu-magenta-pink-kuning.
 * Warna inti dari palet baru:
 *   ungu    #5003C0  (nada dasar gelap aplikasi)
 *   magenta #AB03A9  (pita, detail, gradasi)
 *   pink    #FF467A  (aksen utama / tombol)
 *   kuning  #FFD51E  (aksen sekunder)
 * Latar & permukaan adalah turunan gelap dari ungu agar tema tetap gelap
 * dan teksnya terbaca. Semua komponen wajib ambil warna dari sini.
 */
export const warna = {
  /** Latar utama layar (violet sangat gelap, turunan #5003C0) */
  latar: '#160723',
  /** Permukaan kartu / kotak */
  permukaan: '#241243',
  /** Permukaan lebih terang — flap amplop, tutup kotak kejutan */
  permukaanTerang: '#2F1A55',
  /** Aksen utama — pink (tombol, highlight, ikon aktif) */
  aksen: '#FF467A',
  /** Pink muda — variasi serutan confetti */
  aksenMuda: '#FF8FB0',
  /** Aksen sekunder — kuning (label, angka, segel) */
  emas: '#FFD51E',
  /** Aksen magenta — pita & detail kejutan */
  magenta: '#AB03A9',
  /** Aksen ungu — gradasi & detail */
  ungu: '#5003C0',
  /** Teks utama */
  teks: '#F5EDE8',
  /** Teks sekunder / keterangan */
  teksSekunder: '#A99BC4',
  /** Turunan tipis untuk garis pembatas & bayangan */
  garis: 'rgba(255, 70, 122, 0.25)',
  bayangan: 'rgba(0, 0, 0, 0.5)',
} as const;
