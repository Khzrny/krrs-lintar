import { getSemuaMahasiswa, getMataKuliahByIds } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { KrrsItem, MataKuliahLengkap } from "@/types/database";
import type { BarisMahasiswa } from "./dashboard-staf";
import { DashboardStaf } from "./dashboard-staf";

export const metadata = { title: "Staf · Verifikasi KRRS" };

export default async function StafDashboardPage() {
  const { mahasiswa, krrsByProfile } = await getSemuaMahasiswa();
  const supabase = await createClient();

  // Ambil seluruh rincian KRRS + mata kuliah dalam beberapa query gabungan
  const krrsIds = [...krrsByProfile.values()].map((k) => k.id);
  const { data: itemRows } = krrsIds.length
    ? await supabase.from("krrs_item").select("*").in("krrs_id", krrsIds)
    : { data: [] as KrrsItem[] };
  const items = (itemRows ?? []) as KrrsItem[];

  const semuaMkId = [...new Set(items.map((i) => i.mata_kuliah_id))];
  const daftarMk = await getMataKuliahByIds(semuaMkId);
  const mkById = new Map<number, MataKuliahLengkap>(daftarMk.map((m) => [m.id, m]));

  const daftarByKrrs = new Map<number, MataKuliahLengkap[]>();
  for (const it of items) {
    const mk = mkById.get(it.mata_kuliah_id);
    if (!mk) continue;
    const arr = daftarByKrrs.get(it.krrs_id) ?? [];
    arr.push(mk);
    daftarByKrrs.set(it.krrs_id, arr);
  }

  const baris: BarisMahasiswa[] = mahasiswa.map((m) => {
    const k = krrsByProfile.get(m.id) ?? null;
    return {
      profileId: m.id,
      nama: m.nama,
      nim: m.nim,
      jenjang: m.jenjang,
      status: k?.status ?? null,
      totalSks: k?.total_sks ?? 0,
      updated: k?.updated_at ?? null,
      krrsId: k?.id ?? null,
      daftar: (k && daftarByKrrs.get(k.id)) ?? [],
    };
  });

  return <DashboardStaf baris={baris} />;
}
