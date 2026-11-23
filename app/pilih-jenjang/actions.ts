"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Jenjang } from "@/types/database";

export async function pilihJenjang(formData: FormData) {
  const jenjang = String(formData.get("jenjang") ?? "S1") as Jenjang;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("profiles").update({ jenjang }).eq("id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/isi-krrs");
}
