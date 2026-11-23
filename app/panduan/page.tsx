import Link from "next/link";
import { BrandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Badge,
  Button,
  Card,
  IconAlert,
  IconArrowRight,
  IconBook,
  IconCalendar,
  IconChart,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconGraduation,
  IconHelp,
  IconLock,
  IconPrinter,
  IconShield,
  IconUser,
} from "@/components/ui";

export const metadata = { title: "Panduan KRRS" };

const LANGKAH = [
  {
    icon: <IconUser className="size-6" />,
    title: "1 · Masuk ke akun",
    desc: "Login menggunakan email dan kata sandi akun Lintar KRRS Anda. Mahasiswa baru mendaftar terlebih dahulu melalui halaman Daftar.",
  },
  {
    icon: <IconGraduation className="size-6" />,
    title: "2 · Pilih jenjang",
    desc: "Pastikan jenjang studi Anda tepat (S1 / S2 / S3 / Profesi). Katalog mata kuliah yang tampil menyesuaikan jenjang — bisa diganti kapan saja lewat menu Ganti Jenjang.",
  },
  {
    icon: <IconBook className="size-6" />,
    title: "3 · Isi KRRS",
    desc: "Mata kuliah paket wajib tercentang otomatis. Pilih mata kuliah pilihan sesuai kebutuhan — perhatikan penghitung SKS (maksimal 24) dan peringatan jadwal bentrok.",
  },
  {
    icon: <IconLock className="size-6" />,
    title: "4 · Konfirmasi & kunci",
    desc: "Periksa ringkasan mata kuliah Anda di halaman Konfirmasi. Menekan tombol kunci berarti KRRS diajukan dan tidak bisa diubah lagi sampai diverifikasi staf.",
  },
  {
    icon: <IconShield className="size-6" />,
    title: "5 · Verifikasi staf",
    desc: "Staf akademik memeriksa KRRS Anda. Bila ada masalah, KRRS dapat ditolak beserta catatan perbaikan — Anda bisa membuka ulang draft dan memperbaikinya.",
  },
  {
    icon: <IconPrinter className="size-6" />,
    title: "6 · Cetak KRRS",
    desc: "Setelah disetujui, dokumen KRRS resmi berkop universitas dapat dicetak atau disimpan sebagai PDF dari halaman Cetak KRRS.",
  },
];

const ATURAN = [
  {
    icon: <IconChart className="size-5" />,
    title: "Batas SKS",
    desc: "Maksimal 24 SKS per semester. Sistem otomatis mencegah penambahan mata kuliah yang melampaui batas.",
  },
  {
    icon: <IconCalendar className="size-5" />,
    title: "Paket wajib",
    desc: "Mata kuliah paket (mis. Paket 3 dan Paket 5 untuk S1 TI) wajib diambil dan tidak dapat dihapus centangnya.",
  },
  {
    icon: <IconAlert className="size-5" />,
    title: "Jadwal bentrok",
    desc: "Dua mata kuliah tidak boleh bertabrakan waktunya — termasuk kelas dua sesi per minggu. Baris yang bentrok menyala merah dan tombol simpan terkunci.",
  },
  {
    icon: <IconLock className="size-5" />,
    title: "Sekali kunci",
    desc: "KRRS yang sudah dikunci tidak dapat diubah sendiri. Hubungi staf akademik untuk revisi.",
  },
];

const FAQ = [
  {
    q: "Apa yang terjadi jika KRRS saya ditolak staf?",
    a: "Anda menerima catatan penolakan di halaman Konfirmasi. Tekan tombol \"Buka ulang draft\", perbaiki pilihan mata kuliah Anda, lalu kunci kembali untuk diverifikasi ulang.",
  },
  {
    q: "Kenapa mata kuliah wajib tidak bisa dihapus centangnya?",
    a: "Mata kuliah paket wajib memang diambil seluruhnya oleh mahasiswa seangkatan. Kotak centangnya dikunci oleh sistem demi mencegah kesalahan.",
  },
  {
    q: "Bagaimana cara melihat jadwal bentrok?",
    a: "Baris mata kuliah yang bentrok menyala merah dengan ikon peringatan, blok jadwal di pratinjau mingguan juga diberi bingkai merah. Lepaskan salah satu mata kuliah untuk menghilangkan bentrok.",
  },
  {
    q: "Apakah KRRS bisa dicetak sebelum disetujui?",
    a: "Bisa — sebagai dokumen pratinjau berstatus \"menunggu verifikasi\". Namun cetakan resmi (berstempel TERVERIFIKASI) hanya muncul setelah staf menyetujui.",
  },
  {
    q: "Saya salah memilih jenjang, apa harus mendaftar ulang?",
    a: "Tidak. Buka menu Ganti Jenjang lalu pilih jenjang yang benar — katalog mata kuliah langsung menyesuaikan.",
  },
  {
    q: "Bagaimana IP kumulatif dihitung?",
    a: "IP kumulatif = total (bobot × SKS) dibagi total SKS dari seluruh mata kuliah yang sudah bernilai. Semester yang sedang ditempuh tidak ikut dihitung.",
  },
];

