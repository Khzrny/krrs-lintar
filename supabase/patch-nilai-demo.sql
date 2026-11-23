-- =========================================================
-- PATCH v2 — Lintar KRRS
-- Isi: (1) fungsi demo verifikasi otomatis, (2) pengetatan RLS
-- verifikasi, (3) nilai histori dibaguskan (IP ± 3.5).
-- Jalankan di SQL Editor. Aman dijalankan ulang.
-- =========================================================

-- ————— 1. Mode demo: simulasi verifikasi staf otomatis —————
-- Hanya pemilik KRRS yang bisa menjalankan, dan hanya saat status 'terkunci'.
create or replace function public.demo_setujui_sendiri()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.krrs
  set status = 'disetujui', verified_at = now()
  where profile_id = auth.uid() and status = 'terkunci';
end $$;

grant execute on function public.demo_setujui_sendiri() to authenticated;
revoke execute on function public.demo_setujui_sendiri() from anon;

-- ————— 2. Pengetatan RLS: mahasiswa tak bisa memverifikasi sendiri —————
-- Pemilik hanya boleh mengubah KRRS saat draft/ditolak (isi & kunci ulang).
drop policy if exists krrs_update_own on public.krrs;
create policy krrs_update_own on public.krrs
  for update using (profile_id = auth.uid() and status in ('draft', 'ditolak'))
  with check (profile_id = auth.uid() and status in ('draft', 'terkunci'));

-- Verifikasi (disetujui/ditolak) hanya oleh staf
drop policy if exists krrs_update_staf on public.krrs;
create policy krrs_update_staf on public.krrs
  for update using (public.is_staf()) with check (public.is_staf());

-- ————— 3. Nilai histori dibaguskan (variasi natural A / A- / B+ / B) —————
--    IP Semester 1 ≈ 3.57 · IP Semester 2 ≈ 3.47 · IPK ≈ 3.52

update public.histori_nilai_template t
set nilai = v.nilai, bobot = v.bobot
from (values
  ('TK13021', 'A-', 3.67),  -- Database Systems
  ('TK13027', 'B+', 3.33),  -- Algorithms
  ('TK13028', 'A-', 3.67),  -- Fundamental Programming
  ('TK13032', 'A',  4.00),  -- Technology and Ethics
  ('TK13036', 'B+', 3.33),  -- Statistics
  ('TK13037', 'B',  3.00),  -- Calculus
  ('TK13030', 'B+', 3.33),  -- Numerical Method
  ('TK13034', 'A',  4.00),  -- Operating Systems
  ('TK13038', 'B',  3.00),  -- Algebra & Discrete Mathematics
  ('TK13039', 'A',  4.00),  -- Introduction to AI
  ('TK23007', 'A-', 3.67),  -- Data Structures
  ('TK23022', 'B+', 3.33)   -- Back-End Programming
) as v(kode, nilai, bobot)
where t.kode = v.kode;

-- Terapkan juga ke seluruh akun mahasiswa yang sudah terdaftar
update public.histori_nilai h
set nilai = v.nilai, bobot = v.bobot
from (values
  ('TK13021', 'A-', 3.67),
  ('TK13027', 'B+', 3.33),
  ('TK13028', 'A-', 3.67),
  ('TK13032', 'A',  4.00),
  ('TK13036', 'B+', 3.33),
  ('TK13037', 'B',  3.00),
  ('TK13030', 'B+', 3.33),
  ('TK13034', 'A',  4.00),
  ('TK13038', 'B',  3.00),
  ('TK13039', 'A',  4.00),
  ('TK23007', 'A-', 3.67),
  ('TK23022', 'B+', 3.33)
) as v(kode, nilai, bobot)
where h.kode = v.kode;

-- Selesai 🎉
