"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Pastikan yang memanggil adalah staf. */
async function assertStaf() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, userId: null, staf: false };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { supabase, userId: user.id, staf: profile?.role === "staf" };
}

/** Staf menyetujui KRRS (terkunci → disetujui). */
export async function setujuiKrrs(krrsId: number): Promise<{ ok: boolean; pesan: string }> {
  const { supabase, staf } = await assertStaf();
  if (!staf) return { ok: false, pesan: "Hanya staf yang berwenang memverifikasi." };

  const { error } = await supabase
    .from("krrs")
    .update({ status: "disetujui", verified_at: new Date().toISOString() })
    .eq("id", krrsId)
    .eq("status", "terkunci"); // hanya yang terkunci yang bisa disetujui

  if (error) return { ok: false, pesan: "Gagal menyetujui: " + error.message };

  revalidatePath("/staf");
  revalidatePath("/konfirmasi");
  revalidatePath("/cetak");
  return { ok: true, pesan: "KRRS disetujui." };
}

/** Staf menolak KRRS dengan catatan perbaikan (terkunci → ditolak). */
export async function tolakKrrs(
  krrsId: number,
  catatan: string
): Promise<{ ok: boolean; pesan: string }> {
  const { supabase, staf } = await assertStaf();
  if (!staf) return { ok: false, pesan: "Hanya staf yang berwenang memverifikasi." };
  if (!catatan.trim()) return { ok: false, pesan: "Catatan penolakan wajib diisi." };

  const { error } = await supabase
    .from("krrs")
    .update({
      status: "ditolak",
      catatan_staf: catatan.trim(),
      verified_at: new Date().toISOString(),
    })
    .eq("id", krrsId)
    .eq("status", "terkunci");

  if (error) return { ok: false, pesan: "Gagal menolak: " + error.message };

  revalidatePath("/staf");
  revalidatePath("/konfirmasi");
  return { ok: true, pesan: "KRRS ditolak dengan catatan." };
}
