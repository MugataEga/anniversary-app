import { ImageSourcePropType } from 'react-native';

/* ============================================================================
 *  KONTEN APLIKASI "DUA TAHUN"
 * ----------------------------------------------------------------------------
 *  SEMUA konten personal ada di file ini. Kamu TIDAK perlu menyentuh file
 *  lain — ganti teks di sini, langsung tampil di aplikasi.
 *
 *  Foto: taruh fotomu di assets/photos/ dengan nama foto-1.jpg … foto-6.jpg
 *  (dan foto-7.png, foto-8.png) — kalau ganti nama/format, sesuaikan
 *  require() di bawah.
 *
 *  Musik: taruh 3 file lagu di assets/music/ (lagu-1.mp3 ... lagu-3.mp3),
 *  lalu sesuaikan require() di bagian musik di bawah.
 *  File di repo sekarang masih nada placeholder, bukan lagu asli!
 * ========================================================================== */

/** Satu foto di galeri. */
export type Foto = {
  /** Sumber gambar — hasil require() file di assets/photos/ */
  sumber: ImageSourcePropType;
  /** Keterangan singkat yang tampil di bawah foto (galeri & layar penuh) */
  caption: string;
};

/** Satu momen di timeline, diurutkan dari yang paling lama. */
export type Momen = {
  /** Tanggal kejadian, format YYYY-MM-DD */
  tanggal: string;
  /** Judul singkat momen */
  judul: string;
  /** Foto pendamping — pakai salah satu foto dari daftar galeri di bawah */
  foto: ImageSourcePropType;
  /** Cerita pendek tentang momen ini (boleh beberapa paragraf, pisah dengan \n\n) */
  cerita: string;
};

/** Satu pertanyaan kuis "Seberapa kenal kita". */
export type SoalKuis = {
  /** Teks pertanyaannya */
  pertanyaan: string;
  /** Empat pilihan jawaban */
  pilihan: string[];
  /** Indeks jawaban benar utama (0 = pilihan pertama, 3 = pilihan terakhir) */
  indeksBenar: number;
  /** Indeks lain yang juga dihitung benar (opsional — kalau jawabannya lebih dari satu) */
  indeksBenarTambahan?: number[];
  /** Feedback manis kalau dia jawab benar (opsional; kosongkan pakai bawaan) */
  pesanBenar?: string;
  /** Feedback hangat kalau salah — jangan menghukum (opsional) */
  pesanSalah?: string;
};

/** Satu lagu di pemutar musik. */
export type Lagu = {
  /** Judul lagu */
  judul: string;
  /** Nama penyanyi / band */
  artis: string;
  /** File audio lokal — hasil require() dari assets/music/ */
  file: number;
  /** Alasan personal kenapa lagu ini dipilih */
  alasan: string;
};

