import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { konten } from '@/data/content';

/**
 * Pemutar musik aplikasi.
 * - TIDAK autoplay: audio baru jalan setelah nyalakan() dipanggil
 *   (tombol di layar Pembuka).
 * - Satu instance Sound; di-unload saat ganti lagu.
 * - Lagu habis -> otomatis lanjut lagu berikutnya (kembali ke awal daftar).
 */
type MusikApi = {
  /** Sudah pernah dinyalakan? Untuk mengubah label tombol di Pembuka. */
  dimulai: boolean;
  /** Indeks lagu aktif; null berarti belum ada yang diputar. */
  laguAktif: number | null;
  /** Sedang memutar (bukan jeda). */
  sedangPutar: boolean;
  /** Nyalakan musik pertama kali (mulai dari lagu pertama). */
  nyalakan: () => void;
  /** Putar lagu tertentu berdasarkan indeks. */
  alihkan: (indeks: number) => void;
  jeda: () => void;
  lanjut: () => void;
  berikutnya: () => void;
  sebelumnya: () => void;
};

const MusikContext = createContext<MusikApi | null>(null);

export function MusikProvider({ children }: { children: ReactNode }) {
  const [dimulai, setDimulai] = useState(false);
  const [laguAktif, setLaguAktif] = useState<number | null>(null);
  const [sedangPutar, setSedangPutar] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const versiRef = useRef(0); // pembatal callback dari lagu yang sudah dibuang
  const laguAktifRef = useRef<number | null>(null);

  const bersihkan = useCallback(() => {
    const lama = soundRef.current;
    soundRef.current = null;
    if (lama) {
      lama.setOnPlaybackStatusUpdate(null);
      lama.unloadAsync().catch(() => {});
    }
  }, []);

  useEffect(() => bersihkan, [bersihkan]);

  const putar = useCallback(
    (indeks: number) => {
      const lagu = konten.musik.lagu[indeks];
      if (!lagu) return;

      setLaguAktif(indeks);
      laguAktifRef.current = indeks;
      setDimulai(true);
      bersihkan();

      const versi = ++versiRef.current;
      (async () => {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            shouldDuckAndroid: true,
          });
          const { sound } = await Audio.Sound.createAsync(
            lagu.file as number,
            { shouldPlay: true, isLooping: false },
            (status) => {
              if (versi !== versiRef.current) return; // lagu sudah diganti
              if (!status.isLoaded) return;
              setSedangPutar(status.isPlaying);
              if (status.didJustFinish) {
                const total = konten.musik.lagu.length;
                const kini = laguAktifRef.current ?? 0;
                putarRef.current((kini + 1) % total);
              }
            },
          );
          if (versi !== versiRef.current) {
            sound.unloadAsync().catch(() => {});
            return;
          }
          soundRef.current = sound;
        } catch {
          setSedangPutar(false);
        }
      })();
    },
    [bersihkan],
  );

  // jembatan agar callback status bisa memanggil putar tanpa re-render loop
  const putarRef = useRef(putar);
  useEffect(() => {
    putarRef.current = putar;
  }, [putar]);

  const api = useMemo<MusikApi>(
    () => ({
      dimulai,
      laguAktif,
      sedangPutar,
      nyalakan: () => {
        if (laguAktifRef.current === null) putar(0);
      },
      alihkan: putar,
      jeda: () => {
        soundRef.current?.pauseAsync().catch(() => {});
      },
      lanjut: () => {
        soundRef.current?.playAsync().catch(() => {});
      },
      berikutnya: () => {
        const total = konten.musik.lagu.length;
        const kini = laguAktifRef.current ?? 0;
        putar((kini + 1) % total);
      },
      sebelumnya: () => {
        const total = konten.musik.lagu.length;
        const kini = laguAktifRef.current ?? 0;
        putar((kini - 1 + total) % total);
      },
    }),
    [dimulai, laguAktif, sedangPutar, putar],
  );

  return <MusikContext.Provider value={api}>{children}</MusikContext.Provider>;
}

export function useMusik(): MusikApi {
  const ctx = useContext(MusikContext);
  if (!ctx) throw new Error('useMusik harus dipakai di dalam MusikProvider');
  return ctx;
}
