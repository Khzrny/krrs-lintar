"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Badge,
  Button,
  IconBook,
  IconCalendar,
  IconCheckCircle,
  IconGrid,
  IconHelp,
  IconLogout,
  IconPrinter,
  IconShield,
  IconUser,
} from "@/components/ui";
import type { Jenjang, StatusKrrs } from "@/types/database";
import { statusBadge } from "@/lib/status";
import { cn } from "@/lib/utils";

type MenuKey = "dashboard" | "isi" | "konfirmasi" | "cetak" | "panduan";

const MENU_GROUPS: { label: string; items: { key: MenuKey; href: string; label: string; icon: React.ReactNode }[] }[] = [
  {
    label: "Utama",
    items: [
      { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: <IconGrid className="size-[18px]" /> },
      { key: "panduan", href: "/panduan", label: "Panduan KRRS", icon: <IconHelp className="size-[18px]" /> },
    ],
  },
  {
    label: "Kartu Rencana Studi",
    items: [
      { key: "isi", href: "/isi-krrs", label: "Isi KRRS", icon: <IconBook className="size-[18px]" /> },
      { key: "konfirmasi", href: "/konfirmasi", label: "Konfirmasi", icon: <IconCheckCircle className="size-[18px]" /> },
      { key: "cetak", href: "/cetak", label: "Cetak KRRS", icon: <IconPrinter className="size-[18px]" /> },
    ],
  },
];

export function AppShell({
  user,
  statusKrrs,
  children,
}: {
  user: { nama: string; nim: string | null; jenjang: Jenjang };
  statusKrrs: StatusKrrs | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const active = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-(--border) px-5">
        <BrandMark />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {MENU_GROUPS.map((g) => (
          <div key={g.label}>
            <p className="mb-1.5 px-3 text-[10px] font-bold tracking-[0.14em] text-muted uppercase">
              {g.label}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      active(item.href)
                        ? "bg-primary-800 text-white shadow-sm dark:bg-primary-700"
                        : "text-muted hover:bg-(--surface-2) hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                    {item.key === "isi" && statusKrrs ? (
                      <span className="ml-auto">
                        <Badge tone={statusBadge[statusKrrs].tone}>
                          {statusBadge[statusKrrs].label}
                        </Badge>
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-(--border) p-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-(--surface-2) px-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-700 text-xs font-bold text-white">
            {user.nama.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{user.nama}</p>
            <p className="truncate text-[11px] text-muted">
              {user.nim ?? "—"} · {user.jenjang}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="mt-1.5 w-full justify-start text-muted" onClick={logout}>
          <IconLogout className="size-4" /> Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-background">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-(--border) bg-(--surface) lg:block">
        {sidebar}
      </aside>

      {/* Drawer mobile */}
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Tutup menu"
            className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 border-r border-(--border) bg-(--surface) shadow-2xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      {/* Konten */}
      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-(--border) bg-(--surface)/85 px-4 backdrop-blur sm:px-6">
          <button
            aria-label="Buka menu"
            onClick={() => setOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-(--border) text-muted lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex min-w-0 items-center gap-2 lg:hidden">
            <BrandMark size="sm" withText={false} />
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Badge tone="navy">
              <IconCalendar className="size-3.5" /> TA 2026/2027 Ganjil
            </Badge>
            <Badge tone="gold">
              <IconUser className="size-3.5" /> Jenjang {user.jenjang}
            </Badge>
            {statusKrrs ? (
              <Badge tone={statusBadge[statusKrrs].tone}>
                <IconShield className="size-3.5" /> KRRS: {statusBadge[statusKrrs].label}
              </Badge>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="no-print px-4 pb-6 text-center text-xs text-muted sm:px-6 lg:px-8">
          Lintar KRRS · Universitas Tarumanagara — replika untuk tugas mata kuliah Front-End.
        </footer>
      </div>
    </div>
  );
}
