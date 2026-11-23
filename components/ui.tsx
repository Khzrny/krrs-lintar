import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

/* ————————————————— Button ————————————————— */

type Variant = "primary" | "gold" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantCls: Record<Variant, string> = {
  primary:
    "bg-primary-800 text-white hover:bg-primary-700 active:bg-primary-900 shadow-sm shadow-primary-900/20",
  gold: "bg-gold-500 text-primary-950 hover:bg-gold-400 active:bg-gold-600 shadow-sm shadow-gold-600/30",
  outline:
    "border border-(--border) bg-transparent text-foreground hover:bg-(--surface-2)",
  ghost: "bg-transparent text-foreground hover:bg-(--surface-2)",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
};

const sizeCls: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-lg font-semibold transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500",
        "disabled:pointer-events-none disabled:opacity-50",
        variantCls[variant],
        sizeCls[size],
        className
      )}
      {...props}
    />
  );
}

/* ————————————————— Card ————————————————— */

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-surface rounded-xl shadow-sm shadow-primary-950/5",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  desc,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  desc?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-(--border) px-5 py-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/60 dark:text-gold-300">
            {icon}
          </span>
        ) : null}
        <div>
          <h2 className="text-base leading-tight font-bold text-foreground">
            {title}
          </h2>
          {desc ? <p className="mt-0.5 text-xs text-muted">{desc}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ————————————————— Badge ————————————————— */

type BadgeTone = "primary" | "gold" | "green" | "red" | "gray" | "amber" | "blue";

const badgeCls: Record<BadgeTone, string> = {
  primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/70 dark:text-primary-200",
  gold: "bg-gold-100 text-gold-800 dark:bg-gold-900/50 dark:text-gold-200",
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  red: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  blue: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
  gray: "bg-(--surface-2) text-muted",
};

export function Badge({
  tone = "primary",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        badgeCls[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ————————————————— Form ————————————————— */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-(--border) bg-(--surface) px-3 text-sm text-foreground",
        "placeholder:text-muted/70 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 focus:outline-none",
        "transition disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full cursor-pointer rounded-lg border border-(--border) bg-(--surface) px-3 text-sm text-foreground",
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

/* ————————————————— Lain-lain ————————————————— */

export function ProgressBar({
  value,
  max,
  tone = "primary",
}: {
  value: number;
  max: number;
  tone?: "primary" | "gold" | "red";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const barCls =
    tone === "red"
      ? "bg-red-500"
      : tone === "gold"
        ? "bg-gold-500"
        : "bg-primary-600 dark:bg-primary-400";
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-(--surface-2)"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", barCls)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "primary",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  tone?: "primary" | "gold" | "green";
}) {
  const iconCls =
    tone === "gold"
      ? "bg-gold-100 text-gold-700 dark:bg-gold-900/50 dark:text-gold-300"
      : tone === "green"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
        : "bg-primary-100 text-primary-700 dark:bg-primary-900/70 dark:text-primary-200";
  return (
    <Card className="flex items-center gap-4 p-4">
      {icon ? (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            iconCls
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          {label}
        </p>
        <p className="truncate text-xl font-extrabold text-foreground">{value}</p>
        {sub ? <p className="truncate text-xs text-muted">{sub}</p> : null}
      </div>
    </Card>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "success" | "danger";
  title?: ReactNode;
  children?: ReactNode;
}) {
  const cls = {
    info: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100",
    warning:
      "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
    success:
      "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
    danger:
      "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100",
  }[tone];
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm", cls)}>
      {title ? <p className="font-bold">{title}</p> : null}
      {children}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {icon ? (
        <span className="mb-1 flex size-14 items-center justify-center rounded-2xl bg-(--surface-2) text-muted">
          {icon}
        </span>
      ) : null}
      <p className="font-bold text-foreground">{title}</p>
      {desc ? <p className="max-w-sm text-sm text-muted">{desc}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

/* ————————————————— Ikon (inline SVG, tanpa dependency) ————————————————— */

type IconProps = { className?: string };
const base = "size-5";

export const IconBook = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
export const IconCalendar = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
export const IconCheck = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
export const IconCheckCircle = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
export const IconLock = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
export const IconPrinter = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);
export const IconUser = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
export const IconUsers = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const IconClock = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
export const IconAlert = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
export const IconHelp = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
export const IconGrid = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
export const IconChart = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
export const IconSun = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
export const IconMoon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
export const IconGraduation = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
    <path d="M22 10v6" />
  </svg>
);
export const IconArrowRight = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
export const IconLogout = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
export const IconShield = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
export const IconFile = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
