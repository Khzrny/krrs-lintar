# Setup Database Supabase — Lintar KRRS

Database proyek ini berjalan di [Supabase](https://supabase.com) (PostgreSQL
ter-host, gratis). Ikuti langkah berikut **sekali** di awal:

## 1. Buat project

1. Daftar/masuk ke [supabase.com](https://supabase.com) (bisa login pakai GitHub).
2. Klik **New project** → isi nama (`lintar-krrs`), pilih region terdekat
   (mis. Singapore), buat password database (tidak wajib diingat untuk aplikasi ini).
3. Tunggu ± 1–2 menit sampai project aktif.

## 2. Jalankan skema + seed

1. Buka **SQL Editor** (menu kiri) → **New query**.
2. Salin seluruh isi file `setup.sql` dari repo ini → **Run**.
3. Jika sukses akan muncul pesan *Success*. Skrip ini aman dijalankan ulang.

Yang dibuat oleh skrip:
- Tabel: `profiles`, `mata_kuliah`, `jadwal`, `histori_nilai` (+ template),
  `krrs`, `krrs_item`.
- **RLS** (Row Level Security): mahasiswa hanya bisa membaca/mengubah datanya
  sendiri; staf dapat membaca semua & memverifikasi.
- Trigger: profil + histori nilai demo otomatis dibuat setiap mahasiswa mendaftar.
- Seed: katalog mata kuliah S1 (data asli Lintar — 5 wajib 2 paket + 4 pilihan
  beserta jadwal & dosen), katalog S2/S3/Profesi, histori nilai 3 semester,
  dan akun staf demo.

## 3. (Opsional, disarankan untuk demo) Matikan konfirmasi email

Agar pendaftaran langsung masuk tanpa verifikasi email:

1. **Authentication → Providers → Email** → matikan **Confirm email** → Save.

## 4. Ambil kredensial untuk aplikasi

1. Buka **Project Settings → API**.
2. Salin **Project URL** dan **anon public key**.
3. Di repo, salin `.env.example` menjadi `.env.local` lalu isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

4. Jalankan ulang `npm run dev`.

## 5. Akun demo

Setelah setup.sql dijalankan, akun staf berikut langsung tersedia:

```
email    : staf@untar.ac.id
password : staf12345
```

Mahasiswa cukup mendaftar lewat halaman `/register` — histori nilai demo
(3 semester) otomatis tersedia untuk akun baru.

## Catatan deploy

Saat deploy ke Vercel, masukkan dua variabel yang sama di
**Project → Settings → Environment Variables**, lalu **Redeploy**.
Tidak ada langkah database tambahan — project Supabase yang sama dipakai
oleh produksi dan lokal.
