# Lintar KRRS — Universitas Tarumanagara

Replika sistem **Kartu Rencana Studi (KRRS) Online** — proyek UAS mata kuliah
Front-End. Dibangun dengan **Next.js + React + Tailwind CSS**, terintegrasi
penuh ke database **Supabase (PostgreSQL)**, dan dideploy ke **Vercel**.

> ⚠️ Replika untuk keperluan tugas — bukan produk resmi Universitas Tarumanagara.

## ✨ Fitur

- **Autentikasi lengkap** — register (dengan NIM & jenjang), login, sesi aman
  berbasis cookie (Supabase Auth + RLS per baris data).
- **Dashboard mahasiswa** — histori nilai per semester, IP semester & IP
  kumulatif dihitung otomatis dari database.
- **Pengisian KRRS** — mata kuliah paket wajib tercentang otomatis, penghitung
  SKS real-time (maks. 24), **deteksi jadwal bentrok** (termasuk kelas 2
  sesi/minggu), dan **pratinjau grid jadwal mingguan** interaktif.
- **Konfirmasi & verifikasi** — KRRS dikunci mahasiswa → diverifikasi staf
  (setujui / tolak + catatan) → status otomatis ter-update.
- **Cetak KRRS** — dokumen resmi berkop universitas, stempel **TERVERIFIKASI**
  setelah disetujui, siap cetak / simpan PDF (CSS `@media print`).
- **Semua jenjang** — S1, S2, S3, dan Profesi memakai alur yang sama dengan
  katalog mata kuliah berbeda per jenjang (dari database).
- **Aplikasi staf** — tabel seluruh mahasiswa + status KRRS, filter, pencarian,
  modal detail rincian mata kuliah, aksi setujui/tolak.
- **Panduan mahasiswa** — langkah pengisian, aturan penting, timeline, dan FAQ
  interaktif.
- **UI responsif + dark mode** — tema navy–emas UNTAR, sidebar adaptif mobile.

## 🧰 Teknologi

| Lapisan | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 (tema kustom navy/emas) |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Deployment | Vercel |

## 🚀 Menjalankan Lokal

```bash
npm install
cp .env.example .env.local   # isi URL & anon key Supabase Anda
npm run dev                  # buka http://localhost:3000
```

Setup database: buka **Supabase Dashboard → SQL Editor**, jalankan seluruh isi
[`supabase/setup.sql`](supabase/setup.sql). Detail lengkap ada di
[`supabase/README.md`](supabase/README.md).

Akun demo staf (tersedia setelah setup): `staf@untar.ac.id` · `staf12345`

## 📁 Struktur Proyek

```
app/
├── (auth)/              → login, register (layout split-screen)
├── (mahasiswa)/         → area login mahasiswa (shell sidebar)
│   ├── dashboard/       → histori nilai + statistik IP
│   ├── isi-krrs/        → pengisian + deteksi bentrok + grid jadwal
│   ├── konfirmasi/      → kunci & verifikasi KRRS
│   └── cetak/           → dokumen KRRS siap cetak/PDF
├── pilih-jenjang/       → ganti jenjang (S1/S2/S3/Profesi)
├── panduan/             → panduan mahasiswa (publik)
└── staf/                → aplikasi staf (verifikasi KRRS)
components/              → design system (Button, Card, Badge, ikon, shell…)
lib/                     → klien Supabase, query data, util
supabase/setup.sql       → skema + RLS + seed lengkap
types/database.ts        → tipe domain (MataKuliah, Krrs, …)
```

## 🌐 Deploy ke Vercel

1. Push repo ke GitHub.
2. [vercel.com/new](https://vercel.com/new) → import repo → framework terdeteksi otomatis (Next.js).
3. Tambahkan Environment Variables: `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy — selesai. URL: `https://lintar-krrs.vercel.app` (bisa custom).

## 👥 Anggota & Pembagian Tugas

| Anggota | NIM | Bagian |
|---|---|---|
| Aldho Prahauga | 535250153 | Fondasi & design system, autentikasi/login, alur S1 (isi → konfirmasi → cetak) |
| Dimas | — | Halaman & data jenjang S2/S3/Profesi (paritas alur S1) |
| Rizky | — | Panduan KRRS mahasiswa |
| Dava | — | Aplikasi staf KRRS (verifikasi) |

Panduan commit per anggota: lihat [`PANDUAN-KONTRIBUSI.md`](PANDUAN-KONTRIBUSI.md).

## 🤖 Deklarasi Penggunaan AI

Dalam pengerjaan proyek ini, **AI (asisten coding) digunakan hanya sebagai
alat bantu** — dengan peran: *scaffolding* awal, penjelasan pola Next.js/Supabase,
dan reviu kode. Seluruh keputusan desain, alur produk, data, serta pemahaman
kode menjadi tanggung jawab anggota tim; setiap bagian diuji dan dimodifikasi
sendiri oleh masing-masing anggota sebelum dikumpulkan. Riwayat commit GitHub
memuat kontribusi asli tiap anggota.
