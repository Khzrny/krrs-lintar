-- =========================================================
--  LINTAR KRRS — Setup Database Supabase (PostgreSQL)
--  Jalankan SELURUH file ini di: Supabase Dashboard → SQL Editor → New query
--  Aman dijalankan ulang (idempotent).
-- =========================================================

-- ————————————————————— 0. Ekstensi —————————————————————
create extension if not exists pgcrypto;

-- ————————————————————— 1. Tabel —————————————————————

-- Profil pengguna (1:1 dengan auth.users)
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  nim          text unique,
  nama         text not null default 'Mahasiswa',
  email        text,
  role         text not null default 'mahasiswa' check (role in ('mahasiswa', 'staf')),
  jenjang      text not null default 'S1' check (jenjang in ('S1', 'S2', 'S3', 'Profesi')),
  fakultas     text not null default 'Fakultas Teknologi Informasi',
  program_studi text not null default 'Teknik Informatika',
  created_at   timestamptz not null default now()
);

-- Mata kuliah yang ditawarkan per jenjang & TA akademik
create table if not exists public.mata_kuliah (
  id     bigint generated always as identity primary key,
  kode   text not null,
  nama   text not null,
  sks    int  not null check (sks > 0),
  jenis  text not null check (jenis in ('Wajib', 'Pilihan')),
  paket  text,                       -- mis. 'Paket 3' / 'Paket 5' (khusus wajib)
  kelas  text,
  dosen  text,
  jenjang text not null default 'S1' check (jenjang in ('S1', 'S2', 'S3', 'Profesi')),
  th_akad text not null,             -- mis. '20261' = TA 2026/2027 Ganjil
  unique (kode, th_akad, kelas)
);

-- Jadwal per sesi (satu matkul bisa >1 sesi/minggu)
create table if not exists public.jadwal (
  id              bigint generated always as identity primary key,
  mata_kuliah_id  bigint not null references public.mata_kuliah (id) on delete cascade,
  hari            text not null check (hari in ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat')),
  jam_mulai       time not null,
  jam_selesai     time not null,
  ruang           text not null,
  check (jam_selesai > jam_mulai)
);

-- Template histori nilai (disalin ke profil mahasiswa baru saat mendaftar)
create table if not exists public.histori_nilai_template (
  id      bigint generated always as identity primary key,
  th_akad text not null,
  kode    text not null,
  nama    text not null,
  sks     int  not null check (sks > 0),
  nilai   text,                      -- null = sedang ditempuh (semester berjalan)
  bobot   numeric(4,2),
  urut    int not null default 0,    -- urutan baris seperti di Lintar
  unique (th_akad, kode)
);

-- Histori nilai milik tiap mahasiswa
create table if not exists public.histori_nilai (
  id         bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  th_akad    text not null,
  kode       text not null,
  nama       text not null,
  sks        int  not null check (sks > 0),
  nilai      text,
  bobot      numeric(4,2),
  urut       int not null default 0,
  unique (profile_id, th_akad, kode)
);

-- KRRS (satu per mahasiswa per TA akademik)
create table if not exists public.krrs (
  id           bigint generated always as identity primary key,
  profile_id   uuid not null references public.profiles (id) on delete cascade,
  th_akad      text not null default '20261',
  status       text not null default 'draft' check (status in ('draft', 'terkunci', 'disetujui', 'ditolak')),
  total_sks    int  not null default 0,
  catatan_staf text,
  locked_at    timestamptz,
  verified_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (profile_id, th_akad)
);

-- Rincian mata kuliah yang diambil dalam sebuah KRRS
create table if not exists public.krrs_item (
  id             bigint generated always as identity primary key,
  krrs_id        bigint not null references public.krrs (id) on delete cascade,
  mata_kuliah_id bigint not null references public.mata_kuliah (id) on delete cascade,
  unique (krrs_id, mata_kuliah_id)
);

create index if not exists idx_jadwal_mk     on public.jadwal (mata_kuliah_id);
create index if not exists idx_histori_p     on public.histori_nilai (profile_id);
create index if not exists idx_krrs_profile  on public.krrs (profile_id);
create index if not exists idx_krrs_item_k   on public.krrs_item (krrs_id);

-- updated_at otomatis untuk krrs
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_krrs_updated on public.krrs;
create trigger trg_krrs_updated before update on public.krrs
for each row execute function public.set_updated_at();

-- ————————————————————— 2. Trigger: profil otomatis saat signup —————————————————————
-- Data dari form register (nama, nim, jenjang, role) dikirim lewat options.data
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nim, nama, email, role, jenjang)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'nim', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'nama', ''), 'Mahasiswa'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'mahasiswa'),
    coalesce(new.raw_user_meta_data ->> 'jenjang', 'S1')
  )
  on conflict (id) do nothing;

  -- Mahasiswa baru mendapat salinan histori nilai (demo data Lintar)
  if coalesce(new.raw_user_meta_data ->> 'role', 'mahasiswa') = 'mahasiswa' then
    insert into public.histori_nilai (profile_id, th_akad, kode, nama, sks, nilai, bobot, urut)
    select new.id, th_akad, kode, nama, sks, nilai, bobot, urut
    from public.histori_nilai_template
    on conflict do nothing;
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ————————————————————— 3. Row Level Security —————————————————————
alter table public.profiles             enable row level security;
alter table public.mata_kuliah          enable row level security;
alter table public.jadwal               enable row level security;
alter table public.histori_nilai        enable row level security;
alter table public.histori_nilai_template enable row level security;
alter table public.krrs                 enable row level security;
alter table public.krrs_item            enable row level security;

