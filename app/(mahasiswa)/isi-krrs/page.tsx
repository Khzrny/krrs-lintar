import { getUserDanProfile, getMataKuliahLengkap, getKrrs, TA_AKTIF } from "@/lib/data";
import { FormIsiKrrs } from "./form-isi";

export const metadata = { title: "Isi KRRS" };

export default async function IsiKrrsPage() {
  const { profile } = await getUserDanProfile();
  if (!profile) return null;

  const [daftar, krrs] = await Promise.all([
    getMataKuliahLengkap(profile.jenjang, TA_AKTIF),
    getKrrs(profile.id, TA_AKTIF),
  ]);

  return (
    <FormIsiKrrs
      daftar={daftar}
      terpilihAwal={krrs ? krrs.item.map((i) => i.mata_kuliah_id) : []}
      status={krrs?.krrs.status ?? null}
      jenjang={profile.jenjang ?? "S1"}
    />
  );
}