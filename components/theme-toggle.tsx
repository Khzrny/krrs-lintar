"use client";

import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "@/components/ui";
import { cn } from "@/lib/utils";

/* Berlangganan perubahan class .dark pada <html> tanpa setState di effect. */
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}
function getServerSnapshot() {
  return false;
}
function emitChange() {
  listeners.forEach((l) => l());
}

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* abaikan bila storage diblokir */
    }
    emitChange();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={dark ? "Mode terang" : "Mode gelap"}
      aria-label="Ganti tema terang/gelap"
      className={cn(
        "flex size-10 cursor-pointer items-center justify-center rounded-lg border border-(--border)",
        "bg-(--surface) text-muted transition-colors hover:bg-(--surface-2) hover:text-foreground",
        className
      )}
    >
      {dark ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
    </button>
  );
}
