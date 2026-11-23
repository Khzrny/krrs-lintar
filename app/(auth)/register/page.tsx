"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Jenjang } from "@/types/database";
import { cn } from "@/lib/utils";
import {
  Alert,
  Badge,
  Button,
  Field,
  IconAlert,
  IconCheckCircle,
  IconGraduation,
  IconLock,
  IconUser,
  Input,
} from "@/components/ui";

const JENJANG_OPSI: { value: Jenjang; label: string; desc: string }[] = [
  { value: "S1", label: "S1 — Sarjana", desc: "Teknik Informatika" },
  { value: "S2", label: "S2 — Magister", desc: "Pascasarjana" },
  { value: "S3", label: "S3 — Doktoral", desc: "Pascasarjana" },
  { value: "Profesi", label: "Profesi", desc: "Program Profesi" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", nim: "", email: "", password: "", konfirmasi: "" });
  const [jenjang, setJenjang] = useState<Jenjang>("S1");
  const [error, setError] = useState<string | null>(null);
  const [perluVerifikasi, setPerluVerifikasi] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (form.password !== form.konfirmasi) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            nama: form.nama,
            nim: form.nim,
            jenjang,
            role: "mahasiswa",
          },
        },
      });
      if (error) {
        setError(
          error.message.includes("already")
            ? "Email sudah terdaftar — silakan masuk."
            : error.message
        );
        return;
      }
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Konfirmasi email aktif di Supabase → minta user memverifikasi
        setPerluVerifikasi(true);
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <Alert tone="warning" title="Database belum terhubung">
        <p>
          Lengkapi <code>.env.local</code> (URL &amp; anon key Supabase) lalu jalankan ulang{" "}
          <code>npm run dev</code>. Panduan: <code>supabase/README.md</code>.
        </p>
      </Alert>
    );
  }

  if (perluVerifikasi) {
    return (
      <div className="animate-pop-in text-center">
        <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300">
          <IconCheckCircle className="size-8" />
        </span>
        <h1 className="text-xl font-extrabold text-foreground">Pendaftaran berhasil!</h1>
        <p className="mt-2 text-sm text-muted">
          Kami mengirim tautan verifikasi ke <b>{form.email}</b>. Buka email Anda,
          klik tautannya, lalu masuk kembali.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button variant="outline">Kembali ke halaman masuk</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold text-foreground">Daftar akun baru</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Data histori nilai demo akan otomatis tersedia setelah mendaftar.
      </p>

      {error ? (
        <div className="mb-4">
          <Alert tone="danger">
            <span className="flex items-center gap-2">
              <IconAlert className="size-4 shrink-0" /> {error}
            </span>
          </Alert>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nama lengkap">
          <div className="relative">
            <IconUser className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <Input required placeholder="cth: Aldho Prahauga" className="pl-9" value={form.nama} onChange={set("nama")} />
          </div>
        </Field>

        <Field label="NIM">
          <Input
            required
            inputMode="numeric"
            pattern="[0-9]{6,12}"
            placeholder="cth: 535250153"
            value={form.nim}
            onChange={set("nim")}
          />
        </Field>

        <Field label="Email">
          <Input type="email" required autoComplete="email" placeholder="nama@email.com" value={form.email} onChange={set("email")} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kata sandi" hint="Minimal 6 karakter.">
            <div className="relative">
              <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <Input type="password" required autoComplete="new-password" className="pl-9" value={form.password} onChange={set("password")} />
            </div>
          </Field>
          <Field label="Konfirmasi kata sandi">
            <div className="relative">
              <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <Input type="password" required autoComplete="new-password" className="pl-9" value={form.konfirmasi} onChange={set("konfirmasi")} />
            </div>
          </Field>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-foreground">Jenjang</span>
          <div className="grid grid-cols-2 gap-2">
            {JENJANG_OPSI.map((j) => (
              <button
                key={j.value}
                type="button"
                onClick={() => setJenjang(j.value)}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 text-left transition-all",
                  jenjang === j.value
                    ? "border-gold-500 bg-gold-50 ring-2 ring-gold-500/40 dark:bg-gold-900/30"
                    : "border-(--border) hover:border-navy-400 dark:hover:border-navy-500"
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <IconGraduation className="size-4" /> {j.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">{j.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" variant="gold" className="w-full" disabled={loading}>
          {loading ? "Mendaftarkan…" : "Daftar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-navy-600 hover:underline dark:text-gold-400">
          Masuk
        </Link>
      </p>

      <div className="mt-4 text-center">
        <Badge tone="navy">Anggota staf mendaftar lewat admin — lihat README</Badge>
      </div>
    </div>
  );
}
