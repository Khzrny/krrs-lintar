# PANDUAN KONTRIBUSI ANGGOTA — Lintar KRRS

> **Prinsip**: baseline aplikasi sudah jalan (dibangun pada sprint awal oleh Aldho,
> commit #1–#20). Tugas tiap anggota = **mengembangkan bagiannya sendiri dengan
> commit kecil-kecil dari akun GitHub sendiri**. Yang dinilai: riwayat commit
> yang runtut, logis, dan kontribusi nyata.

## Alur kerja semua anggota (sekali saja)

```bash
git clone https://github.com/<user>/lintar-krrs.git
cd lintar-krrs
npm install
cp .env.example .env.local    # isi URL & anon key dari grup (lihat supabase/README.md)
npm run dev                   # http://localhost:3000
```

Identitas git (WAJIB pakai akun sendiri):

```bash
git config user.name  "Nama Lengkap"
git config user.email "email-github@kamu.com"
```

Format pesan commit: `jenis(bagian): deskripsi singkat` — lowercase, imperatif.
Contoh: `feat(staf): ekspor rekap mahasiswa ke csv`

Sebelum push, pastikan lolos: `npm run build` (tanpa error) dan `npm run lint`.

---

## 🧑‍💻 ALDHO — Fondasi, Auth, Alur S1 ✅ (commit #1–#20, sudah selesai)

Riwayat yang sudah ada:

| # | Commit | Cakupan |
|---|---|---|
| 1–2 | scaffold + design system UNTAR | Tailwind, komponen UI, tema, landing |
| 3 | integrasi database Supabase | skema 7 tabel, RLS, seed katalog & histori |
| 4 | autentikasi | register, login, sesi, proxy middleware |
| 5–9 | alur S1 | dashboard, isi KRRS (bentrok), konfirmasi, cetak |
| 10–11 | panduan + staf (baseline) + docs | agar alur penuh jalan |
| 12–20 | perbaikan & penyempurnaan | fix Supabase guard, patch SQL, tema merah-putih, logo resmi, watermark, hapus ganti jenjang, tone primary |

Sisa tugas Aldho (commit tambahan yang boleh):

```bash
# setelah deploy — catat url di readme
git commit -m "docs: tambah link deployment di readme"

# bila ada bug kecil yang ditemukan saat demo
git commit -m "fix(auth): <deskripsi>"
```

---

## 🧑‍💻 DIMAS — Jenjang S2 / S3 / Profesi

Jenjang ditetapkan saat registrasi; katalog per jenjang sudah ada di
`supabase/setup.sql`. Tugas Dimas: perkaya & bedakan pengalaman pascasarjana.
**Uji tiap langkah dengan mendaftar akun baru berjenjang S2/S3/Profesi.**

| Urut | Pesan commit | Apa yang dikerjakan |
|---|---|---|
| 1 | `feat(s2s3): kurikulum magister Teknik Informatika TA 2026/2027` | Tambah/ubah baris seed `mata_kuliah` + `jadwal` jenjang S2 di `supabase/setup.sql`, jalankan di SQL Editor |
| 2 | `feat(s2s3): kurikulum doktoral & profesi` | Idem untuk S3 & Profesi |
| 3 | `feat(s2s3): batas sks pascasarjana 21` | Validasi batas SKS berbeda — ubah `app/(mahasiswa)/isi-krrs/actions.ts` + tampilan `form-isi.tsx` (maks SKS dinamis per jenjang) |
| 4 | `feat(s2s3): info jenjang di dashboard` | Kartu info khusus pascasarjana di `dashboard/page.tsx` (mis. syarat skripsi/disertasi) |
| 5 | `fix(s2s3): <perbaikan yang kamu temukan>` | Bug yang ditemui sendiri saat mencoba |
| 6 | `docs(s2s3): catatan kurikulum` | Dokumentasi singkat di `docs/` atau README |

---

## 🧑‍💻 RIZKY — Panduan KRRS Mahasiswa

Halaman `/panduan` baseline sudah ada (langkah, aturan, timeline, FAQ).

| Urut | Pesan commit | Apa yang dikerjakan |
|---|---|---|
| 1 | `feat(panduan): kalender akademik TA 2026/2027` | Tabel/section jadwal penting (kapan KRRS dibuka, dibatasi, dsb) di `app/panduan/page.tsx` |
| 2 | `feat(panduan): tangkapan layar alur pengisian` | Screenshot halaman isi-krrs/konfirmasi/cetak (ambil dari aplikasi berjalan) disisipkan sebagai gambar per langkah |
| 3 | `feat(panduan): kontak & alur bantuan akademik` | Section kontak bagian akademik / alur kalau terbentur masalah |
| 4 | `feat(panduan): faq tambahan` | Minimal 3 FAQ baru dari pertanyaan nyata mahasiswa |
| 5 | `fix(panduan): typo & perapian kalimat` | Reviu bahasa |
| 6 | `docs(panduan): sumber referensi panduan` | Catat sumber (manual Lintar asli, dll) |

---

## 🧑‍💻 DAVA — Aplikasi Staf KRRS

Baseline `/staf/dashboard` sudah jalan (tabel, filter status, cari, modal
detail, setujui/tolak + catatan). Login uji: `staf@untar.ac.id` / `staf12345`.

| Urut | Pesan commit | Apa yang dikerjakan |
|---|---|---|
| 1 | `feat(staf): badge jumlah menunggu verifikasi` | Counter KRRS terkunci di header `app/staf/layout.tsx` (query count status=terkunci) |
| 2 | `feat(staf): filter jenjang & rentang sks` | Dropdown jenjang + slider/input SKS di `dashboard-staf.tsx` |
| 3 | `feat(staf): ekspor rekap mahasiswa ke csv` | Tombol download CSV (generate dari data yang sudah ada di client) |
| 4 | `feat(staf): statistik verifikasi per jenjang` | Kartu/bar sederhana: berapa draft/terkunci/disetujui tiap jenjang |
| 5 | `feat(staf): halaman riwayat verifikasi` | Tabel log KRRS yang sudah diproses (dari `verified_at` + `catatan_staf`) |
| 6 | `fix(staf): <perbaikan yang kamu temukan>` | Bug/UX yang ditemui sendiri |
| 7 | `docs(staf): cara kerja verifikasi` | Dokumentasi alur verifikasi untuk laporan |

---

## Aturan penting (semua anggota)

1. **Commit dari akun GitHub sendiri** — jangan share laptop saat commit.
2. **Commit kecil & sering** — satu commit = satu hal jelas. 5–10 commit kecil
   jauh lebih baik daripada 1 commit raksasa.
3. **Jangan commit `.env.local`** (sudah di-gitignore — berisi kunci).
4. **`npm run build` harus lolos** sebelum push.
5. Konflik? Jangan panik — koordinasikan di grup; tiap anggota menyentuh file
   berbeda (`app/staf/**`, `app/panduan/**`, seed S2S3) jadi konflik jarang.
6. Simpan bukti aktivitas (screenshot commit, tantangan yang diselesaikan)
   untuk laporan kontribusi individu.