export default function PanduanPage() {
  return (
    <div className="min-h-dvh bg-linear-to-b from-primary-50 via-background to-background dark:from-primary-950/40">
      {/* Navbar */}
      <header className="no-print sticky top-0 z-20 border-b border-(--border) bg-(--surface)/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <BrandMark />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button size="sm">Masuk</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10 sm:px-6">
        {/* Hero */}
        <section className="animate-fade-up text-center">
          <Badge tone="gold" className="mx-auto">
            <IconHelp className="size-3.5" /> Panduan Mahasiswa
          </Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Panduan Pengisian KRRS
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Enam langkah mudah dari masuk akun hingga mencetak Kartu Rencana Studi
            resmi — lengkap dengan aturan-aturan penting yang perlu Anda ketahui.
          </p>
        </section>

        {/* Langkah-langkah */}
        <section aria-label="Langkah pengisian" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANGKAH.map((l) => (
            <Card key={l.title} className="p-5">
              <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/70 dark:text-gold-300">
                {l.icon}
              </span>
              <p className="font-bold text-foreground">{l.title}</p>
              <p className="mt-1 text-sm text-muted">{l.desc}</p>
            </Card>
          ))}
        </section>

        {/* Aturan penting */}
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-foreground">Aturan Penting</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ATURAN.map((a) => (
              <Card key={a.title} className="flex gap-3 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700 dark:bg-gold-900/50 dark:text-gold-300">
                  {a.icon}
                </span>
                <div>
                  <p className="font-bold text-foreground">{a.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{a.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline singkat */}
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-foreground">Alur Singkat</h2>
          <Card className="p-6">
            <ol className="relative space-y-6 border-l-2 border-dashed border-(--border) pl-6">
              {[
                { t: "Isi & simpan draft", d: "Kapan saja, boleh diulang sampai benar", icon: <IconBook className="size-4" /> },
                { t: "Kunci KRRS", d: "Diajukan ke staf — tidak bisa diubah lagi", icon: <IconLock className="size-4" /> },
                { t: "Verifikasi staf", d: "Disetujui, atau ditolak dengan catatan", icon: <IconClock className="size-4" /> },
                { t: "Cetak dokumen", d: "KRRS resmi siap dicetak / PDF", icon: <IconCheckCircle className="size-4" /> },
              ].map((s, i) => (
                <li key={s.t} className="relative">
                  <span className="absolute top-0 -left-[35px] flex size-6 items-center justify-center rounded-full bg-primary-700 text-white ring-4 ring-(--surface)">
                    {s.icon}
                  </span>
                  <p className="font-bold text-foreground">
                    {i + 1}. {s.t}
                  </p>
                  <p className="text-sm text-muted">{s.d}</p>
                </li>
              ))}
            </ol>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-foreground">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="space-y-2">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="card-surface group rounded-xl transition-shadow open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold text-foreground select-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-2">
                    <IconHelp className="size-4 shrink-0 text-gold-600 dark:text-gold-400" />
                    {f.q}
                  </span>
                  <IconArrowRight className="size-4 shrink-0 text-muted transition-transform group-open:rotate-90" />
                </summary>
                <p className="border-t border-(--border) px-4 py-3 text-sm text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-linear-to-br from-primary-800 to-primary-950 p-8 text-white">
            <h2 className="text-xl font-extrabold">Siap mengatur semester Anda?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-primary-200">
              Semua fitur panduan di atas sudah tersedia di aplikasi. Masuk dan
              mulai menyusun rencana studi terbaik Anda.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/isi-krrs">
                <Button variant="gold">
                  <IconCheck className="size-4" /> Mulai isi KRRS
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Masuk
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>

      <footer className="no-print border-t border-(--border) bg-(--surface) py-6">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-muted sm:px-6">
          Lintar KRRS · Panduan Mahasiswa — replika untuk tugas mata kuliah Front-End,
          bukan produk resmi Universitas Tarumanagara.
        </p>
      </footer>
    </div>
  );
}
