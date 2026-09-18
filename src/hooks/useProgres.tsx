import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Kunci penyimpanan — naikkan :v2 kalau struktur berubah. */
const KUNCI = '@duatahun/progres:v1';

/**
 * Langkah alur yang bisa ditandai selesai.
 * Pembuka tidak perlu (selalu terbuka); surat membuka kejutan, dst.
 */
export type Langkah = 'surat' | 'kejutan' | 'kuis' | 'timeline' | 'galeri';

type Progres = { selesai: Langkah[] };

type ProgresApi = {
  /** Sudah dimuat dari storage? Jangan gate sebelum true. */
  dimuat: boolean;
  /** Daftar langkah yang sudah selesai */
  selesai: Langkah[];
  /** Tandai satu langkah selesai (idempoten, langsung tersimpan) */
  tandaiSelesai: (langkah: Langkah) => void;
  /** Cek satu langkah sudah selesai */
  sudahSelesai: (langkah: Langkah) => boolean;
};

const ProgresContext = createContext<ProgresApi | null>(null);

export function ProgresProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Progres | null>(null);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const mentah = await AsyncStorage.getItem(KUNCI);
        const parsed: Progres = mentah ? JSON.parse(mentah) : { selesai: [] };
        if (!batal) {
          setData({ selesai: Array.isArray(parsed.selesai) ? parsed.selesai : [] });
        }
      } catch {
        if (!batal) setData({ selesai: [] });
      }
    })();
    return () => {
      batal = true;
    };
  }, []);

  const tandaiSelesai = useCallback((langkah: Langkah) => {
    setData((lama) => {
      const dasar = lama ?? { selesai: [] };
      if (dasar.selesai.includes(langkah)) return lama;
      const baru: Progres = { selesai: [...dasar.selesai, langkah] };
      // Simpan di luar render — gagal storage tidak menggagalkan UI
      AsyncStorage.setItem(KUNCI, JSON.stringify(baru)).catch(() => {});
      return baru;
    });
  }, []);

  const nilai = useMemo<ProgresApi>(
    () => ({
      dimuat: data !== null,
      selesai: data?.selesai ?? [],
      tandaiSelesai,
      sudahSelesai: (langkah) => data?.selesai.includes(langkah) ?? false,
    }),
    [data, tandaiSelesai],
  );

  return <ProgresContext.Provider value={nilai}>{children}</ProgresContext.Provider>;
}

export function useProgres(): ProgresApi {
  const ctx = useContext(ProgresContext);
  if (!ctx) throw new Error('useProgres harus dipakai di dalam ProgresProvider');
  return ctx;
}