-- Helper: apakah aku staf?
create or replace function public.is_staf()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staf'
  );
$$;

-- profiles: milik sendiri, atau dilihat staf
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_staf());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- katalog mata kuliah & jadwal: bisa dibaca semua yang login
drop policy if exists mk_select on public.mata_kuliah;
create policy mk_select on public.mata_kuliah for select using (auth.role() = 'authenticated');

drop policy if exists jadwal_select on public.jadwal;
create policy jadwal_select on public.jadwal for select using (auth.role() = 'authenticated');

drop policy if exists histori_template_select on public.histori_nilai_template;
create policy histori_template_select on public.histori_nilai_template
  for select using (auth.role() = 'authenticated');

-- histori nilai: milik sendiri, atau dilihat staf
drop policy if exists histori_select_own on public.histori_nilai;
create policy histori_select_own on public.histori_nilai
  for select using (profile_id = auth.uid() or public.is_staf());

-- krrs: mahasiswa mengelola miliknya (draft→terkunci); staf melihat & memverifikasi semua
drop policy if exists krrs_select_own on public.krrs;
create policy krrs_select_own on public.krrs
  for select using (profile_id = auth.uid() or public.is_staf());

drop policy if exists krrs_insert_own on public.krrs;
create policy krrs_insert_own on public.krrs
  for insert with check (profile_id = auth.uid());

drop policy if exists krrs_update_own on public.krrs;
create policy krrs_update_own on public.krrs
  for update using (profile_id = auth.uid() or public.is_staf())
  with check (profile_id = auth.uid() or public.is_staf());

drop policy if exists krrs_delete_own on public.krrs;
create policy krrs_delete_own on public.krrs
  for delete using (profile_id = auth.uid() and status = 'draft');

-- krrs_item: lewat KRRS milik sendiri (draft), staf bisa membaca semua
drop policy if exists krrs_item_select on public.krrs_item;
create policy krrs_item_select on public.krrs_item
  for select using (
    public.is_staf() or exists (
      select 1 from public.krrs k
      where k.id = krrs_id and k.profile_id = auth.uid()
    )
  );

drop policy if exists krrs_item_write on public.krrs_item;
create policy krrs_item_write on public.krrs_item
  for insert with check (
    exists (
      select 1 from public.krrs k
      where k.id = krrs_id and k.profile_id = auth.uid() and k.status = 'draft'
    )
  );

drop policy if exists krrs_item_delete on public.krrs_item;
create policy krrs_item_delete on public.krrs_item
  for delete using (
    exists (
      select 1 from public.krrs k
      where k.id = krrs_id and k.profile_id = auth.uid() and k.status = 'draft'
    )
  );

