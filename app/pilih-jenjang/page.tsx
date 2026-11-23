import Link from "next/link";
import { getUserDanProfile } from "@/lib/data";
import { pilihJenjang } from "./actions";
import {
  Badge,
  Button,
  Card,
  IconArrowRight,
  IconCheck,
  IconGraduation,
} from "@/components/ui";
import type { Jenjang } from "@/types/database";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pilih Jenjang" };

const PILIHAN: { value: Jenjang; label: string; desc: string }[] = [
  { value: "S1", label: "Mahasiswa S1", desc: "Program Sarjana — Teknik Informatika, dsb." },
  { value: "S2", label: "Mahasiswa S2", desc: "Program Magister / Pascasarjana." },
  { value: "S3", label: "Mahasiswa S3", desc: "Program Doktoral." },
  { value: "Profesi", label: "Mahasiswa Profesi", desc: "Program Profesi." },
];

export default async function PilihJenjangPage() {
  const { profile } = await getUserDanProfile();

  return (
    <div className="mx-auto min-h-dvh max-w-3xl px-4 py-10 sm:px-6">
      <div className="animate-fade-up">
        <Badge tone="gold">Pengaturan Akun</Badge>
        <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
          Pilih jenjang Anda
        </h1>
        <p className="mt-2 text-sm text-muted">
          Pilihan ini menentukan katalog mata kuliah yang tersedia saat pengisian
          KRRS. Anda tetap bisa menggantinya lagi dari menu kapan saja.
        </p>

        <form action={pilihJenjang} className="mt-8 grid gap-4 sm:grid-cols-2">
          {PILIHAN.map((p) => {
            const aktif = profile?.jenjang === p.value;
            return (
              <label
                key={p.value}
                className={cn(
                  "group card-surface relative flex cursor-pointer flex-col gap-2 rounded-xl p-5 transition-all",
                  "has-checked:border-gold-500 has-checked:ring-2 has-checked:ring-gold-500/40 hover:border-navy-400"
                )}
              >
                <input
                  type="radio"
                  name="jenjang"
                  value={p.value}
                  defaultChecked={aktif}
                  className="absolute top-4 right-4 size-4 accent-gold-600"
                />
                <span className="flex size-11 items-center justify-center rounded-xl bg-navy-100 text-navy-700 dark:bg-navy-900/70 dark:text-gold-300">
                  <IconGraduation className="size-6" />
                </span>
                <span className="font-bold text-foreground">{p.label}</span>
                <span className="text-sm text-muted">{p.desc}</span>
                {aktif ? (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <IconCheck className="size-3.5" /> Jenjang saat ini
                  </span>
                ) : null}
              </label>
            );
          })}

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" variant="gold" className="w-full sm:w-auto">
              Simpan pilihan <IconArrowRight className="size-4" />
            </Button>
          </div>
        </form>

        <Card className="mt-8 p-4">
          <p className="text-sm text-muted">
            Selesai?{" "}
            <Link href="/dashboard" className="font-bold text-navy-600 hover:underline dark:text-gold-400">
              Kembali ke dashboard
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
