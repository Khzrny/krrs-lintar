/** Tipe database publik Lintar KRRS (mengikuti supabase/setup.sql). */

export type Jenjang = "S1" | "S2" | "S3" | "Profesi";
export type Role = "mahasiswa" | "staf";
export type StatusKrrs = "draft" | "terkunci" | "disetujui" | "ditolak";
export type Hari = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";

export interface Profile {
  id: string;
  nim: string | null;
  nama: string;
  email: string | null;
  role: Role;
  jenjang: Jenjang;
  fakultas: string;
  program_studi: string;
  created_at: string;
}

export interface MataKuliah {
  id: number;
  kode: string;
  nama: string;
  sks: number;
  jenis: "Wajib" | "Pilihan";
  paket: string | null;
  kelas: string | null;
  dosen: string | null;
  jenjang: Jenjang;
  th_akad: string;
}

export interface Jadwal {
  id: number;
  mata_kuliah_id: number;
  hari: Hari;
  jam_mulai: string; // "HH:MM:SS"
  jam_selesai: string;
  ruang: string;
}

export interface HistoriNilai {
  id: number;
  profile_id?: string;
  th_akad: string;
  kode: string;
  nama: string;
  sks: number;
  nilai: string | null;
  bobot: number | null;
  urut: number;
}

export interface Krrs {
  id: number;
  profile_id: string;
  th_akad: string;
  status: StatusKrrs;
  total_sks: number;
  catatan_staf: string | null;
  locked_at: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KrrsItem {
  id: number;
  krrs_id: number;
  mata_kuliah_id: number;
}

/** Mata kuliah + jadwal gabungan (hasil join untuk UI). */
export interface MataKuliahLengkap extends MataKuliah {
  jadwal: Jadwal[];
}

/** Hitung IP: jumlah(bobot × sks) / jumlah(sks). */
export function hitungIP(nilai: { sks: number; bobot: number | null }[]): number | null {
  let totalSks = 0;
  let totalBobot = 0;
  let ada = false;
  for (const n of nilai) {
    if (n.bobot == null) continue;
    ada = true;
    totalSks += n.sks;
    totalBobot += n.bobot * n.sks;
  }
  return ada ? totalBobot / totalSks : null;
}
