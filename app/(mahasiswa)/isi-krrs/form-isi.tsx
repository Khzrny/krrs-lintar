"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { simpanKrrs } from "./actions";
import type { MataKuliahLengkap } from "@/types/database";
import { HARI_URUT, formatJam, jamKeMenit, menitKeJam } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  IconAlert,
  IconBook,
  IconCalendar,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconLock,
  ProgressBar,
} from "@/components/ui";

const MAKS_SKS = 24;
const JAM_MULAI_GRID = 7 * 60; // 07.00
const JAM_AKHIR_GRID = 21.5 * 60; // 21.30
const SKALA_PX_PER_MENIT = 0.72;

type Sesi = {
  mk: MataKuliahLengkap;
  hari: string;
  mulai: number;
  selesai: number;
  ruang: string;
};

export function FormIsiKrrs({
  daftar,
  terpilihAwal,
  status,
}: {
  daftar: MataKuliahLengkap[];
  terpilihAwal: number[];
  status: "draft" | "terkunci" | "disetujui" | "ditolak" | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pesan, setPesan] = useState<{ ok: boolean; text: string } | null>(null);
  const [dipilih, setDipilih] = useState<Set<number>>(() => new Set(terpilihAwal));

  const terkunci = status != null && status !== "draft" && status !== "ditolak";

  const wajib = useMemo(() => daftar.filter((m) => m.jenis === "Wajib"), [daftar]);

  // Auto-centang matkul wajib sekali saja
  const [autoWajib, setAutoWajib] = useState(false);
  if (!autoWajib && !terpilihAwal.length) {
    setDipilih((prev) => {
      const next = new Set(prev);
      wajib.forEach((m) => next.add(m.id));
      return next;
    });
    setAutoWajib(true);
  } else if (!autoWajib) {
    setAutoWajib(true);
  }

  const pilihan = daftar.filter((m) => m.jenis === "Pilihan");
  const totalSks = daftar
    .filter((m) => dipilih.has(m.id))
    .reduce((a, m) => a + m.sks, 0);

  // ————— Deteksi bentrok —————
  const bentrok = useMemo(() => {
    const hasil = new Map<number, Set<number>>();
    const sesiTerpilih: Sesi[] = [];
    for (const mk of daftar) {
      if (!dipilih.has(mk.id)) continue;
      for (const j of mk.jadwal) {
        sesiTerpilih.push({
          mk,
          hari: j.hari,
          mulai: jamKeMenit(j.jam_mulai.slice(0, 5)),
          selesai: jamKeMenit(j.jam_selesai.slice(0, 5)),
          ruang: j.ruang,
        });
      }
    }
    for (let i = 0; i < sesiTerpilih.length; i++) {
      for (let k = i + 1; k < sesiTerpilih.length; k++) {
        const a = sesiTerpilih[i];
        const b = sesiTerpilih[k];
        if (a.hari !== b.hari) continue;
        if (a.mulai < b.selesai && b.mulai < a.selesai) {
          if (!hasil.has(a.mk.id)) hasil.set(a.mk.id, new Set());
          if (!hasil.has(b.mk.id)) hasil.set(b.mk.id, new Set());
          hasil.get(a.mk.id)!.add(b.mk.id);
          hasil.get(b.mk.id)!.add(a.mk.id);
        }
      }
    }
    return hasil;
  }, [daftar, dipilih]);

  const adaBentrok = bentrok.size > 0;

  function toggle(mk: MataKuliahLengkap) {
    if (terkunci) return;
    if (mk.jenis === "Wajib") return; // paket wajib tidak bisa dilepas
    setPesan(null);
    setDipilih((prev) => {
      const next = new Set(prev);
      if (next.has(mk.id)) next.delete(mk.id);
      else if (totalSks + mk.sks <= MAKS_SKS) next.add(mk.id);
      return next;
    });
  }

  function simpan() {
    startTransition(async () => {
      const res = await simpanKrrs([...dipilih]);
      setPesan({ ok: res.ok, text: res.pesan });
      if (res.ok) router.refresh();
    });
  }

  // ————— Sesi untuk grid jadwal —————
  const sesiGrid = useMemo(() => {
    const list: Sesi[] = [];
    for (const mk of daftar) {
      if (!dipilih.has(mk.id)) continue;
      for (const j of mk.jadwal) {
        list.push({
          mk,
          hari: j.hari,
          mulai: jamKeMenit(j.jam_mulai.slice(0, 5)),
          selesai: jamKeMenit(j.jam_selesai.slice(0, 5)),
          ruang: j.ruang,
        });
      }
    }
    return list;
  }, [daftar, dipilih]);

  return (
    <div className="animate-fade-up mx-auto max-w-6xl space-y-6">
      {/* ————— Ringkasan atas ————— */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Pengisian KRRS</h1>
          <p className="mt-1 text-sm text-muted">
            TA 2026/2027 Ganjil · Mata kuliah paket wajib tercentang otomatis.
          </p>
        </div>
        {terkunci ? (
          <Link href="/cetak">
            <Button variant="gold">
              Lihat KRRS terkunci <IconLock className="size-4" />
            </Button>
          </Link>
        ) : (
          <Button onClick={simpan} disabled={pending || adaBentrok || totalSks === 0}>
            {pending ? "Menyimpan…" : "Simpan Draft"}
          </Button>
        )}
      </div>

      {terkunci ? (
        <Alert tone="warning" title="KRRS sudah dikunci">
          Pengubahan isi KRRS tidak lagi diizinkan. Status saat ini:{" "}
          <b>{status === "disetujui" ? "Disetujui staf" : "Menunggu verifikasi staf"}</b>.{" "}
          <Link href="/konfirmasi" className="font-bold underline">
            Lihat konfirmasi →
          </Link>
        </Alert>
      ) : null}

      {pesan ? (
        <Alert tone={pesan.ok ? "success" : "danger"}>{pesan.text}</Alert>
      ) : null}

      {adaBentrok && !terkunci ? (
        <Alert tone="danger" title="Terdapat jadwal yang bentrok!">
          Perbaiki pilihan Anda — tombol simpan terkunci selama masih ada bentrok.
        </Alert>
      ) : null}

      {/* ————— Penghitung SKS ————— */}
      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 font-bold text-foreground">
            <IconBook className="size-5" /> Total SKS: {totalSks} / {MAKS_SKS}
          </p>
          <div className="flex items-center gap-2">
            <Badge tone="primary">{wajib.length} wajib (paket)</Badge>
            <Badge tone="gold">{pilihan.filter((m) => dipilih.has(m.id)).length} pilihan</Badge>
            {adaBentrok ? (
              <Badge tone="red">
                <IconAlert className="size-3.5" /> {bentrok.size} matkul bentrok
              </Badge>
            ) : (
              <Badge tone="green">
                <IconCheck className="size-3.5" /> Jadwal aman
              </Badge>
            )}
          </div>
        </div>
        <ProgressBar
          value={totalSks}
          max={MAKS_SKS}
          tone={totalSks > MAKS_SKS ? "red" : totalSks >= 20 ? "gold" : "primary"}
        />
      </Card>

      {/* ————— Tabel pilihan ————— */}
      <Card>
        <CardHeader
          title="Daftar Mata Kuliah"
          desc="Centang mata kuliah pilihan — sistem memeriksa bentrok jadwal secara otomatis"
          icon={<IconCalendar className="size-5" />}
        />
        <div className="-mx-5 overflow-x-auto px-5 pb-2 sm:-mx-4 sm:px-4">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-(--border) text-left text-xs tracking-wide text-muted uppercase">
                <th className="py-2.5 pr-2 font-bold"></th>
                <th className="py-2.5 pr-3 font-bold">Kode</th>
                <th className="py-2.5 pr-3 font-bold">Matakuliah</th>
                <th className="py-2.5 pr-3 text-center font-bold">SKS</th>
                <th className="py-2.5 pr-3 font-bold">Jenis</th>
                <th className="py-2.5 font-bold">Jadwal</th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((mk) => {
                const aktif = dipilih.has(mk.id);
                const konflik = bentrok.has(mk.id);
                return (
                  <tr
                    key={mk.id}
                    className={cn(
                      "border-b border-(--border)/60 transition-colors last:border-0",
                      aktif && "bg-primary-50/70 dark:bg-primary-900/30",
                      konflik && aktif && "bg-red-50 dark:bg-red-950/40"
                    )}
                  >
                    <td className="py-3 pr-2">
                      <input
                        type="checkbox"
                        checked={aktif}
                        disabled={terkunci || mk.jenis === "Wajib"}
                        onChange={() => toggle(mk)}
                        className="size-4 cursor-pointer accent-primary-700 disabled:cursor-not-allowed"
                        aria-label={`Pilih ${mk.nama}`}
                      />
                    </td>
                    <td className="py-3 pr-3 font-mono text-xs font-semibold text-primary-700 dark:text-primary-300">
                      {mk.kode}
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-foreground">
                        {mk.nama} {mk.kelas ? <span className="text-muted">({mk.kelas})</span> : null}
                        {konflik && aktif ? (
                          <span title="Bentrok dengan matkul lain" className="ml-1.5 inline-block align-middle text-red-600 dark:text-red-400">
                            <IconAlert className="size-4" />
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted">{mk.dosen}</p>
                    </td>
                    <td className="py-3 pr-3 text-center font-semibold text-foreground">{mk.sks}</td>
                    <td className="py-3 pr-3">
                      <Badge tone={mk.jenis === "Wajib" ? "primary" : "gold"}>
                        {mk.jenis === "Wajib" ? mk.paket ?? "Wajib" : "Pilihan"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {mk.jadwal.map((j) => (
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
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ————— Grid jadwal mingguan ————— */}
      <Card>
        <CardHeader
          title="Pratinjau Jadwal Mingguan"
          desc="Tampilan visual Senin–Jumat sesuai pilihan Anda"
          icon={<IconCalendar className="size-5" />}
        />
        <div className="overflow-x-auto p-4 sm:p-5">
          <div className="flex min-w-[720px]">
            {/* Kolom jam */}
            <div className="w-12 shrink-0">
              <div className="h-9" />
              <div className="relative" style={{ height: (JAM_AKHIR_GRID - JAM_MULAI_GRID) * SKALA_PX_PER_MENIT }}>
                {Array.from({ length: 15 }, (_, i) => 7 + i).map((jam) => (
                  <div
                    key={jam}
                    className="absolute right-1 -translate-y-1/2 text-[10px] font-semibold text-muted"
                    style={{ top: (jam * 60 - JAM_MULAI_GRID) * SKALA_PX_PER_MENIT }}
                  >
                    {String(jam).padStart(2, "0")}.00
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom hari */}
            {HARI_URUT.map((hari) => {
              const sesiHari = sesiGrid.filter((s) => s.hari === hari);
              // Bagi blok yang tumpang tindih menjadi kolom berdampingan
              const posisi = new Map<Sesi, { left: number; width: number }>();
              const urut = [...sesiHari].sort((a, b) => a.mulai - b.mulai);
              let cluster: Sesi[] = [];
              let clusterEnd = -1;
              const flush = () => {
                if (!cluster.length) return;
                const kolom: number[] = [];
                for (const s of cluster) {
                  let c = 0;
                  while (kolom[c] != null && kolom[c] > s.mulai) c++;
                  kolom[c] = s.selesai;
                  posisi.set(s, { left: c / cluster.length, width: 1 / cluster.length });
                }
                cluster = [];
              };
              for (const s of urut) {
                if (s.mulai >= clusterEnd) flush();
                cluster.push(s);
                clusterEnd = Math.max(clusterEnd, s.selesai);
              }
              flush();

              return (
                <div key={hari} className="flex-1 border-l border-(--border)">
                  <div className="flex h-9 items-center justify-center border-b border-(--border) pb-0.5 text-xs font-bold text-foreground">
                    {hari}
                  </div>
                  <div
                    className="relative"
                    style={{ height: (JAM_AKHIR_GRID - JAM_MULAI_GRID) * SKALA_PX_PER_MENIT }}
                  >
                    {Array.from({ length: 15 }, (_, i) => 7 + i).map((jam) => (
                      <div
                        key={jam}
                        className="absolute inset-x-0 border-t border-(--border)/70"
                        style={{ top: (jam * 60 - JAM_MULAI_GRID) * SKALA_PX_PER_MENIT }}
                      />
                    ))}
                    {sesiHari.map((s) => {
                      const p = posisi.get(s)!;
                      const konflik = bentrok.has(s.mk.id);
                      return (
                        <div
                          key={`${s.mk.id}-${s.mulai}`}
                          title={`${s.mk.nama} · ${s.ruang}`}
                          className={cn(
                            "absolute overflow-hidden rounded-md px-1.5 py-1 text-[10px] leading-tight font-semibold text-white shadow-sm",
                            konflik
                              ? "z-10 border-2 border-red-500 bg-red-500/90"
                              : s.mk.jenis === "Wajib"
                                ? "bg-primary-600 dark:bg-primary-500"
                                : "bg-gold-600 dark:bg-gold-500"
                          )}
                          style={{
                            top: (s.mulai - JAM_MULAI_GRID) * SKALA_PX_PER_MENIT + 1,
                            height: Math.max((s.selesai - s.mulai) * SKALA_PX_PER_MENIT - 2, 18),
                            left: `calc(${p.left * 100}% + 2px)`,
                            width: `calc(${p.width * 100}% - 4px)`,
                          }}
                        >
                          <p className="truncate">{s.mk.kode}</p>
                          <p className="truncate opacity-80">
                            {menitKeJam(s.mulai)}·{s.ruang}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-primary-600 dark:bg-primary-500" /> Wajib (paket)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-gold-600 dark:bg-gold-500" /> Pilihan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded border-2 border-red-500 bg-red-500/90" /> Bentrok
            </span>
          </div>
        </div>
      </Card>

      {/* ————— Aksi bawah ————— */}
      {!terkunci ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--border) bg-(--surface) p-4">
          <p className="flex items-center gap-2 text-sm text-muted">
            <IconCheckCircle className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            Sudah yakin dengan susunan jadwal Anda?
          </p>
          <div className="flex gap-2">
            <Button onClick={simpan} disabled={pending || adaBentrok || totalSks === 0}>
              {pending ? "Menyimpan…" : "Simpan Draft"}
            </Button>
            <Link href="/konfirmasi">
              <Button variant="gold">Lanjut ke Konfirmasi</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
