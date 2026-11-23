"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setujuiKrrs, tolakKrrs } from "../actions";
import { formatJam } from "@/lib/utils";
import type { Jenjang, MataKuliahLengkap, StatusKrrs } from "@/types/database";
import { statusBadge } from "@/lib/status";
import { cn } from "@/lib/utils";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  IconAlert,
  IconCheckCircle,
  IconClock,
  IconLock,
  IconShield,
  IconUsers,
  Input,
  StatCard,
} from "@/components/ui";

export type BarisMahasiswa = {
  profileId: string;
  nama: string;
  nim: string | null;
  jenjang: Jenjang;
  status: StatusKrrs | null;
  totalSks: number;
  updated: string | null;
  krrsId: number | null;
  daftar: MataKuliahLengkap[];
};

const FILTER: { key: "semua" | StatusKrrs; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "terkunci", label: "Menunggu Verifikasi" },
  { key: "draft", label: "Draft" },
  { key: "disetujui", label: "Disetujui" },
  { key: "ditolak", label: "Ditolak" },
];

export function DashboardStaf({ baris }: { baris: BarisMahasiswa[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"semua" | StatusKrrs>("semua");
  const [cari, setCari] = useState("");
  const [detail, setDetail] = useState<BarisMahasiswa | null>(null);
  const [catatan, setCatatan] = useState("");
  const [pesan, setPesan] = useState<{ ok: boolean; text: string } | null>(null);

  const jumlah = useMemo(() => {
    const j = { total: baris.length, draft: 0, terkunci: 0, disetujui: 0, ditolak: 0 };
    for (const b of baris) {
      if (b.status) j[b.status]++;
    }
    return j;
  }, [baris]);

  const terlihat = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return baris.filter(
      (b) =>
        (filter === "semua" || b.status === filter) &&
        (!q ||
          b.nama.toLowerCase().includes(q) ||
          (b.nim ?? "").toLowerCase().includes(q))
    );
  }, [baris, filter, cari]);

  function verifikasi(b: BarisMahasiswa, aksi: "setuju" | "tolak") {
    startTransition(async () => {
      const res =
        aksi === "setuju"
          ? await setujuiKrrs(b.krrsId!)
          : await tolakKrrs(b.krrsId!, catatan);
      setPesan({ ok: res.ok, text: res.pesan });
      if (res.ok) {
        setDetail(null);
        setCatatan("");
        router.refresh();
      }
    });
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Verifikasi KRRS Mahasiswa</h1>
          <p className="mt-1 text-sm text-muted">
            Periksa dan setujui KRRS yang sudah dikunci mahasiswa · TA 2026/2027 Ganjil
          </p>
        </div>
        <Badge tone="navy">
          <IconShield className="size-3.5" /> Mode Staf
        </Badge>
      </div>

      {pesan ? <Alert tone={pesan.ok ? "success" : "danger"}>{pesan.text}</Alert> : null}

      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Mahasiswa" value={jumlah.total} icon={<IconUsers className="size-6" />} />
        <StatCard
          label="Menunggu Verifikasi"
          value={jumlah.terkunci}
          icon={<IconClock className="size-6" />}
          tone="gold"
        />
        <StatCard label="Disetujui" value={jumlah.disetujui} icon={<IconCheckCircle className="size-6" />} tone="green" />
        <StatCard label="Ditolak / Draft" value={jumlah.ditolak + jumlah.draft} icon={<IconAlert className="size-6" />} />
      </div>

      {/* Filter & cari */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {FILTER.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                filter === f.key
                  ? "bg-primary-800 text-white dark:bg-primary-600"
                  : "bg-(--surface-2) text-muted hover:text-foreground"
              )}
            >
              {f.label}
              {f.key !== "semua" ? (
                <span className="ml-1 opacity-70">{jumlah[f.key as keyof typeof jumlah] as number}</span>
              ) : null}
            </button>
          ))}
        </div>
        <div className="ml-auto w-full sm:w-64">
          <Input
            placeholder="Cari nama / NIM…"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </div>
      </Card>

      {/* Tabel mahasiswa */}
      <Card>
        {terlihat.length === 0 ? (
          <EmptyState
            icon={<IconUsers className="size-7" />}
            title="Tidak ada data"
            desc="Belum ada mahasiswa yang cocok dengan filter ini."
          />
        ) : (
          <div className="-mx-4 overflow-x-auto sm:-mx-4">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-(--border) text-left text-xs tracking-wide text-muted uppercase">
                  <th className="px-5 py-3 font-bold">Mahasiswa</th>
                  <th className="px-3 py-3 font-bold">Jenjang</th>
                  <th className="px-3 py-3 text-center font-bold">SKS</th>
                  <th className="px-3 py-3 font-bold">Status KRRS</th>
                  <th className="px-3 py-3 font-bold">Diperbarui</th>
                  <th className="px-5 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {terlihat.map((b) => (
                  <tr key={b.profileId} className="border-b border-(--border)/60 last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-bold text-foreground">{b.nama}</p>
                      <p className="text-xs text-muted">{b.nim ?? "—"}</p>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone="navy">{b.jenjang}</Badge>
                    </td>
                    <td className="px-3 py-3 text-center font-semibold text-foreground">
                      {b.status ? `${b.totalSks}` : "—"}
                    </td>
                    <td className="px-3 py-3">
                      {b.status ? (
                        <Badge tone={statusBadge[b.status].tone}>{statusBadge[b.status].label}</Badge>
                      ) : (
                        <Badge tone="gray">Belum isi</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted">
                      {b.updated ? new Date(b.updated).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDetail(b);
                          setCatatan("");
                        }}
                      >
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ————— Modal detail ————— */}
      {detail ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            aria-label="Tutup"
            className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm"
            onClick={() => setDetail(null)}
          />
          <div className="animate-pop-in relative max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-(--border) bg-(--surface) p-6 shadow-2xl sm:rounded-2xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-foreground">{detail.nama}</h2>
                <p className="text-sm text-muted">
                  {detail.nim} · {detail.jenjang} · {detail.daftar.length} matkul · {detail.totalSks} SKS
                </p>
              </div>
              {detail.status ? (
                <Badge tone={statusBadge[detail.status].tone}>{statusBadge[detail.status].label}</Badge>
              ) : null}
            </div>

            <div className="mt-4 -mx-6 overflow-x-auto px-6 sm:-mx-2 sm:px-2">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-(--border) text-left text-xs tracking-wide text-muted uppercase">
                    <th className="py-2 pr-3 font-bold">Kode</th>
                    <th className="py-2 pr-3 font-bold">Matakuliah</th>
                    <th className="py-2 pr-3 text-center font-bold">SKS</th>
                    <th className="py-2 font-bold">Jadwal</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.daftar.map((m) => (
                    <tr key={m.id} className="border-b border-(--border)/60 last:border-0">
                      <td className="py-2 pr-3 font-mono text-xs font-semibold text-primary-700 dark:text-primary-300">
                        {m.kode}
                      </td>
                      <td className="py-2 pr-3 font-medium text-foreground">{m.nama}</td>
                      <td className="py-2 pr-3 text-center">{m.sks}</td>
                      <td className="py-2 text-xs text-muted">
                        {m.jadwal
                          .map((j) => `${j.hari} ${formatJam(j.jam_mulai)}–${formatJam(j.jam_selesai)}`)
                          .join("; ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {detail.status === "terkunci" ? (
              <div className="mt-5 space-y-3">
                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-foreground">
                    Catatan (wajib bila menolak)
                  </span>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="cth: Total SKS melebihi batas untuk mahasiswa dengan IP di bawah 2.50…"
                    className="w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2 text-sm text-foreground focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="gold"
                    disabled={pending}
                    onClick={() => verifikasi(detail, "setuju")}
                  >
                    <IconCheckCircle className="size-4" />
                    {pending ? "Memproses…" : "Setujui KRRS"}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={pending}
                    onClick={() => verifikasi(detail, "tolak")}
                  >
                    <IconAlert className="size-4" /> Tolak
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-(--surface-2) px-4 py-3 text-sm text-muted">
                {detail.status === "disetujui" ? (
                  <>
                    <IconCheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
                    KRRS ini sudah disetujui.
                  </>
                ) : detail.status === "ditolak" ? (
                  <>
                    <IconAlert className="size-5 text-red-600 dark:text-red-400" />
                    Ditolak: {detail.daftar.length ? "menunggu perbaikan mahasiswa." : ""}
                  </>
                ) : (
                  <>
                    <IconLock className="size-5" />
                    KRRS masih draft — mahasiswa belum menguncinya.
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDetail(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
