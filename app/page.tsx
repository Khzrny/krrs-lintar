import Link from "next/link";
import { BrandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Badge,
  Button,
  Card,
  IconArrowRight,
  IconBook,
  IconGraduation,
  IconHelp,
  IconUsers,
} from "@/components/ui";

const jenjang = [
  {
    href: "/login",
    label: "Mahasiswa S1",
    desc: "Sarjana — Teknik Informatika & program sarjana lainnya.",
    icon: <IconGraduation className="size-7" />,
    tone: "navy",
  },
  {
    href: "/login",
    label: "Mahasiswa S2, S3 & Profesi",
    desc: "Pascasarjana, doktoral, dan program profesi.",
    icon: <IconUsers className="size-7" />,
    tone: "gold",
  },
  {
    href: "/panduan",
    label: "Panduan KRRS",
    desc: "Petunjuk lengkap pengisian KRRS untuk mahasiswa.",
    icon: <IconHelp className="size-7" />,
    tone: "green",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-linear-to-b from-primary-50 via-background to-background dark:from-primary-950/40">
      {/* ————— Navbar ————— */}
      <header className="sticky top-0 z-20 border-b border-(--border) bg-(--surface)/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Beranda Lintar KRRS">
            <BrandMark />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/panduan"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-(--surface-2) hover:text-foreground sm:block"
            >
              Panduan
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <Button size="sm">Masuk</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {/* ————— Hero ————— */}
        <section className="animate-fade-up py-14 text-center sm:py-20">
          <Badge tone="gold" className="mx-auto">
            <span className="inline-block size-1.5 rounded-full bg-gold-500" />
            Universitas Tarumanagara · TA 2026/2027 Ganjil
          </Badge>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Kartu Rencana Studi{" "}
            <span className="bg-linear-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent dark:from-primary-300 dark:to-gold-400">
              Online
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
            Rencanakan semester Anda: lihat histori nilai, susun jadwal mata
            kuliah, hindari bentrok, lalu konfirmasi dan cetak KRRS — semuanya
            tersimpan aman di database.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" variant="gold">
                Daftar Akun Baru <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Masuk sebagai Mahasiswa
              </Button>
            </Link>
          </div>
        </section>

        {/* ————— Pilihan jenjang ————— */}
        <section className="pb-14 sm:pb-20">
          <h2 className="mb-1 text-center text-lg font-bold text-foreground">
            Pilih Jenjang
          </h2>
          <p className="mb-6 text-center text-sm text-muted">
            Klik kartu di bawah sesuai status Anda
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {jenjang.map((j) => {
              const iconCls =
                j.tone === "gold"
                  ? "bg-gold-100 text-gold-700 dark:bg-gold-900/50 dark:text-gold-300"
                  : j.tone === "green"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                    : "bg-primary-100 text-primary-700 dark:bg-primary-900/70 dark:text-primary-200";
              return (
                <Link key={j.label} href={j.href} className="group">
                  <Card className="flex h-full flex-col items-center gap-3 p-6 text-center transition-all group-hover:-translate-y-1 group-hover:border-gold-400 group-hover:shadow-lg group-hover:shadow-primary-950/10">
                    <span
                      className={`flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${iconCls}`}
                    >
                      {j.icon}
                    </span>
                    <p className="font-bold text-foreground">{j.label}</p>
                    <p className="text-sm text-muted">{j.desc}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:text-gold-600 dark:text-primary-300 dark:group-hover:text-gold-400">
                      Klik di sini <IconArrowRight className="size-4" />
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ————— Ringkasan fitur ————— */}
        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {[
            {
              icon: <IconBook className="size-6" />,
              title: "Histori Nilai",
              desc: "Rekap nilai per semester lengkap dengan IP semester dan IP kumulatif yang dihitung otomatis.",
            },
            {
              icon: <IconGraduation className="size-6" />,
              title: "Pengisian KRRS",
              desc: "Mata kuliah paket tercentang otomatis, hitung SKS real-time, dan deteksi jadwal yang bentrok.",
            },
            {
              icon: <IconUsers className="size-6" />,
              title: "Verifikasi Staf",
              desc: "Staf akademik memverifikasi KRRS yang sudah dikunci mahasiswa sebelum dicetak resmi.",
            },
          ].map((f) => (
            <Card key={f.title} className="p-5">
              <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/70 dark:text-gold-300">
                {f.icon}
              </span>
              <p className="font-bold text-foreground">{f.title}</p>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </Card>
          ))}
        </section>
      </main>

      <footer className="no-print border-t border-(--border) bg-(--surface) py-6">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-muted sm:px-6">
          Lintar KRRS — replika sistem akademik untuk tugas mata kuliah
          Front-End. Bukan produk resmi Universitas Tarumanagara.
        </p>
      </footer>
    </div>
  );
}
