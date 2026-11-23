import Link from "next/link";
import { BrandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconBook, IconCalendar, IconCheckCircle, IconShield } from "@/components/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel kiri — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-navy-900 via-navy-800 to-navy-950 p-10 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-navy-400/10 blur-3xl"
        />

        <Link href="/" className="relative">
          <span className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-gold-400/50">
              <svg viewBox="0 0 48 48" className="size-7 text-gold-400" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M24 5 8 10v12c0 10 7 17.5 16 21 9-3.5 16-11 16-21V10L24 5z" />
                <line x1="17" y1="18" x2="17" y2="32" />
                <line x1="24" y1="18" x2="24" y2="32" />
                <line x1="31" y1="18" x2="31" y2="32" />
                <line x1="14" y1="34" x2="34" y2="34" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold">
                Lintar <span className="text-gold-400">KRRS</span>
              </span>
              <span className="block text-[10px] font-medium tracking-[0.14em] text-navy-200 uppercase">
                Universitas Tarumanagara
              </span>
            </span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <h1 className="text-3xl leading-tight font-extrabold">
            Rencanakan semestermu dengan{" "}
            <span className="text-gold-400">lebih mudah</span>.
          </h1>
          <p className="mt-3 text-sm text-navy-200">
            Satu aplikasi untuk melihat histori nilai, menyusun jadwal mata
            kuliah tanpa bentrok, hingga mencetak KRRS resmi.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: <IconBook className="size-5" />, t: "Histori nilai & IP otomatis", d: "Rekap nilai tiap semester langsung dari database." },
              { icon: <IconCalendar className="size-5" />, t: "Deteksi jadwal bentrok", d: "Sistem memeriksa setiap sesi kelas yang dipilih." },
              { icon: <IconShield className="size-5" />, t: "Verifikasi staf akademik", d: "KRRS dikunci lalu diverifikasi sebelum dicetak." },
              { icon: <IconCheckCircle className="size-5" />, t: "Cetak KRRS siap PDF", d: "Dokumen resmi berkop universitas dalam sekali klik." },
            ].map((f) => (
              <li key={f.t} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-300">
                  {f.icon}
                </span>
                <span>
                  <span className="block text-sm font-bold">{f.t}</span>
                  <span className="block text-xs text-navy-200">{f.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-navy-300">
          Replika sistem akademik untuk tugas mata kuliah Front-End — bukan produk resmi UNTAR.
        </p>
      </div>

      {/* Panel kanan — form */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Link href="/" className="lg:hidden">
            <BrandMark size="sm" />
          </Link>
          <span className="ml-auto">
            <ThemeToggle />
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
