import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { Screen } from '@/components/Screen';
import { Judul } from '@/components/Judul';
import { konten } from '@/data/content';
import { masihPlaceholder } from '@/hooks/gunakanHitungWaktu';
import { warna } from '@/theme/warna';
import { namaFont, tipografi } from '@/theme/tipografi';
import { bayanganKartu, radius, spasi } from '@/theme/spasi';

type Butir = { label: string; selesai: boolean };
type Kelompok = { nama: string; butir: Butir[] };

/** Teks terisi kalau tidak kosong dan tidak mengandung placeholder '[...]'. */
const terisi = (teks: string) => teks.trim() !== '' && !teks.includes('[');
const terisiTanggal = (iso: string) => !masihPlaceholder(iso);

function soalSelesai(s: { pertanyaan: string; pilihan: string[] }): boolean {
  return terisi(s.pertanyaan) && s.pilihan.every(terisi);
}

function bangunDaftar(): Kelompok[] {
  const identitas: Butir[] = [
    { label: 'Nama pacar', selesai: terisi(konten.identitas.namaPenerima) },
    { label: 'Namamu', selesai: terisi(konten.identitas.namaPengirim) },
    { label: 'Tanggal jadian', selesai: terisiTanggal(konten.identitas.tanggalJadian) },
    { label: 'Tanggal anniversary', selesai: terisiTanggal(konten.identitas.tanggalAnniversary) },
  ];
  if (konten.identitas.bypassKunci) {
    identitas.push({ label: 'bypassKunci masih aktif — matikan sebelum hari-H', selesai: false });
  }

  const kuis: Butir[] = konten.kuis.soal.map((s, i) => ({
    label: `Soal ${i + 1} (pertanyaan + 4 pilihan)`,
    selesai: soalSelesai(s),
  }));
  kuis.push(
    { label: 'Pesan skor rendah (0-3)', selesai: terisi(konten.kuis.pesanSkor.rendah) },
    { label: 'Pesan skor sedang (4-6)', selesai: terisi(konten.kuis.pesanSkor.sedang) },
    { label: 'Pesan skor sempurna (7)', selesai: terisi(konten.kuis.pesanSkor.tinggi) },
  );

  const timeline: Butir[] = konten.timeline.momen.map((m, i) => ({
    label: `Momen ${i + 1}: tanggal, judul, cerita`,
    selesai: terisiTanggal(m.tanggal) && terisi(m.judul) && terisi(m.cerita),
  }));

  const galeri: Butir[] = konten.galeri.foto.map((f, i) => ({
    label: `Caption foto ${i + 1}`,
    selesai: terisi(f.caption),
  }));

  const musik: Butir[] = konten.musik.lagu.map((l, i) => ({
    label: `Lagu ${i + 1}: judul, artis, alasan`,
    selesai: terisi(l.judul) && terisi(l.artis) && terisi(l.alasan),
  }));

  const surat: Butir[] = [
    { label: 'Salam pembuka', selesai: terisi(konten.surat.salamPembuka) },
    ...konten.surat.paragraf.map((p, i) => ({
      label: `Paragraf surat ${i + 1}`,
      selesai: terisi(p),
    })),
    { label: 'Kalimat penutup', selesai: terisi(konten.surat.kalimatPenutup) },
    { label: 'Tanda tangan', selesai: terisi(konten.surat.tandaTangan) },
  ];

  return [
    { nama: 'Identitas', butir: identitas },
    { nama: 'Pembuka', butir: [{ label: 'Kalimat pembuka', selesai: terisi(konten.pembuka.kalimatPembuka) }] },
    { nama: 'Surat', butir: surat },
    { nama: 'Kejutan', butir: [{ label: 'Pesan kejutan', selesai: terisi(konten.kejutan.pesanKejutan) }] },
    { nama: 'Kuis', butir: kuis },
    { nama: 'Timeline', butir: timeline },
    { nama: 'Galeri', butir: galeri },
    { nama: 'Musik', butir: musik },
  ];
}

/**
 * Layar tersembunyi (utilitas): checklist placeholder di content.ts.
 * Dibuka dengan mengetuk 5x kartu hitungan di layar Pembuka.
 */
export default function LayarPetunjuk() {
  const router = useRouter();
  const kelompok = bangunDaftar();
  const semua = kelompok.flatMap((k) => k.butir);
  const jumlahSelesai = semua.filter((b) => b.selesai).length;
  const beres = jumlahSelesai === semua.length;

  return (
    <Screen scroll>
      <Judul
        teks="Cek isi"
        keterangan="Checklist konten yang belum diisi di src/data/content.ts. Layar ini tersembunyi — buka lagi dengan mengetuk 5x kartu hitungan di layar pembuka."
      />

      <View style={[styles.kartuProgres, bayanganKartu]}>
        <Text style={styles.angkaProgres}>
          {jumlahSelesai} dari {semua.length}
        </Text>
        <Text style={tipografi.keterangan}>
          {beres ? 'Semua sudah diisi — tinggal ganti foto & lagunya, siap dipakai.' : 'Sisanya tinggal kamu yang isi. Yang belum ditandai bulat kosong.'}
        </Text>
      </View>

      {kelompok.map((k) => (
        <View key={k.nama} style={styles.kelompok}>
          <Text style={tipografi.subjudul}>{k.nama}</Text>
          {k.butir.map((b) => (
            <View key={b.label} style={styles.baris}>
              <Ionicons
                name={b.selesai ? 'checkmark-circle' : 'ellipse-outline'}
                size={18}
                color={b.selesai ? warna.aksen : warna.teksSekunder}
              />
              <Text style={[styles.label, !b.selesai && styles.labelBelum]}>{b.label}</Text>
            </View>
          ))}
        </View>
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        onPress={() => router.back()}
        style={styles.kembali}
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={22} color={warna.teks} />
        <Text style={styles.kembaliLabel}>Kembali</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kartuProgres: {
    backgroundColor: warna.permukaan,
    borderRadius: radius.sedang,
    padding: spasi.blok,
    gap: 8,
  },
  angkaProgres: {
    fontFamily: namaFont.judul,
    fontSize: 28,
    color: warna.teks,
  },
  kelompok: { gap: 12 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: {
    fontFamily: namaFont.body,
    fontSize: 14,
    lineHeight: 21,
    color: warna.teks,
    flex: 1,
  },
  labelBelum: { color: warna.teksSekunder },
  kembali: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.penuh,
    backgroundColor: warna.permukaan,
  },
  kembaliLabel: {
    fontFamily: namaFont.bodySedang,
    fontSize: 14,
    color: warna.teks,
  },
});
