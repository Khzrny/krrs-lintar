"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getKrrs, TA_AKTIF } from "@/lib/data";

/** Simpan isi KRRS (sekumpulan id mata kuliah) milik mahasiswa yang login. */
export async function simpanKrrs(mataKuliahIds: number[]): Promise<{ ok: boolean; pesan: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, pesan: "Sesi berakhir — silakan masuk lagi." };

  const existing = await getKrrs(user.id, TA_AKTIF);
  if (existing && existing.krrs.status !== "draft") {
    return {
      ok: false,
      pesan: "KRRS sudah dikunci dan tidak dapat diubah. Hubungi staf bila perlu revisi.",
    };
  }

  // Validasi: matkul harus tersedia untuk jenjang mahasiswa
  const { data: profile } = await supabase
    .from("profiles")
    .select("jenjang")
    .eq("id", user.id)
    .single();
  const jenjang = profile?.jenjang ?? "S1";

  const { data: mkValid } = await supabase
    .from("mata_kuliah")
    .select("id, sks")
    .eq("jenjang", jenjang)
    .eq("th_akad", TA_AKTIF)
    .in("id", mataKuliahIds);

  const daftar = mkValid ?? [];
  const totalSks = daftar.reduce((a, m) => a + (m as { sks: number }).sks, 0);
  if (totalSks > 24) return { ok: false, pesan: "Total SKS melebihi batas 24." };

  // Pastikan baris KRRS ada (upsert → status draft)
  const { data: krrsRow, error: errKrrs } = await supabase
    .from("krrs")
    .upsert(
      { profile_id: user.id, th_akad: TA_AKTIF, total_sks: totalSks },
      { onConflict: "profile_id,th_akad" }
    )
    .select()
    .single();

  if (errKrrs || !krrsRow) {
    return { ok: false, pesan: "Gagal menyimpan KRRS: " + (errKrrs?.message ?? "?") };
  }

  // Ganti seluruh item dengan pilihan terbaru (delete + insert)
  await supabase.from("krrs_item").delete().eq("krrs_id", krrsRow.id);
  if (daftar.length > 0) {
    const { error: errItem } = await supabase.from("krrs_item").insert(
      daftar.map((m) => ({ krrs_id: krrsRow.id, mata_kuliah_id: (m as { id: number }).id }))
    );
    if (errItem) return { ok: false, pesan: "Gagal menyimpan rincian: " + errItem.message };
  }

  // Sinkronkan total SKS
  await supabase.from("krrs").update({ total_sks: totalSks }).eq("id", krrsRow.id);

  revalidatePath("/isi-krrs");
  revalidatePath("/dashboard");
  revalidatePath("/konfirmasi");
  return {
    ok: true,
    pesan:
      daftar.length === 0
        ? "Draft KRRS dikosongkan."
        : `Berhasil menyimpan ${daftar.length} mata kuliah (${totalSks} SKS).`,
  };
}
