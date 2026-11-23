import Link from "next/link";
import { getUserDanProfile, getKrrs, getMataKuliahByIds, TA_AKTIF } from "@/lib/data";
import { PanelKonfirmasi } from "./panel-konfirmasi";
import { Button, EmptyState, IconBook } from "@/components/ui";

export const metadata = { title: "Konfirmasi KRRS" };

export default async function KonfirmasiPage() {
  const { profile } = await getUserDanProfile();
  if (!profile) return null;

  const krrs = await getKrrs(profile.id, TA_AKTIF);

  if (!krrs || krrs.item.length === 0) {
    return (
      <div className="animate-fade-up mx-auto max-w-4xl">
        <h1 className="text-2xl font-extrabold text-foreground">Konfirmasi KRRS</h1>
        <div className="mt-6">
          <EmptyState
            icon={<IconBook className="size-7" />}
            title="Belum ada mata kuliah tersimpan"
            desc="Isi KRRS Anda masih kosong. Pilih mata kuliah terlebih dahulu, lalu kembali ke halaman ini."
            action={
              <Link href="/isi-krrs">
                <Button variant="gold">Mulai isi KRRS</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const daftar = await getMataKuliahByIds(krrs.item.map((i) => i.mata_kuliah_id));

  return (
    <PanelKonfirmasi
      daftar={daftar}
      status={krrs.krrs.status}
      catatanStaf={krrs.krrs.catatan_staf}
      lockedAt={krrs.krrs.locked_at}
    />
  );
}
