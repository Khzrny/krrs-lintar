import { createClient } from "@/lib/supabase/server";
import type {
  HistoriNilai,
  Jadwal,
  Krrs,
  KrrsItem,
  MataKuliah,
  MataKuliahLengkap,
  Profile,
} from "@/types/database";

/** TA akademik aktif untuk pengisian KRRS. */
export const TA_AKTIF = "20261";

/** Sesi login saat ini (null bila belum login). */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Profil publik milik userId. */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as Profile) ?? null;
}

/** Sesi + profil sekaligus; redirect-friendly untuk layout. */
export async function getUserDanProfile() {
  const user = await getUser();
  if (!user) return { user: null, profile: null };
  const profile = await getProfile(user.id);
  return { user, profile };
}

/** Katalog mata kuliah + seluruh jadwalnya untuk satu jenjang & TA. */
export async function getMataKuliahLengkap(
  jenjang: string,
  thAkad = TA_AKTIF
): Promise<MataKuliahLengkap[]> {
  const supabase = await createClient();

  const { data: mkList } = await supabase
    .from("mata_kuliah")
    .select("*")
    .eq("jenjang", jenjang)
    .eq("th_akad", thAkad)
    .order("id");

  if (!mkList?.length) return [];

  const ids = (mkList as MataKuliah[]).map((m) => m.id);
  const { data: jadwalList } = await supabase
    .from("jadwal")
    .select("*")
    .in("mata_kuliah_id", ids)
    .order("id");

  const byMk = new Map<number, Jadwal[]>();
  for (const j of (jadwalList ?? []) as Jadwal[]) {
    const arr = byMk.get(j.mata_kuliah_id) ?? [];
    arr.push(j);
    byMk.set(j.mata_kuliah_id, arr);
  }

  return (mkList as MataKuliah[]).map((m) => ({
    ...m,
    jadwal: byMk.get(m.id) ?? [],
  }));
}

/** Histori nilai mahasiswa (urut seperti di Lintar). */
export async function getHistori(profileId: string): Promise<HistoriNilai[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("histori_nilai")
    .select("*")
    .eq("profile_id", profileId)
    .order("urut");
  return (data ?? []) as HistoriNilai[];
}

/** KRRS aktif milik mahasiswa beserta rincian item-nya. */
export async function getKrrs(
  profileId: string,
  thAkad = TA_AKTIF
): Promise<{ krrs: Krrs; item: KrrsItem[] } | null> {
  const supabase = await createClient();
  const { data: krrs } = await supabase
    .from("krrs")
    .select("*")
    .eq("profile_id", profileId)
    .eq("th_akad", thAkad)
    .maybeSingle();

  if (!krrs) return null;

  const { data: item } = await supabase
    .from("krrs_item")
    .select("*")
    .eq("krrs_id", (krrs as Krrs).id);

  return { krrs: krrs as Krrs, item: (item ?? []) as KrrsItem[] };
}

/** Daftar seluruh mahasiswa + status KRRS-nya (untuk aplikasi staf). */
export async function getSemuaMahasiswa() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "mahasiswa")
    .order("nama");
  const { data: krrsList } = await supabase
    .from("krrs")
    .select("*")
    .eq("th_akad", TA_AKTIF);
  return {
    mahasiswa: (profiles ?? []) as Profile[],
    krrsByProfile: new Map<string, Krrs>(
      ((krrsList ?? []) as Krrs[]).map((k) => [k.profile_id, k])
    ),
  };
}
