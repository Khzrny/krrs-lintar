"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getKrrs, TA_AKTIF } from "@/lib/data";

/** Kunci KRRS: draft → terkunci (menunggu verifikasi staf). */
export async function kunciKrrs(): Promise<{ ok: boolean; pesan: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, pesan: "Sesi berakhir — silakan masuk lagi." };

  const existing = await getKrrs(user.id, TA_AKTIF);
  if (!existing || existing.item.length === 0) {
    return { ok: false, pesan: "Isi KRRS Anda masih kosong." };
  }
  if (existing.krrs.status !== "draft") {
    return { ok: false, pesan: "KRRS sudah dikunci sebelumnya." };
  }

  const { error } = await supabase
    .from("krrs")
    .update({ status: "terkunci", locked_at: new Date().toISOString() })
    .eq("id", existing.krrs.id);

  if (error) return { ok: false, pesan: "Gagal mengunci: " + error.message };

  revalidatePath("/konfirmasi");
  revalidatePath("/dashboard");
  revalidatePath("/isi-krrs");
  revalidatePath("/staf");
  return { ok: true, pesan: "KRRS berhasil dikunci dan diajukan ke staf akademik." };
}

/** Buka ulang KRRS yang ditolak staf → kembali menjadi draft. */
export async function bukaUlangDraft(): Promise<{ ok: boolean; pesan: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, pesan: "Sesi berakhir — silakan masuk lagi." };

  const existing = await getKrrs(user.id, TA_AKTIF);
  if (!existing || existing.krrs.status !== "ditolak") {
    return { ok: false, pesan: "KRRS tidak dalam status ditolak." };
  }

  const { error } = await supabase
    .from("krrs")
    .update({ status: "draft", catatan_staf: null, locked_at: null, verified_at: null })
    .eq("id", existing.krrs.id);

  if (error) return { ok: false, pesan: "Gagal membuka draft: " + error.message };

  revalidatePath("/konfirmasi");
  revalidatePath("/isi-krrs");
  revalidatePath("/dashboard");
  return { ok: true, pesan: "Draft KRRS dibuka kembali. Silakan perbaiki lalu kunci ulang." };
}
