/**
 * Generator placeholder untuk aplikasi "Dua Tahun".
 * Menulis 8 PNG (foto) + 3 WAV (nada) hanya jika file belum ada.
 * Tanpa dependency. Jalankan: node scripts/buat-placeholder.mjs
 * File ini boleh dihapus setelah kamu mengganti aset asli.
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

/* ---------- PNG (solid color) ---------- */
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};
function pngSolid(w, h, r, g, b) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit, RGB
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const o = y * (w * 3 + 1) + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------- WAV (nada lembut) ---------- */
function wavNada(freq, detik) {
  const rate = 22050, n = Math.floor(rate * detik);
  const pcm = Buffer.alloc(n * 2);
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const fade = Math.min(1, t / 0.4) * Math.min(1, (detik - t) / 0.8);
    const getar = 0.6 + 0.4 * Math.sin(2 * Math.PI * freq * 2 * t);
    const s = Math.sin(2 * Math.PI * freq * t) * 0.5 * fade * getar;
    pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(s * 32767))), i * 2);
  }
  const head = Buffer.alloc(44);
  head.write('RIFF', 0); head.writeUInt32LE(36 + pcm.length, 4); head.write('WAVE', 8);
  head.write('fmt ', 12); head.writeUInt32LE(16, 16); head.writeUInt16LE(1, 20);
  head.writeUInt16LE(1, 22); head.writeUInt32LE(rate, 24); head.writeUInt32LE(rate * 2, 28);
  head.writeUInt16LE(2, 32); head.writeUInt16LE(16, 34);
  head.write('data', 36); head.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([head, pcm]);
}

/* ---------- tulis ---------- */
mkdirSync('assets/photos', { recursive: true });
mkdirSync('assets/music', { recursive: true });

const warna = [
  [0x2a, 0x1e, 0x22], [0x3a, 0x27, 0x2c], [0x4a, 0x30, 0x36], [0x5a, 0x3a, 0x40],
  [0x6b, 0x46, 0x4e], [0x7c, 0x53, 0x58], [0x8e, 0x61, 0x66], [0x9f, 0x70, 0x77],
];
warna.forEach((c, i) => {
  const f = `assets/photos/foto-${i + 1}.png`;
  if (!existsSync(f)) { writeFileSync(f, pngSolid(800, 1000, ...c)); console.log('dibuat', f); }
});

[[261.63, 'lagu-1'], [329.63, 'lagu-2'], [392.0, 'lagu-3']].forEach(([hz, nama]) => {
  const f = `assets/music/${nama}.wav`;
  if (!existsSync(f)) { writeFileSync(f, wavNada(hz, 5)); console.log('dibuat', f); }
});
console.log('selesai.');