-- ————————————————————— 4. SEED: Template histori nilai —————————————————————
-- (Data histori asli Lintar — semester 1 s.d. 3, Teknik Informatika)
insert into public.histori_nilai_template (th_akad, kode, nama, sks, nilai, bobot, urut) values
  -- Semester 1 (2025/2026 Ganjil)
  ('20251', 'TK13021', 'Database Systems',                          4, 'B',  3.27, 1),
  ('20251', 'TK13027', 'Algorithms',                                4, 'D',  1.55, 2),
  ('20251', 'TK13028', 'Fundamental Programming',                   4, 'C+', 2.51, 3),
  ('20251', 'TK13032', 'Technology and Ethics',                     4, 'A',  4.00, 4),
  ('20251', 'TK13036', 'Statistics',                                2, 'C',  2.27, 5),
  ('20251', 'TK13037', 'Calculus',                                  2, 'C',  2.00, 6),
  -- Semester 2 (2025/2026 Genap)
  ('20252', 'TK13030', 'Numerical Method',                          4, 'C',  2.03, 7),
  ('20252', 'TK13034', 'Operating Systems',                         2, 'B+', 3.58, 8),
  ('20252', 'TK13038', 'Algebra & Discrete Mathematics',            4, 'D',  1.52, 9),
  ('20252', 'TK13039', 'Introduction to Artificial Intelligence',   2, 'A',  4.00, 10),
  ('20252', 'TK23007', 'Data Structures',                           4, 'C',  2.10, 11),
  ('20252', 'TK23022', 'Back-End Programming',                      4, 'C',  2.27, 12),
  -- Semester 3 (2026/2027 Ganjil — sedang ditempuh, belum ada nilai)
  ('20261', 'TK23019', 'Mobile Programming',                        4, null, null, 13),
  ('20261', 'TK23023', 'Front-End Programming',                     4, null, null, 14),
  ('20261', 'TK23029', 'Computer Architecture & Organization',      2, null, null, 15),
  ('20261', 'TK33050', 'Scientific Writing',                        2, null, null, 16),
  ('20261', 'TK34005', 'Machine Learning',                          4, null, null, 17),
  ('20261', 'TK34018', 'Natural Language Processing',               4, null, null, 18)
on conflict (th_akad, kode) do update
  set nama = excluded.nama, sks = excluded.sks, nilai = excluded.nilai,
      bobot = excluded.bobot, urut = excluded.urut;

-- ————————————————————— 5. SEED: Mata kuliah S1 (TA 2026/2027 Ganjil) —————————————————————
-- Data asli Lintar: 2 paket wajib + 4 pilihan (semua pilihan 4 SKS)

insert into public.mata_kuliah (kode, nama, sks, jenis, paket, kelas, dosen, jenjang, th_akad) values
  ('TK23019', 'Mobile Programming',                     4, 'Wajib',   'Paket 3', 'C', 'Darius Andana Haris, S.Kom., M.T.I. & Janson Hendryli, S.Kom., M.Kom.', 'S1', '20261'),
  ('TK23023', 'Front-End Programming',                  4, 'Wajib',   'Paket 3', 'C', 'Janson Hendryli, S.Kom., M.Kom.',    'S1', '20261'),
  ('TK23029', 'Computer Architecture & Organization',   2, 'Wajib',   'Paket 3', 'C', 'Chairisni Lubis, Dra., M.Kom.',       'S1', '20261'),
  ('TK33050', 'Scientific Writing',                     2, 'Wajib',   'Paket 5', 'B', 'Lina, Prof. S.T., M.Kom., Ph.D.',      'S1', '20261'),
  ('TK34005', 'Machine Learning',                       4, 'Wajib',   'Paket 5', 'C', 'Teny Handhayani, S.Kom., M.Kom., Ph.D.', 'S1', '20261'),
  ('TK34007', 'Data Mining',                            4, 'Pilihan', null,     'A', 'Teny Handhayani, S.Kom., M.Kom., Ph.D.', 'S1', '20261'),
  ('TK34018', 'Natural Language Processing',            4, 'Pilihan', null,     'A', 'Viny Christanti Mawardi, S.Kom., M.Kom.', 'S1', '20261'),
  ('TK34012', 'Business Analyst',                       4, 'Pilihan', null,     'B', 'Sani M. Isa, S.Kom., M.M.',            'S1', '20261'),
  ('TK34010', 'Computer Vision',                        4, 'Pilihan', null,     'A', 'Darius Andana Haris, S.Kom., M.T.I.',  'S1', '20261')
