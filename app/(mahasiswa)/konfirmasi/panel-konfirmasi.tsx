"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatJam } from "@/lib/utils";
import type { MataKuliahLengkap, StatusKrrs } from "@/types/database";
import { statusBadge } from "@/lib/status";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  IconAlert,
  IconArrowRight,
  IconCheckCircle,
  IconClock,
  IconLock,
  IconPrinter,
  ProgressBar,
} from "@/components/ui";
import { bukaUlangDraft, demoSetujuiOtomatis, kunciKrrs } from "./actions";

export function PanelKonfirmasi({
  daftar,
  status,
  catatanStaf,
  lockedAt,
}: {
  daftar: MataKuliahLengkap[];
  status: StatusKrrs | null;
  catatanStaf: string | null;
  lockedAt: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pesan, setPesan] = useState<{ ok: boolean; text: string } | null>(null);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [sukses, setSukses] = useState(false);

  const totalSks = daftar.reduce((a, m) => a + m.sks, 0);

  function kunci() {
    startTransition(async () => {
      const res = await kunciKrrs();
      setPesan({ ok: res.ok, text: res.pesan });
      if (res.ok) {
        setSukses(true);
        setKonfirmasi(false);
        router.refresh();
      }
    });
  }

  function buka() {
    startTransition(async () => {
      const res = await bukaUlangDraft();
      setPesan({ ok: res.ok, text: res.pesan });
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="animate-fade-up mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Konfirmasi KRRS</h1>
          <p className="mt-1 text-sm text-muted">
            Periksa kembali mata kuliah pilihan Anda sebelum dikunci.
          </p>
        </div>
        {status ? <Badge tone={statusBadge[status].tone}>{statusBadge[status].label}</Badge> : null}
      </div>

      {pesan ? (
        <Alert tone={pesan.ok ? "success" : "danger"}>{pesan.text}</Alert>
      ) : null}

      {sukses || status === "terkunci" ? (
        <Card className="animate-pop-in p-6 text-center">
          <span className="animate-check-burst mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
            <IconLock className="size-8" />
          </span>
          <h2 className="mt-4 text-lg font-extrabold text-foreground">
            KRRS telah dikunci &amp; diajukan
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            KRRS Anda menunggu verifikasi staf akademik. Setelah disetujui, dokumen
            resmi dapat dicetak.
          </p>
          {lockedAt ? (
            <p className="mt-2 text-xs text-muted">
              Dikunci pada: {new Date(lockedAt).toLocaleString("id-ID")}
            </p>
          ) : null}
        </Card>
      ) : null}

      {/* ————— Mode demo: countdown verifikasi otomatis ————— */}
      {status === "terkunci" ? (
        <DemoVerifikasiOtomatis key={`demo-${lockedAt ?? "x"}`} router={router} />
      ) : null}

      {status === "disetujui" ? (
        <Card className="p-6 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
            <IconCheckCircle className="size-8" />
          </span>
          <h2 className="mt-4 text-lg font-extrabold text-foreground">
            KRRS Anda telah disetujui 🎉
          </h2>
          <p className="mt-1 text-sm text-muted">
            Dokumen KRRS resmi siap dicetak / disimpan sebagai PDF.
          </p>
          <Link href="/cetak" className="mt-4 inline-block">
            <Button variant="gold">
              <IconPrinter className="size-4" /> Cetak KRRS
            </Button>
          </Link>
        </Card>
      ) : null}

      {status === "ditolak" ? (
        <Alert tone="danger" title="KRRS ditolak staf akademik">
          <p>{catatanStaf ?? "Tidak ada catatan."}</p>
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={buka} disabled={pending}>
              {pending ? "Membuka…" : "Buka ulang draft & perbaiki"}
            </Button>
          </div>
        </Alert>
      ) : null}

      <Card>
        <CardHeader
          title="Ringkasan mata kuliah"
          desc={`${daftar.length} mata kuliah · ${totalSks} SKS · TA 2026/2027 Ganjil`}
          icon={<IconCheckCircle className="size-5" />}
        />
        <div className="-mx-5 overflow-x-auto px-5 sm:-mx-4 sm:px-4">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-(--border) text-left text-xs tracking-wide text-muted uppercase">
                <th className="py-2.5 pr-3 font-bold">No</th>
                <th className="py-2.5 pr-3 font-bold">Kode</th>
                <th className="py-2.5 pr-3 font-bold">Matakuliah</th>
                <th className="py-2.5 pr-3 text-center font-bold">SKS</th>
                <th className="py-2.5 font-bold">Jadwal</th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((m, i) => (
                <tr key={m.id} className="border-b border-(--border)/60 last:border-0">
                  <td className="py-2.5 pr-3 text-muted">{i + 1}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs font-semibold text-primary-700 dark:text-primary-300">
                    {m.kode}
                  </td>
                  <td className="py-2.5 pr-3 font-medium text-foreground">
                    {m.nama} {m.kelas ? <span className="text-muted">({m.kelas})</span> : null}
                  </td>
                  <td className="py-2.5 pr-3 text-center font-semibold text-foreground">{m.sks}</td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {m.jadwal.map((j) => (
                        <span
                          key={j.id}
                          className="inline-flex items-center gap-1 rounded-md bg-(--surface-2) px-2 py-0.5 text-xs text-foreground"
                        >
                          <IconClock className="size-3 text-muted" />
                          {j.hari} {formatJam(j.jam_mulai)}–{formatJam(j.jam_selesai)} · {j.ruang}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-(--border) font-bold text-foreground">
                <td colSpan={3} className="py-3 pr-3">
                  Total
                </td>
                <td className="py-3 pr-3 text-center">{totalSks}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {status === "draft" || status == null ? (
        <Card className="p-5">
          {konfirmasi ? (
            <div className="animate-pop-in">
              <Alert tone="warning" title="Konfirmasi penguncian">
                <p>
                  Setelah dikunci, isi KRRS <b>tidak dapat diubah</b> sampai staf
                  akademik memverifikasinya. Yakin lanjutkan?
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={kunci} disabled={pending}>
                    {pending ? "Mengunci…" : "Ya, kunci KRRS"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setKonfirmasi(false)}>
                    Batal
                  </Button>
                </div>
              </Alert>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm text-muted">
                <IconAlert className="size-5 shrink-0 text-amber-500" />
                Pastikan seluruh mata kuliah di atas sudah benar.
              </p>
              <div className="flex gap-2">
                <Link href="/isi-krrs">
                  <Button variant="ghost" size="sm">
                    Kembali ubah
                  </Button>
                </Link>
                <Button
                  variant="gold"
                  onClick={() => setKonfirmasi(true)}
                  disabled={daftar.length === 0}
                >
                  <IconLock className="size-4" /> Kunci &amp; Ajukan KRRS
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : status === "terkunci" ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface) p-4">
          <p className="text-sm text-muted">Butuh dokumen sementara?</p>
          <Link href="/cetak">
            <Button variant="outline">
              Pratinjau dokumen <IconArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Mode demo — simulasi verifikasi staf otomatis dengan countdown 5 detik.
 * Komponen terpisah agar state hitung-mundur reset setiap status berubah
 * (di-mount ulang via key dari parent).
 */
function DemoVerifikasiOtomatis({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const [sisa, setSisa] = useState(5);
  const terkirim = useRef(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const iv = setInterval(() => {
      setSisa((s) => s - 0.25);
    }, 250);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (sisa > 0 || terkirim.current) return;
    terkirim.current = true;
    startTransition(async () => {
      const res = await demoSetujuiOtomatis();
      if (res.ok) router.refresh();
    });
  }, [sisa, router, startTransition]);

  if (sisa <= 0) return null;
  const tampil = Math.ceil(sisa);

  return (
    <Card className="flex items-center gap-4 p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-900/50 dark:text-gold-300">
        <IconClock className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">
          Mode Demo — simulasi verifikasi staf otomatis
        </p>
        <p className="mt-0.5 text-xs text-muted">
          Meniru alur nyata: staf akademik menyetujui KRRS. Dalam demo ini,
          persetujuan terjadi otomatis dalam{" "}
          <b className="text-foreground">{tampil} detik</b>.
        </p>
        <div className="mt-2">
          <ProgressBar value={5 - sisa} max={5} tone="gold" />
        </div>
      </div>
    </Card>
  );
}
