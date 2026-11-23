import type { StatusKrrs } from "@/types/database";

/** Peta status KRRS → warna badge + label (aman dipakai server & client). */
export const statusBadge: Record<
  StatusKrrs,
  { tone: "gray" | "amber" | "green" | "red"; label: string }
> = {
  draft: { tone: "gray", label: "Draft" },
  terkunci: { tone: "amber", label: "Menunggu Verifikasi" },
  disetujui: { tone: "green", label: "Disetujui" },
  ditolak: { tone: "red", label: "Ditolak" },
};
