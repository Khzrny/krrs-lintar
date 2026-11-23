import { redirect } from "next/navigation";
import { getUserDanProfile } from "@/lib/data";
import { logoutStaf } from "./actions-logout";

export default async function StafLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserDanProfile();
  if (!user || !profile) redirect("/login");
  if (profile.role !== "staf") redirect("/dashboard");

  return (
    <div className="min-h-dvh bg-background">
      <header className="no-print sticky top-0 z-20 border-b border-(--border) bg-primary-900 text-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-gold-300 ring-1 ring-gold-400/40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold">Aplikasi Staf KRRS</p>
            <p className="text-[10px] font-medium tracking-[0.14em] text-primary-300 uppercase">
              Akademik FTI · Lintar
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">{profile.nama}</p>
              <p className="text-[11px] text-primary-300">{profile.email}</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-gold-500 font-bold text-primary-950">
              {profile.nama.slice(0, 2).toUpperCase()}
            </span>
            <form action={logoutStaf}>
              <button
                type="submit"
                className="cursor-pointer rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/10"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>

      <footer className="no-print border-t border-(--border) py-6 text-center text-xs text-muted">
        Aplikasi Staf KRRS · Universitas Tarumanagara — replika untuk tugas mata kuliah Front-End.
      </footer>
    </div>
  );
}