on conflict (kode, th_akad, kelas) do update
  set nama = excluded.nama, sks = excluded.sks, jenis = excluded.jenis,
      paket = excluded.paket, dosen = excluded.dosen;

-- Jadwal (data asli; Data Mining & Computer Vision berbagi slot → untuk demo deteksi bentrok)
insert into public.jadwal (mata_kuliah_id, hari, jam_mulai, jam_selesai, ruang)
select mk.id, j.hari, j.mulai::time, j.selesai::time, j.ruang
from public.mata_kuliah mk
join (values
  ('TK23019', 'Rabu',   '13:30', '15:10', 'R0902'),
  ('TK23019', 'Jumat',  '07:30', '09:10', 'R1007'),
  ('TK23023', 'Senin',  '07:30', '09:10', 'R0905'),
  ('TK23023', 'Senin',  '09:30', '11:10', 'R0902'),
  ('TK23029', 'Selasa', '09:30', '11:10', 'R0804'),
  ('TK33050', 'Kamis',  '07:30', '09:10', 'R0806'),
  ('TK34005', 'Kamis',  '13:30', '15:10', 'R0902'),
  ('TK34005', 'Kamis',  '15:30', '17:10', 'R0902'),
  ('TK34007', 'Rabu',   '09:30', '11:10', 'Lab. 2'),
  ('TK34018', 'Selasa', '11:30', '13:10', 'R0705'),
  ('TK34018', 'Rabu',   '07:30', '09:10', 'R0705'),
  ('TK34012', 'Selasa', '07:30', '09:10', 'R0903'),
  ('TK34010', 'Rabu',   '09:30', '11:10', 'Lab. 4')
) as j(kode, hari, mulai, selesai, ruang)
  on j.kode = mk.kode and mk.th_akad = '20261' and mk.jenjang = 'S1'
where not exists (
  select 1 from public.jadwal jd
  where jd.mata_kuliah_id = mk.id and jd.hari = j.hari and jd.jam_mulai = j.mulai::time
);

-- ————————————————————— 6. SEED: Mata kuliah S2 / S3 / Profesi —————————————————————
-- (Katalog pascasarjana — jadwal umumnya sore/malam)

insert into public.mata_kuliah (kode, nama, sks, jenis, paket, kelas, dosen, jenjang, th_akad) values
  -- S2 — Magister
  ('MI61001', 'Research Methodology',            3, 'Wajib',   'Paket 1', 'A', 'Dr. Ir. Hendrik, M.T.',     'S2', '20261'),
  ('MI62002', 'Advanced Algorithms & Complexity', 3, 'Wajib',   'Paket 1', 'A', 'Dr. Ir. Surya, M.Sc.',      'S2', '20261'),
  ('MI62003', 'Advanced Database Systems',       3, 'Wajib',   'Paket 1', 'A', 'Dr. Maya, M.Kom.',          'S2', '20261'),
  ('MI63004', 'Deep Learning',                   3, 'Pilihan', null,     'A', 'Dr. Ir. Teny Handhayani, Ph.D.', 'S2', '20261'),
  ('MI63005', 'Big Data Analytics',              3, 'Pilihan', null,     'A', 'Dr. Sani M. Isa, M.M.',     'S2', '20261'),
  ('MI63006', 'Information Security',            3, 'Pilihan', null,     'B', 'Dr. Ir. Rudi, M.Kom.',      'S2', '20261'),
  -- S3 — Doktoral
  ('DI71001', 'Advanced Research Seminar',       3, 'Wajib',   'Paket 1', 'A', 'Prof. Dr. Ir. Bambang',     'S3', '20261'),
  ('DI72002', 'Advanced Machine Learning',       3, 'Wajib',   'Paket 1', 'A', 'Prof. Dr. Viny Christanti', 'S3', '20261'),
  ('DI73003', 'Dissertation Proposal',           3, 'Wajib',   'Paket 2', 'A', 'Tim Promotor',              'S3', '20261'),
  ('DI73004', 'Scientific Computing',            3, 'Pilihan', null,     'A', 'Dr. Ir. Diana, M.T.',       'S3', '20261'),
  ('DI73005', 'Knowledge Engineering',           3, 'Pilihan', null,     'A', 'Dr. Ir. Agus, M.Kom.',      'S3', '20261'),
  -- Profesi
  ('PR51001', 'Professional Ethics & Practice',  3, 'Wajib',   'Paket 1', 'A', 'Dr. Ir. Wawan, M.M.',       'Profesi', '20261'),
  ('PR52002', 'Advanced Software Engineering',   4, 'Wajib',   'Paket 1', 'A', 'Ir. Janson Hendryli, M.Kom.', 'Profesi', '20261'),
  ('PR53003', 'Cloud Computing & DevOps',        3, 'Pilihan', null,     'A', 'Darius Andana Haris, S.Kom., M.T.I.', 'Profesi', '20261'),
  ('PR53004', 'Cybersecurity Practicum',         3, 'Pilihan', null,     'B', 'Dr. Ir. Rudi, M.Kom.',      'Profesi', '20261')
