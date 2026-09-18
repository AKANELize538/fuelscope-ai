import type { ReactNode } from "react";
import type { Level } from "@/lib/study/types";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold tracking-wide text-zinc-400">{children}</h2>
      {action}
    </div>
  );
}

const LEVEL_STYLE: Record<Level, { label: string; cls: string }> = {
  basic: { label: "기초", cls: "bg-sky-500/15 text-sky-300 ring-sky-500/30" },
  advanced: { label: "심화", cls: "bg-amber-500/15 text-amber-300 ring-amber-500/30" },
  applied: { label: "응용", cls: "bg-rose-500/15 text-rose-300 ring-rose-500/30" },
};

export function LevelBadge({ level }: { level: Level }) {
  const s = LEVEL_STYLE[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 1,
  tone = "emerald",
}: {
  value: number;
  max?: number;
  tone?: "emerald" | "amber" | "rose" | "sky";
}) {
  const pct = max === 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const bar = {
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    sky: "bg-sky-400",
  }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
      <div className={`h-full rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-800" />
      <div className="h-28 animate-pulse rounded-2xl bg-zinc-900" />
      <div className="h-28 animate-pulse rounded-2xl bg-zinc-900" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="text-center">
      <p className="text-base font-semibold text-zinc-200">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
