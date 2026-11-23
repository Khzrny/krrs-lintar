import { cn } from "@/lib/utils";

/**
 * Lambang stylized UNTAR untuk Lintar KRRS
 * (perisai + pilar + bintang, nuansa navy-emas).
 */
export function LogoUntar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl",
        "bg-linear-to-br from-navy-700 via-navy-800 to-navy-950",
        "shadow-inner ring-1 ring-gold-500/40",
        className
      )}
    >
      <svg
        viewBox="0 0 48 48"
        className="size-[70%] text-gold-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* perisai */}
        <path d="M24 5 8 10v12c0 10 7 17.5 16 21 9-3.5 16-11 16-21V10L24 5z" />
        {/* pilar */}
        <line x1="17" y1="18" x2="17" y2="32" />
        <line x1="24" y1="18" x2="24" y2="32" />
        <line x1="31" y1="18" x2="31" y2="32" />
        <line x1="14" y1="34" x2="34" y2="34" />
        {/* bintang */}
        <path d="m24 11 1.2 2.6 2.8.3-2.1 1.9.6 2.8L24 17.2l-2.5 1.4.6-2.8-2.1-1.9 2.8-.3L24 11z" />
      </svg>
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
    size === "sm" ? "size-8" : size === "lg" ? "size-14" : "size-11";
  const title =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  return (
    <span className="flex items-center gap-2.5">
      <LogoUntar className={box} />
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
