export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Ubah "Senin" dsb. menjadi index kolom grid jadwal (0 = Senin). */
export const HARI_URUT = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;
export type Hari = (typeof HARI_URUT)[number];

/** Konversi "07.30" -> menit dari tengah malam. */
export function jamKeMenit(jam: string): number {
  const [h, m] = jam.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}

export function menitKeJam(menit: number): string {
  const h = Math.floor(menit / 60);
  const m = menit % 60;
  return `${String(h).padStart(2, "0")}.${String(m).padStart(2, "0")}`;
}

/** Format "07:30:00" (time SQL) → "07.30" */
export function formatJam(sqlTime: string): string {
  const [h, m] = sqlTime.split(":");
  return `${h}.${m}`;
}

/** Bobot 4.00 → huruf A (standar konversi UNTAR). */
export function bobotKeHuruf(bobot: number): string {
  if (bobot >= 3.85) return "A";
  if (bobot >= 3.5) return "A-";
  if (bobot >= 3.15) return "B+";
  if (bobot >= 2.85) return "B";
  if (bobot >= 2.5) return "B-";
  if (bobot >= 2.15) return "C+";
  if (bobot >= 1.85) return "C";
  if (bobot >= 1.5) return "C-";
  if (bobot >= 1.15) return "D+";
  if (bobot >= 0.5) return "D";
  return "E";
}

/** Label TA akademik: "20251" → "2025/2026 Ganjil" */
export function labelTaAkad(th: string): string {
  if (th.length !== 5) return th;
  const tahun = parseInt(th.slice(0, 4), 10);
  const sem = th.slice(4) === "1" ? "Ganjil" : "Genap";
  return `${tahun}/${tahun + 1} ${sem}`;
}

export function formatTanggal(d: Date | string | null | undefined): string {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
