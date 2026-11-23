"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Alert,
  Button,
  Field,
  IconAlert,
  IconLock,
  IconUser,
  Input,
} from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Email atau kata sandi salah. Silakan coba lagi.");
        return;
      }
      // Arahkan sesuai peran (staf → aplikasi staf)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profil } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user!.id)
        .single();
      const next = params.get("next");
      if (profil?.role === "staf") router.push("/staf");
      else router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
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
          Buat file <code>.env.local</code> berisi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, lalu jalankan ulang{" "}
          <code>npm run dev</code>. Ikuti panduan di <code>supabase/README.md</code>.
        </p>
      </Alert>
    );
  }

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-extrabold text-foreground">Masuk</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Gunakan email dan kata sandi akun Lintar KRRS Anda.
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
        <Field label="Email">
          <div className="relative">
            <IconUser className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <Input
              type="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Field>

        <Field label="Kata Sandi">
          <div className="relative">
            <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <Input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-9"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Masuk"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-bold text-primary-600 hover:underline dark:text-gold-400">
          Daftar sekarang
        </Link>
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-(--border) bg-(--surface-2) p-3 text-xs text-muted">
        <p className="font-bold text-foreground">Akun demo staf:</p>
        <p>staf@untar.ac.id · staf12345</p>
      </div>
    </div>
  );
}
