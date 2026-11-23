import Link from "next/link";
import Image from "next/image";
import { BrandMark, LogoUntar } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { IconBook, IconCalendar, IconCheckCircle, IconShield } from "@/components/ui";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel kiri — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-950 p-10 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-primary-400/10 blur-3xl"
        />
        {/* Watermark logo UNTAR besar di sudut kanan-bawah */}
        <Image
          src="/logo-untar.png"
          alt=""
          width={520}
          height={496}
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-24 select-none opacity-[0.09]"
        />
        {/* Motif garis lengkung halus */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0 34px, rgba(255,255,255,0.35) 34px 36px)",
          }}
        />

        <Link href="/" className="relative">
          <span className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-gold-400/50">
              <LogoUntar className="size-8" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold">
                Lintar <span className="text-gold-400">KRRS</span>
              </span>
              <span className="block text-[10px] font-medium tracking-[0.14em] text-primary-200 uppercase">
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
          <p className="mt-3 text-sm text-primary-200">
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
                  <span className="block text-xs text-primary-200">{f.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-300">
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