on conflict (kode, th_akad, kelas) do update
  set nama = excluded.nama, sks = excluded.sks, jenis = excluded.jenis,
      paket = excluded.paket, dosen = excluded.dosen;

insert into public.jadwal (mata_kuliah_id, hari, jam_mulai, jam_selesai, ruang)
select mk.id, j.hari, j.mulai::time, j.selesai::time, j.ruang
from public.mata_kuliah mk
join (values
  ('MI61001', 'Senin',  '18:30', '21:00', 'R1101'),
  ('MI62002', 'Selasa', '18:30', '21:00', 'R1101'),
  ('MI62003', 'Rabu',   '18:30', '21:00', 'R1102'),
  ('MI63004', 'Kamis',  '18:30', '21:00', 'Lab. 1'),
  ('MI63005', 'Kamis',  '18:30', '21:00', 'Lab. 2'),
  ('MI63006', 'Jumat',  '18:30', '21:00', 'R1101'),
  ('DI71001', 'Senin',  '16:00', '18:30', 'R1201'),
  ('DI72002', 'Selasa', '16:00', '18:30', 'R1201'),
  ('DI73003', 'Rabu',   '16:00', '18:30', 'R1201'),
  ('DI73004', 'Kamis',  '16:00', '18:30', 'Lab. 3'),
  ('DI73005', 'Jumat',  '16:00', '18:30', 'R1202'),
  ('PR51001', 'Senin',  '19:00', '21:30', 'R1301'),
  ('PR52002', 'Selasa', '19:00', '21:30', 'Lab. 5'),
  ('PR53003', 'Rabu',   '19:00', '21:30', 'Lab. 5'),
  ('PR53004', 'Kamis',  '19:00', '21:30', 'Lab. 6')
) as j(kode, hari, mulai, selesai, ruang)
  on j.kode = mk.kode and mk.th_akad = '20261' and mk.jenjang <> 'S1'
where not exists (
  select 1 from public.jadwal jd
  where jd.mata_kuliah_id = mk.id and jd.hari = j.hari and jd.jam_mulai = j.mulai::time
);

-- ————————————————————— 7. SEED: Akun staf (untuk demo verifikasi) —————————————————————
-- Login: staf@untar.ac.id  ·  Password: staf12345
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
)
values (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
  'authenticated', 'authenticated', 'staf@untar.ac.id',
  crypt('staf12345', gen_salt('bf')),
  now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"nama": "Staf Akademik FTI", "role": "staf"}'
)
on conflict do nothing;

-- Pastikan profil staf ada (trigger di atas biasanya sudah membuatnya)
insert into public.profiles (id, email, nama, role)
select u.id, u.email, coalesce(u.raw_user_meta_data ->> 'nama', 'Staf Akademik FTI'), 'staf'
from auth.users u
where u.email = 'staf@untar.ac.id'
on conflict (id) do nothing;

-- Selesai 🎉
