import Link from "next/link";
import { getUserDanProfile, getHistori, getKrrs, TA_AKTIF } from "@/lib/data";
import { labelTaAkad } from "@/lib/utils";
import { hitungIP, type HistoriNilai } from "@/types/database";
import { statusBadge } from "@/lib/status";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  IconArrowRight,
  IconBook,
  IconChart,
  IconCheckCircle,
  IconGraduation,
  IconLock,
  ProgressBar,
  StatCard,
} from "@/components/ui";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { profile } = await getUserDanProfile();
  if (!profile) return null;

  const histori = await getHistori(profile.id);
  const krrs = await getKrrs(profile.id, TA_AKTIF);

  // ————— Statistik —————
  const sudahNilai = histori.filter((h) => h.bobot != null);
  const ipKumulatif = hitungIP(histori);
  const totalSksLulus = sudahNilai.reduce((a, h) => a + h.sks, 0);

  const perSemester = new Map<string, HistoriNilai[]>();
  for (const h of histori) {
    const arr = perSemester.get(h.th_akad) ?? [];
    arr.push(h);
    perSemester.set(h.th_akad, arr);
  }
  const semesterList = [...perSemester.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const semesterBerjalan = TA_AKTIF;
  const ipTerakhir = (() => {
    for (let i = semesterList.length - 1; i >= 0; i--) {
      if (semesterList[i][0] !== semesterBerjalan) {
        return hitungIP(semesterList[i][1]);
      }
    }
    return null;
  })();

  const status = krrs?.krrs.status ?? null;

  return (
    <div className="animate-fade-up mx-auto max-w-6xl space-y-6">
      {/* ————— Sambutan ————— */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Selamat datang, {profile.nama.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
            {profile.nim} · {profile.program_studi} · {profile.fakultas}
          </p>
        </div>
        <Link href="/isi-krrs">
          <Button variant="gold">
            Lanjut isi KRRS <IconArrowRight className="size-4" />
          </Button>
        </Link>
      </div>

      {/* ————— Kartu statistik ————— */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="IP Semester Lalu"
          value={ipTerakhir != null ? ipTerakhir.toFixed(2) : "—"}
          sub="Semester terakhir yang bernilai"
          icon={<IconChart className="size-6" />}
        />
        <StatCard
          label="IP Kumulatif"
          value={ipKumulatif != null ? ipKumulatif.toFixed(2) : "—"}
          sub={`dari ${totalSksLulus} SKS lulus`}
          icon={<IconGraduation className="size-6" />}
          tone="gold"
        />
        <StatCard
          label="Status KRRS"
          value={status ? statusBadge[status].label : "Belum diisi"}
          sub={`TA ${labelTaAkad(TA_AKTIF)}`}
          icon={
            status === "disetujui" ? (
              <IconCheckCircle className="size-6" />
            ) : (
              <IconLock className="size-6" />
            )
          }
          tone={status === "disetujui" ? "green" : "navy"}
        />
        <StatCard
          label="SKS Diambil"
          value={`${krrs?.krrs.total_sks ?? 0} / 24`}
          sub="Batas maksimal per semester"
          icon={<IconBook className="size-6" />}
        />
      </div>

      {/* ————— Progres KRRS ————— */}
      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-foreground">Progres pengisian KRRS {labelTaAkad(TA_AKTIF)}</p>
          {status ? <Badge tone={statusBadge[status].tone}>{statusBadge[status].label}</Badge> : null}
        </div>
        <ProgressBar
          value={krrs?.krrs.total_sks ?? 0}
          max={24}
          tone={status === "disetujui" ? "gold" : "navy"}
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{krrs?.krrs.total_sks ?? 0} SKS dipilih</span>
          <span>Maks. 24 SKS</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/isi-krrs">
            <Button size="sm" variant="outline">
              {krrs ? "Ubah KRRS" : "Mulai isi KRRS"}
            </Button>
          </Link>
          <Link href="/konfirmasi">
            <Button size="sm" variant="outline">
              Konfirmasi
            </Button>
          </Link>
          <Link href="/cetak">
            <Button size="sm" variant="outline">
              Cetak
            </Button>
          </Link>
        </div>
      </Card>

      {/* ————— Histori nilai ————— */}
      <Card>
        <CardHeader
          title="Daftar Perolehan Nilai"
          desc="Histori nilai seluruh semester — tersimpan di database"
          icon={<IconBook className="size-5" />}
        />
        {histori.length === 0 ? (
          <EmptyState
            icon={<IconBook className="size-7" />}
            title="Belum ada histori nilai"
            desc="Histori akan muncul setelah data akademik tersedia."
          />
        ) : (
          <div className="divide-y divide-(--border)">
            {semesterList.map(([th, rows]) => {
              const ip = hitungIP(rows);
              const berjalan = th === semesterBerjalan;
              return (
                <section key={th} className="p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-foreground">
                      Semester {labelTaAkad(th)}
                      {berjalan ? (
                        <Badge tone="blue" className="ml-2">
                          Sedang ditempuh
                        </Badge>
                      ) : null}
                    </h3>
                    <Badge tone={berjalan ? "gray" : ip != null && ip >= 3 ? "green" : "navy"}>
                      {berjalan ? "IP: —" : `IP: ${ip!.toFixed(2)}`}
                    </Badge>
                  </div>

                  <div className="-mx-5 overflow-x-auto px-5">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead>
                        <tr className="border-b border-(--border) text-left text-xs tracking-wide text-muted uppercase">
                          <th className="py-2 pr-3 font-bold">No</th>
                          <th className="py-2 pr-3 font-bold">Kode</th>
                          <th className="py-2 pr-3 font-bold">Matakuliah</th>
                          <th className="py-2 pr-3 text-center font-bold">SKS</th>
                          <th className="py-2 pr-3 text-center font-bold">Nilai</th>
                          <th className="py-2 text-right font-bold">Bobot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((h) => (
                          <tr key={h.id} className="border-b border-(--border)/60 last:border-0">
                            <td className="py-2.5 pr-3 text-muted">{h.urut}</td>
                            <td className="py-2.5 pr-3 font-mono text-xs font-semibold text-navy-700 dark:text-navy-300">
                              {h.kode}
                            </td>
                            <td className="py-2.5 pr-3 font-medium text-foreground">{h.nama}</td>
                            <td className="py-2.5 pr-3 text-center text-foreground">{h.sks}</td>
                            <td className="py-2.5 pr-3 text-center">
                              {h.nilai ?? <span className="text-muted">—</span>}
                            </td>
                            <td className="py-2.5 text-right font-semibold text-foreground">
                              {h.bobot != null ? Number(h.bobot).toFixed(2) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-(--border) font-bold text-foreground">
                          <td colSpan={3} className="py-2.5 pr-3">
                            Total
                          </td>
                          <td className="py-2.5 pr-3 text-center">
                            {rows.reduce((a, h) => a + h.sks, 0)}
                          </td>
                          <td colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
