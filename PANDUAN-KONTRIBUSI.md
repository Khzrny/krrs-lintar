# PANDUAN KONTRIBUSI ANGGOTA — Lintar KRRS

> Setiap anggota **wajib commit bagian masing-masing dari akun GitHub sendiri**
> setelah repo di-push. Baseline awal (fondasi, alur S1, panduan, staf) sudah
> jalan — tugas tiap anggota adalah **memahami, mengembangkan, dan memperbaiki**
> bagiannya sehingga tercatat sebagai kontribusi asli di riwayat commit.

## Alur kerja semua anggota (sekali saja)

```bash
git clone https://github.com/<user>/lintar-krrs.git
cd lintar-krrs
npm install
cp .env.example .env.local    # isi dari Supabase (lihat supabase/README.md)
npm run dev                   # http://localhost:3000
```

Konfigurasikan identitas git Anda (sekali per komputer):

```bash
git config user.name  "Nama Lengkap"
git config user.email "email@github.com"
```

## 🧑‍💻 Dimas — Jenjang S2 / S3 / Profesi

Baseline sudah jalan (register → pilih jenjang → isi KRRS dengan katalog per
jenjang). Tugas pengembangan:

- Perkaya katalog S2/S3/Profesi di `supabase/setup.sql` (tabel `mata_kuliah`
  + `jadwal`) — tambahkan matkul sesuai kurikulum asli, lalu jalankan ulang
  bagian seed di SQL Editor.
- Bedakan kebutuhan S2/S3/Profesi di UI, mis.: batas SKS berbeda (UBAH juga
  validasi di `app/(mahasiswa)/isi-krrs/actions.ts`), syarat persetujuan
  pembimbing, atau info khusus di dashboard.
- Usulan commit: `feat(s2s3): tambah mata kuliah magister semester ganjil`,
  `feat(s2s3): batas sks pascasarjana 21 sks`, `fix(s2s3): …`, `docs(s2s3): …`.
- File yang biasa disentuh: `app/(mahasiswa)/isi-krrs/form-isi.tsx`,
  `app/(mahasiswa)/dashboard/page.tsx`, `lib/data.ts`, `supabase/setup.sql`.

## 📖 Rizky — Panduan KRRS Mahasiswa

Baseline halaman `/panduan` sudah jalan (langkah, aturan, timeline, FAQ).

- Lengkapi konten: tangkapan layar alur asli Lintar, tabel kalender akademik,
  kontak bagian akademik, video embed (bila ada).
- Tambah konten FAQ dari pertanyaan nyata teman seangkatan.
- Usulan commit: `docs(panduan): tambah kalender akademik`,
  `feat(panduan): gambar alur pengisian`, `fix(panduan): typo faq`.
- File: `app/panduan/page.tsx`.

## 🛡️ Dava — Aplikasi Staf KRRS

Baseline `/staf/dashboard` sudah jalan (tabel, filter, cari, modal detail,
setujui/tolak + catatan).

- Tambah fitur: ekspor daftar ke CSV, statistik per jenjang, riwayat verifikasi,
  pencarian lanjutan (filter SKS/jenjang).
- Perbaiki UX modal bila menemukan kejanggalan.
- Usulan commit: `feat(staf): ekspor csv peserta`, `feat(staf): filter jenjang`,
  `fix(staf): …`.
- File: `app/staf/**`.

## Aturan commit (untuk nilai kontribusi)

1. **Commit kecil dan sering** — satu commit = satu perubahan yang jelas.
2. Pesan commit pakai pola `jenis(bagian): deskripsi singkat` (lowercase, imperatif).
   Contoh: `feat(panduan): tambah bagian kalender akademik`.
3. **Jangan** commit `.env.local` (sudah di-gitignore).
4. Sebelum push: `npm run build` harus lolos tanpa error.
5. Push ke branch `main` (repo kelas) atau branch fitur + Pull Request bila
   dosen meminta.

## Butuh bantuan?

Chat grup tim — atau baca README utama (struktur proyek) dan
`supabase/README.md` (database).