/** Seluruh konten aplikasi. Ubah nilainya saja, jangan ubah nama kuncinya. */
export const konten = {
  identitas: {
    /** Nama pacar — tampil besar di layar pembuka */
    namaPenerima: 'Winda Ayu Lestari',
    /** Namamu */
    namaPengirim: 'Mukgot Ega Sahputra',
    /** Tanggal kalian resmi jadian — dasar hitungan "kita sudah bersama..." */
    tanggalJadian: '2024-10-13',
    /** Tanggal anniversary ke-2 — kapan kotak kejutan boleh dibuka */
    tanggalAnniversary: '2026-10-13',
    /**
     * Flag testing: kalau true, kotak kejutan bisa dibuka kapan pun
     * walau tanggal anniversary belum tiba. Jangan lupa balikin ke false.
     */
    bypassKunci: false,
  },

  pembuka: {
    /** Kalimat pendek di atas nama penerima di layar pembuka */
    kalimatPembuka:
      'Jakarta, di suatu malam yang sepertinya biasa saja — tapi kali ini aku ingin menulis sesuatu yang tidak biasa.',
  },

  surat: {
    /** Salam pembuka surat */
    salamPembuka: 'Untuk kamu, yang paling tahu isi kepalaku.',
    /**
     * 5 slot paragraf isi surat. Muncul satu-satu saat dia meng-scroll.
     * Kalau mau lebih pendek, isi '' pada slot yang tidak terpakai.
     */
    paragraf: [
      'Dua tahun itu bukan angka. Dua tahun itu ratusan malam di mana aku pulang capek dan masih sempat cerita ke kamu soal hal-hal kecil yang sebenarnya nggak penting-penting amat. Tapi kamu selalu dengar. That\'s the thing about you — kamu bikin hal receh jadi berarti.',
      'Aku bukan orang yang gampang bilang perasaan. Kamu tahu itu. Tapi dua tahun bareng kamu ngajarin aku satu hal: nggak semua yang penting harus diucapkan besar-besar. Kadang cukup dengan tetap ada. Itu aja.',
      'Ada banyak versi diriku yang berubah sejak kenal kamu. Yang dulu susah percaya, sekarang belajar percaya lagi, pelan-pelan, tapi belajar. Kamu nggak pernah maksa aku buru-buru. You just let me be, dan itu yang bikin aku merasa aman.',
      'Aku tahu ke depan nggak selalu mudah. Ada kesibukanku, ada kesibukanmu, ada hari-hari yang bakal terasa jauh walau kita di kota yang sama. Tapi kalau ada satu hal yang aku yakin, itu adalah kita udah lewatin cukup banyak buat tahu — we\'re worth the effort. Selalu.',
      'Jadi di anniversary kita yang kedua ini, aku cuma mau bilang: terima kasih udah bertahan sama aku, sama segala kekuranganku. Terima kasih udah jadi rumah yang nggak perlu alamat buat ditemuin. I still choose you. Hari ini, dan hari-hari sesudahnya.',
    ],
    /** Kalimat penutup sebelum tanda tangan */
    kalimatPenutup: 'Happy Anniversary, sayang. Semoga yang berikutnya juga sama hangatnya — atau lebih.',
    /** Tanda tangan */
    tandaTangan: 'Selalu milikmu,\nEga',
  },

  kejutan: {
    /** Pesan yang muncul saat kotak kejutan berhasil dibuka */
    pesanKejutan:
      'Hai, sayang. Sebelum kamu lanjut scroll — ada satu hal kecil yang aku siapin buat kamu. Bukan hadiah biasa. Ini kuis. Tentang kita. Tentang dua tahun yang udah kita lewatin bareng. No pressure, tapi... aku harap kamu inget semuanya. Selamat mencoba.',
  },

  kuis: {
    /** Judul mini-game di layar kuis */
    judulKuis: 'Seberapa kenal kita?',
    /**
     * 7 pertanyaan. Pilihannya 4, jawaban benar ditandai indeksBenar (0-3).
     * Kalau jawabannya lebih dari satu, isi indeksBenarTambahan.
     */
    soal: [
      {
        pertanyaan: 'Di mana pertama kali kita ketemu?',
        pilihan: ['TMII', 'TIM', 'Ragunan', 'Blok M'],
        indeksBenar: 1,
      },
      {
        pertanyaan: 'Aku nembak kamu di mana?',
        pilihan: ['Di atas motor', 'Di dalam gedung', 'Di dalam mobil', 'Di Transjakarta'],
        indeksBenar: 1,
        pesanSalah: 'Bukan di Transjakarta ya — walau aku tahu banget itu cerita favorit kita. Coba inget-inget lagi, di dalam gedung kan?',
      },
      {
        pertanyaan: 'Tanggal berapa kita jadian?',
        pilihan: ['13 November', '10 November', '3 Oktober', '13 Oktober'],
        indeksBenar: 3,
      },
      {
        pertanyaan: 'Kado pertama yang aku kasih ke kamu?',
        pilihan: ['Cookies', 'Karet gelang', 'Totebag', 'Canvas'],
        indeksBenar: 2,
        indeksBenarTambahan: [3],
      },
      {
        pertanyaan: 'Momen paling "we almost broke up but didn\'t" — apa penyebabnya?',
        pilihan: ['Cheating', 'Chating', 'Chasing', 'Chattime'],
        indeksBenar: 0,
        // Feedback khusus: bukan yang layak dirayakan — lebih ke penyesalan.
        pesanBenar:
          'Iya... ini bagian yang paling nggak aku banggakan dari kita. Maaf ya, waktu itu. Makasih kamu tetap di sini walau aku pernah bikin kamu kecewa — aku janji nggak ngulanginnya lagi, dan kamu tahu aku serius.',
      },
      {
        pertanyaan: 'Hal pertama yang bikin aku naksir kamu?',
        pilihan: ['Kamu wibu', 'Kamu lucu', 'Kamu cantik', 'Kamu lugu'],
        // Semua jawaban benar — memang sengaja begitu.
        indeksBenar: 2,
        indeksBenarTambahan: [0, 1, 3],
      },
      {
        pertanyaan: 'Hal kecil yang selalu aku lakuin buat kamu tanpa diminta?',
        pilihan: ['Berkabar', 'Gift', 'run errands/rides', 'message'],
        indeksBenar: 2,
      },
    ] as SoalKuis[],
    /** Pesan akhir kuis, 3 rentang skor. */
    pesanSkor: {
      /** Skor 0-3 dari 7 */
      rendah:
        'Oke, jujur — nilai kamu agak jauh dari ekspektasi. Tapi it\'s fine. Yang penting bukan seberapa banyak kamu inget detailnya, tapi seberapa kamu masih di sini, sama aku, sampai hari ini. Ayo, kita bikin lebih banyak momen lagi biar next time nilainya naik.',
      /** Skor 4-6 dari 7 */
      sedang:
        'Not bad. Kamu inget cukup banyak — dan itu udah cukup buat bikin aku senyum. Ada beberapa detail yang mungkin kelewat, tapi hey, itu artinya masih ada cerita yang bisa kita bahas ulang. Sisanya, biar waktu yang nambahin.',
      /** Skor 7 dari 7 */
      tinggi:
        'Perfect score. Aku nggak kaget sih — kamu emang selalu perhatian sama hal-hal kecil, bahkan yang aku sendiri lupa. Makasih udah inget semuanya. Makasih udah jadi orang yang benar-benar hadir. I love you, lebih dari kuis ini bisa jelasin.',
    },
  },

  timeline: {
    /** 6 momen berurutan tanggal. Item paling atas = momen paling lama. */
    momen: [
      {
        tanggal: '2024-10-05',
        judul: 'Match yang Nggak Kebetulan',
        foto: require('../../assets/photos/foto-1.jpg') as ImageSourcePropType,
        cerita:
          'Semua berawal dari sebuah bot Telegram, dating match yang random. Dari ratusan profil yang lewat, aku yang duluan nge-like profil kamu. Nggak nyangka satu klik kecil itu bakal jadi awal dari semuanya. Sometimes the smallest actions change everything.',
      },
      {
        tanggal: '2024-10-13',
        judul: 'Nembak di Transjakarta',
        foto: require('../../assets/photos/foto-2.jpg') as ImageSourcePropType,
        cerita:
          'Aku nembak kamu waktu lagi date activity — niatnya momen itu yang jadi penanda. Tapi kamu malah nganggep aku nembak kamu di dalam Transjakarta. Lucu kalau diinget sekarang. Detail kecil kayak gini yang bikin cerita kita beda dari yang lain — a little messy, a little confusing, tapi tetap jadi milik kita berdua.',
      },
      {
        tanggal: '2024-10-13',
        judul: 'Canggung Level Maksimal',
        foto: require('../../assets/photos/foto-3.png') as ImageSourcePropType,
        cerita:
          'Hari yang sama, momen yang berbeda. Kamu canggung banget waktu itu — sampai-sampai minta saran ke temanmu soal gimana harus jawab. Bahkan temanmu sempat mau ikut dampingin kamu, walau akhirnya nggak jadi. Aku selalu suka bagian ini — bukti kalau momen itu penting buat kamu juga, bukan cuma buat aku.',
      },
      {
        tanggal: '2026-03-07',
        judul: 'Pertama Kali Aku Bikin Kamu Sedih',
        foto: require('../../assets/photos/foto-4.jpg') as ImageSourcePropType,
        cerita:
          'Ini bukan momen yang enak diinget, tapi penting buat aku tulis. Waktu itu aku bikin kamu sedih, dan aku sadar aku salah. Aku ngaku, bilang aku jahat, dan janji nggak akan ngulangin lagi. That moment taught me something — cinta bukan cuma soal bahagia terus, tapi juga soal mau bertanggung jawab waktu salah.',
      },
      {
        tanggal: '2026-06-14',
        judul: 'Momen yang Bikin Aku Yakin',
        foto: require('../../assets/photos/foto-5.jpg') as ImageSourcePropType,
        cerita:
          'Aku yakin — kalau kamu akan selalu ada buat aku. Nggak ada satu kejadian spesifik yang bisa aku tunjuk, karena ini bukan cuma satu momen. Ini kumpulan dari setiap kali kamu tetap stay walau semuanya susah. That\'s when I knew — kamu bukan sekadar orang yang lewat.',
      },
      {
        tanggal: '2026-10-13',
        judul: 'Bukan Lagi Sebuah Momen, Tapi Sebuah Keputusan',
        foto: require('../../assets/photos/foto-6.jpg') as ImageSourcePropType,
        cerita:
          'Kalau momen-momen sebelumnya punya tanggal, yang ini nggak. Karena ini bukan satu hari — ini setiap hari. Kemarin aku sayang kamu. Hari ini aku sayang kamu. Dan besok, aku akan tetap sayang kamu — dengan cara yang sama, atau mungkin lebih dari itu.\n\nAku sayang banget sama kamu. Bukan sekadar kata yang gampang diucapin, tapi sesuatu yang aku rasain tiap kali inget semua yang udah kita lewatin — dari match random di sebuah bot, sampai canggungnya kamu waktu itu, sampai hari aku bikin kamu sedih dan belajar jadi lebih baik karenanya.\n\nAku bersyukur, sesederhana itu. Bersyukur karena dari semua kemungkinan, kamu yang aku temuin. Bersyukur karena kamu tetap ada, bahkan waktu aku nggak sempurna. I\'m grateful for you, setiap hari, tanpa terkecuali.\n\nJadi kalau ditanya sampai kapan — jawabannya selalu sama: selamanya.',
      },
    ] as Momen[],
  },

  galeri: {
    /** 13 foto galeri — file di assets/photos/galeri-1.jpg … galeri-13.jpg. */
    foto: [
      { sumber: require('../../assets/photos/galeri-1.jpg') as ImageSourcePropType, caption: 'Nonton Konser Berdua untuk pertama kalinya' },
      { sumber: require('../../assets/photos/galeri-2.jpg') as ImageSourcePropType, caption: 'pacarku berenang di atlantis' },
      { sumber: require('../../assets/photos/galeri-3.jpg') as ImageSourcePropType, caption: 'Pertama kali aku ngerayain ulang tahun kamuu 10 Juli' },
      { sumber: require('../../assets/photos/galeri-4.jpg') as ImageSourcePropType, caption: 'Pulau Seribu' },
      { sumber: require('../../assets/photos/galeri-5.jpg') as ImageSourcePropType, caption: 'Suka Bumi' },
      { sumber: require('../../assets/photos/galeri-6.jpg') as ImageSourcePropType, caption: 'Aku Ganteng sih disini part 1' },
      { sumber: require('../../assets/photos/galeri-7.jpg') as ImageSourcePropType, caption: 'Aku Ganteng sih disini part 2' },
      { sumber: require('../../assets/photos/galeri-8.jpg') as ImageSourcePropType, caption: 'Aquarium Taman Mini' },
      { sumber: require('../../assets/photos/galeri-9.jpg') as ImageSourcePropType, caption: 'bunga pertama' },
      { sumber: require('../../assets/photos/galeri-10.jpg') as ImageSourcePropType, caption: 'Foto Berdua dibandung' },
      { sumber: require('../../assets/photos/galeri-11.jpg') as ImageSourcePropType, caption: 'Hujan Hujanan di Ragunan' },
      { sumber: require('../../assets/photos/galeri-12.jpg') as ImageSourcePropType, caption: 'kmu lucuu bangett, kasian kecapean pacarkuu' },
      { sumber: require('../../assets/photos/galeri-13.jpg') as ImageSourcePropType, caption: 'Nemenin aku Lomba Rugby' },
    ] satisfies Foto[],
  },

  musik: {
    /**
     * 3 lagu asli (m4a/mp3). Kalau mau ganti lagu, timpa saja file
     * di assets/music/ lalu sesuaikan path require() di bawah.
     */
    lagu: [
      {
        judul: 'Walking Back Home',
        artis: 'Vira Talisa',
        file: require('../../assets/music/lagu-1.m4a') as number,
        alasan:
          'Lagu ini kayak nemuin jalan pulang — dan buat aku, kamu itu rumahnya. Nggak peduli seberapa jauh atau capeknya hari, selalu ada perasaan tenang tiap kali "pulang" ke kamu. This song just feels like coming home to someone who gets you.',
      },
      {
        judul: 'love',
        artis: 'wave to earth',
        file: require('../../assets/music/lagu-2.m4a') as number,
        alasan:
          'Nadanya pelan, lirik-nya jujur — mirip cara aku sayang kamu. Nggak perlu heboh, nggak perlu dibuktikan besar-besar. Cukup ada, cukup jujur, cukup pelan tapi konsisten. Simple, tapi that\'s exactly what love feels like buat aku.',
      },
      {
        judul: 'Out of My League',
        artis: 'LANY',
        file: require('../../assets/music/lagu-3.mp3') as number,
        alasan:
          'Ada masa di mana aku ngerasa kamu terlalu baik buat aku — out of my league, literally. Tapi kamu selalu buktiin sebaliknya, bahwa aku pantas dapetin kamu, tanpa perlu aku ragu terus-menerus. Lagu ini ngingetin aku buat berhenti mikir "kenapa dia pilih aku" dan mulai bersyukur aja.',
      },
    ] satisfies Lagu[],
  },
} as const;

export type Konten = typeof konten;
