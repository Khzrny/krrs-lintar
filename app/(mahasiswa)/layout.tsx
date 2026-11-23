import { redirect } from "next/navigation";
import { getUserDanProfile, getKrrs, TA_AKTIF } from "@/lib/data";
import { AppShell } from "@/components/shell";
import type { StatusKrrs } from "@/types/database";

export default async function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getUserDanProfile();

  if (!user || !profile) redirect("/login");
  if (profile.role === "staf") redirect("/staf");

  const krrs = await getKrrs(profile.id, TA_AKTIF);

  return (
    <AppShell
      user={{ nama: profile.nama, nim: profile.nim, jenjang: profile.jenjang }}
      statusKrrs={(krrs?.krrs.status ?? null) as StatusKrrs | null}
    >
      {children}
    </AppShell>
  );
}
