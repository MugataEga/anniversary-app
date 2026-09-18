import { StyleSheet, Text, View } from 'react-native';
import { warna } from '@/theme/warna';
import { tipografi } from '@/theme/tipografi';

/** Judul layar serif besar + keterangan kecil opsional di bawahnya. */
export function Judul({
  teks,
  keterangan,
}: {
  teks: string;
  keterangan?: string;
}) {
  return (
    <View style={styles.blok}>
      <Text style={[tipografi.judulLayar, { color: warna.teks }]}>{teks}</Text>
      {keterangan ? (
        <Text style={[tipografi.keterangan, { color: warna.teksSekunder }]}>{keterangan}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  blok: { gap: 10 },
});
