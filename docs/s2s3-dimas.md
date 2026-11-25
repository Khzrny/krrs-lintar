# Catatan Pengerjaan S2/S3/Profesi (Dimas)

Dokumen ini mencatat bagian Dimas pada project Lintar KRRS: katalog
mata kuliah dan batas SKS untuk jenjang pascasarjana.

## 1. Katalog mata kuliah (supabase/setup.sql, bagian 6)

Seed TA 2026/2027 Ganjil (th_akad `20261`):

| Jenjang | Jumlah matkul | Contoh kode |
|---|---|---|
| S2 (Magister) | 10 | MI61001 - MI63010 |
| S3 (Doktoral) | 7 | DI71001 - DI73007 |
| Profesi | 6 | PR51001 - PR53005 |

Jadwal pascasarjana dibuat sore/malam hari (S3 mulai 16.00, S2 dan
Profesi mulai 15.30 - 19.00) dan sudah dicek tidak bentrok antar sesi
dalam satu jenjang.

## 2. Sumber dan status data

**Data ini adalah data contoh (draf) untuk keperluan demo, bukan
kurikulum resmi kampus.**

- Kode, nama mata kuliah, dan SKS disusun sebagai contoh katalog
  pascasarjana Informatika, belum dicocokkan dengan buku panduan
  akademik pascasarjana yang resmi.
- Nama dosen bertanda `(TBA)` atau `Tim Pembimbing/Promotor` berarti
  belum ada data dosen sebenarnya.
- Kode, nama dosen, dan SKS pada seed awal (6 matkul S2, 5 S3, 4 Profesi)
  berasal dari scaffold project, bukan dari saya, dan belum diverifikasi.
- Seed S1 dan skema tabel tidak diubah.

Tindak lanjut: cocokkan dengan panduan akademik pascasarjana dan
ganti data `(TBA)` bila sumber resminya sudah ada.

## 3. Batas SKS pascasarjana

- S1 maksimal 24 SKS, S2/S3/Profesi maksimal 21 SKS.
- `isi-krrs/actions.ts`: validasi di server, jadi tidak bisa dilewati
  dari sisi klien.
- `isi-krrs/form-isi.tsx`: penghitung SKS, progress bar, dan pencegah
  centang mengikuti batas jenjang.
- `isi-krrs/page.tsx`: jenjang dikirim dari profil mahasiswa (perbaikan,
  sebelumnya diambil dari baris pertama katalog).

## 4. Dashboard

`dashboard/page.tsx` menampilkan kartu "Info Jenjang" khusus
pascasarjana, dan angka batas SKS di kartu statistik dan progress bar
mengikuti jenjang.

## 5. Catatan teknis

- Seed di Supabase belum dijalankan dari akun saya (project ada di
  akun anggota lain). Jalankan bagian 6 `setup.sql` di SQL Editor
  sebelum demo.
- `npm run build` lolos pada setiap commit.