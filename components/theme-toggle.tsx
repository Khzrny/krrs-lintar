"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@/components/ui";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !(dark ?? false);
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* abaikan bila storage diblokir */
    }
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
      {dark === null ? (
        <span className="size-5" />
      ) : dark ? (
        <IconSun className="size-5" />
      ) : (
        <IconMoon className="size-5" />
      )}
    </button>
  );
}
