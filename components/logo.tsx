import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo resmi Universitas Tarumanagara (public/logo-untar.png, transparan).
 * className mengatur ukuran kotaknya; gambar memenuhi isi dengan sedikit padding.
 */
export function LogoUntar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden",
        className
      )}
    >
      <Image
        src="/logo-untar.png"
        alt="Logo Universitas Tarumanagara"
        fill
        sizes="(max-width: 640px) 48px, 96px"
        priority
        className="object-contain p-[10%]"
      />
    </span>
  );
}

export function BrandMark({
  size = "md",
  withText = true,
}: {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}) {
  const box =
    size === "sm" ? "size-9" : size === "lg" ? "size-14" : "size-11";
  const title =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative flex items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-primary-700 via-primary-800 to-primary-950 shadow-inner ring-1 ring-gold-500/40">
        <LogoUntar className={cn(box, "absolute inset-0")} />
        <span className={cn("pointer-events-none", box)} />
      </span>
      {withText ? (
        <span className="leading-tight">
          <span className={cn("block font-extrabold tracking-tight text-foreground", title)}>
            Lintar <span className="text-gold-600 dark:text-gold-400">KRRS</span>
          </span>
          <span className="block text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
            Universitas Tarumanagara
          </span>
        </span>
      ) : null}
    </span>
  );
}
