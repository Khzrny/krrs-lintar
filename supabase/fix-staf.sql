-- =========================================================
-- PATCH: Perbaiki login staf (jalankan di SQL Editor)
-- Penyebab: user staf yang di-insert langsung lewat SQL belum
-- punya baris di auth.identities, dan/atau profil-nya belum
-- ber-role 'staf'. Skrip ini membetulkan keduanya + reset
-- password staf ke nilai standar demo.
-- Aman dijalankan ulang.
-- =========================================================

-- 1. Buat baris identities untuk SEMUA user email yang belum punya
insert into auth.identities (
  id, user_id, provider_id, identity_data,
  provider, last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(),
  u.id,
  u.email,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email',
  now(), now(), now()
from auth.users u
where u.email is not null
  and not exists (
    select 1 from auth.identities i
    where i.user_id = u.id and i.provider = 'email'
  )
on conflict do nothing;

-- 2. Reset password staf ke standar demo (staf12345)
update auth.users
set encrypted_password = crypt('staf12345', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'staf@untar.ac.id';

-- 3. Pastikan profil staf ada & ber-role 'staf'
insert into public.profiles (id, email, nama, role)
select u.id, u.email, 'Staf Akademik FTI', 'staf'
from auth.users u
where u.email = 'staf@untar.ac.id'
on conflict (id) do nothing;

update public.profiles
set role = 'staf'
where id in (select id from auth.users where email = 'staf@untar.ac.id');

-- Selesai — login staf@untar.ac.id / staf12345 sekarang berfungsi ✅
