import { useEffect, useState } from 'react';

/**
 * Parse tanggal format YYYY-MM-DD.
 * Mengembalikan null kalau masih placeholder (mis. '[YYYY-MM-DD]') atau
 * tidak valid — supaya UI menampilkan hint, bukan crash.
 */
export function parseTanggal(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const tgl = new Date(y, m - 1, d, 0, 0, 0, 0);
  return Number.isNaN(tgl.getTime()) ? null : tgl;
}

/** Tanggal masih placeholder? Untuk menampilkan hint "isi dulu di content.ts". */
export function masihPlaceholder(iso: string): boolean {
  return parseTanggal(iso) === null;
}

type BagianWaktu = { hari: number; jam: number; menit: number; detik: number };

function hitung(dari: Date, ke: Date): BagianWaktu {
  const selisih = Math.max(0, ke.getTime() - dari.getTime());
  const detikTotal = Math.floor(selisih / 1000);
  return {
    hari: Math.floor(detikTotal / 86400),
    jam: Math.floor((detikTotal % 86400) / 3600),
    menit: Math.floor((detikTotal % 3600) / 60),
    detik: detikTotal % 60,
  };
}

/**
 * Counter hidup "kita sudah bersama ..." — diperbarui tiap 30 detik
 * (menit paling kecil yang ditampilkan, jadi 30 detik cukup dan hemat).
 */
export function gunakanHitungBersama(tanggalJadian: Date | null): BagianWaktu | null {
  const [kini, setKini] = useState(() => new Date());
  useEffect(() => {
    if (!tanggalJadian) return;
    const id = setInterval(() => setKini(new Date()), 30_000);
    return () => clearInterval(id);
  }, [tanggalJadian]);
  if (!tanggalJadian) return null;
  return hitung(tanggalJadian, kini);
}

/**
 * Hitung mundur ke tanggal anniversary — diperbarui tiap detik
 * (tampilkan sampai detik biar terasa hidup saat menunggu).
 */
export function gunakanHitungMundur(tanggalTarget: Date | null): BagianWaktu | null {
  const [kini, setKini] = useState(() => new Date());
  useEffect(() => {
    if (!tanggalTarget) return;
    const id = setInterval(() => setKini(new Date()), 1_000);
    return () => clearInterval(id);
  }, [tanggalTarget]);
  if (!tanggalTarget) return null;
  return hitung(kini, tanggalTarget);
}

/** Format angka dua digit, mis. 7 -> '07'. */
export function duaDigit(n: number): string {
  return String(n).padStart(2, '0');
}
