import Link from "next/link";
import { getUserDanProfile, getKrrs, getMataKuliahByIds, TA_AKTIF } from "@/lib/data";
import { formatJam, formatTanggal } from "@/lib/utils";
import { statusBadge } from "@/lib/status";
import { LogoUntar } from "@/components/logo";
import { TombolCetak } from "./tombol-cetak";
import { Badge, Button, EmptyState, IconBook } from "@/components/ui";
import type { MataKuliahLengkap } from "@/types/database";

export const metadata = { title: "Cetak KRRS" };

export default async function CetakPage() {
  const { profile } = await getUserDanProfile();
  if (!profile) return null;

  const krrs = await getKrrs(profile.id, TA_AKTIF);

  if (!krrs || krrs.item.length === 0) {
    return (
      <div className="animate-fade-up mx-auto max-w-4xl">
        <h1 className="text-2xl font-extrabold text-foreground">Cetak KRRS</h1>
        <div className="mt-6">
          <EmptyState
            icon={<IconBook className="size-7" />}
            title="Belum ada KRRS untuk dicetak"
            desc="Isi dan kunci KRRS Anda terlebih dahulu."
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
  const totalSks = daftar.reduce((a, m) => a + m.sks, 0);
  const disetujui = krrs.krrs.status === "disetujui";

  return (
    <div className="animate-fade-up mx-auto max-w-4xl space-y-5">
      {/* Toolbar (tidak tercetak) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Cetak KRRS</h1>
          <p className="mt-1 text-sm text-muted">
            Dokumen A4 — gunakan &quot;Simpan sebagai PDF&quot; bila ingin berkas digital.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={statusBadge[krrs.krrs.status].tone}>
            {statusBadge[krrs.krrs.status].label}
          </Badge>
          <TombolCetak />
        </div>
      </div>

      {!disetujui ? (
        <div className="no-print">
          <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
            Dokumen ini berstatus <b>{statusBadge[krrs.krrs.status].label}</b> — cetakan
            resmi sebaiknya menunggu persetujuan staf akademik.
          </div>
        </div>
      ) : null}

      {/* ————— Dokumen ————— */}
      <div className="print-area card-surface rounded-xl bg-white p-8 text-black shadow-sm sm:p-10 dark:bg-white">
        {/* Kop */}
        <header className="flex items-center gap-4 border-b-4 border-double border-navy-900 pb-4">
          <LogoUntar className="size-16 shrink-0" />
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold tracking-[0.08em]">UNIVERSITAS TARUMANEGARA</p>
            <p className="text-lg font-extrabold tracking-[0.08em]">
              FAKULTAS TEKNOLOGI INFORMASI
            </p>
            <p className="text-[10px] text-gray-600">
              Jl. Letjen S. Parman No.1, Jakarta Barat 11440 · www.untar.ac.id
            </p>
          </div>
          <span className="w-16 shrink-0" />
        </header>

        <h2 className="mt-6 text-center text-sm font-extrabold tracking-[0.2em] underline">
          KARTU RENCANA STUDI (KRRS)
        </h2>
        <p className="mt-1 text-center text-[11px] text-gray-700">
          Tahun Akademik 2026/2027 — Ganjil
        </p>

        {/* Identitas */}
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-1 text-xs sm:grid-cols-2">
          {[
            ["Nama", profile.nama],
            ["NIM", profile.nim ?? "—"],
            ["Program Studi", profile.program_studi],
            ["Jenjang", profile.jenjang],
            ["Fakultas", profile.fakultas],
            ["Status KRRS", disetujui ? "DISETUJUI" : statusBadge[krrs.krrs.status].label.toUpperCase()],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="w-28 shrink-0 font-bold">{k}</dt>
              <dd className="flex-1 border-b border-dotted border-gray-400">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Tabel matkul */}
        <table className="mt-6 w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-navy-50 text-left">
              <th className="border border-gray-400 px-2 py-1.5 text-center font-bold">No</th>
              <th className="border border-gray-400 px-2 py-1.5 font-bold">Kode</th>
              <th className="border border-gray-400 px-2 py-1.5 font-bold">Mata Kuliah</th>
              <th className="border border-gray-400 px-2 py-1.5 text-center font-bold">SKS</th>
              <th className="border border-gray-400 px-2 py-1.5 font-bold">Jadwal</th>
            </tr>
          </thead>
          <tbody>
            {daftar.map((m: MataKuliahLengkap, i) => (
              <tr key={m.id}>
                <td className="border border-gray-400 px-2 py-1.5 text-center">{i + 1}</td>
                <td className="border border-gray-400 px-2 py-1.5 font-mono">{m.kode}</td>
                <td className="border border-gray-400 px-2 py-1.5">
                  {m.nama}
                  {m.kelas ? ` (${m.kelas})` : ""}
                  <span className="block text-[9px] text-gray-600">{m.dosen}</span>
                </td>
                <td className="border border-gray-400 px-2 py-1.5 text-center font-bold">{m.sks}</td>
                <td className="border border-gray-400 px-2 py-1.5">
                  {m.jadwal
                    .map((j) => `${j.hari} ${formatJam(j.jam_mulai)}–${formatJam(j.jam_selesai)} (${j.ruang})`)
                    .join("; ")}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td colSpan={3} className="border border-gray-400 px-2 py-1.5 text-right">
                Total SKS
              </td>
              <td className="border border-gray-400 px-2 py-1.5 text-center">{totalSks}</td>
              <td className="border border-gray-400 px-2 py-1.5" />
            </tr>
          </tbody>
        </table>

        {/* Tanda tangan */}
        <div className="mt-10 flex items-start justify-between text-[11px]">
          <div className="text-center">
            <p>Mahasiswa yang bersangkutan,</p>
            <div className="mt-16 border-t border-gray-500 px-8 pt-1 font-bold">
              {profile.nama}
            </div>
            <p>NIM: {profile.nim ?? "—"}</p>
          </div>

          <div className="relative text-center">
            {disetujui ? (
              <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-12 rounded border-[3px] border-emerald-600 px-3 py-0.5 text-xs font-extrabold tracking-widest text-emerald-700">
                TERVERIFIKASI
              </span>
            ) : null}
            <p>Jakarta, {formatTanggal(krrs.krrs.verified_at ?? krrs.krrs.updated_at)}</p>
            <p>Dekan Fakultas Teknologi Informasi,</p>
            <div className="mt-16 border-t border-gray-500 px-10 pt-1 font-bold">
              Prof. Dr. Ir. Thomas Gozali, M.M.
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] text-gray-500">
          Dokumen ini diterbitkan melalui Lintar KRRS — replika sistem akademik untuk
          keperluan tugas. Nomor dokumen: KRRS/{profile.nim ?? "000000"}/{TA_AKTIF}.
        </p>
      </div>
    </div>
  );
}
