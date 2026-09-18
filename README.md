# Dua Tahun 💞

Hadiah anniversary ke-2 untuk Winda. Aplikasi Expo (React Native + TypeScript),
100% offline — tanpa backend, tanpa login. Semua konten personal ada di **satu
file**: `src/data/content.ts`.

## Menjalankan untuk development

```bash
npm install
npx expo start
```

Lalu buka **Expo Go** di HP (scan QR di terminal), atau tekan `w` untuk web.
Pratinjau web bersifat perkiraan — pengalaman utuh (haptic, gesture, musik)
tetap di Expo Go / APK.

## Verifikasi cepat sebelum build

```bash
npx tsc --noEmit    # harus bersih
npx expo-doctor     # harus 21/21
```

## Build APK (install langsung di HP, tanpa Expo Go)

Build dilakukan di cloud Expo (gratis, butuh akun Expo):

```bash
npm install -g eas-cli     # sekali saja
eas login                  # login akun Expo
eas build -p android --profile preview
```

- Konfigurasi build ada di `eas.json` — profil `preview` sengaja dibuat
  menghasilkan **APK** (`buildType: apk`), bukan AAB, supaya filenya bisa
  langsung dipasang ke HP.
- Tunggu ±10–20 menit; di akhir muncul **link download APK**.
- Kirim APK itu ke HP Winda (WhatsApp/drive), buka, izinkan "install dari
  sumber tidak dikenal", selesai.

Alternatif tanpa akun (butuh Android Studio, build di komputer sendiri):

```bash
npx expo prebuild -p android   # generate folder android/
cd android && ./gradlew assembleRelease
# hasil: android/app/build/outputs/apk/release/app-release.apk
```

> Catatan: jalankan `npx expo prebuild` lagi setiap kali `app.json` berubah.

## Checklist hari-H

1. Ganti 8 foto di `assets/photos/` (nama file tetap: `foto-1.png` … `foto-8.png`).
2. Ganti 3 lagu di `assets/music/` dengan file asli — file bawaan masih nada
   placeholder. Kalau formatnya mp3, sesuaikan `require()`-nya di
   `src/data/content.ts` bagian `musik.lagu`.
3. Buka aplikasi → ketuk 5× kartu hitungan di layar pembuka → layar
   **"Cek isi"** memastikan tidak ada konten yang masih kosong.
4. Pastikan `bypassKunci: false` di `src/data/content.ts` (kotak kejutan
   otomatis terbuka 13 Oktober 2026).
5. Build APK (perintah di atas) dan pasang di HP Winda.

Progres alur tersimpan otomatis di perangkat (AsyncStorage) — ditutup lalu
dibuka lagi, dia lanjut dari tempat terakhirnya.
