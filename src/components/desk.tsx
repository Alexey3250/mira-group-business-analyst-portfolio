import type { ReactNode } from "react";

export function DeskTitle({ title, sub, right }: { title: string; sub: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-ink">{title}</h1>
        <p className="mt-0.5 text-[13px] text-sub">{sub}</p>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function KpiRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 border-b border-line px-5 py-4 sm:px-7 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}

const toneClass: Record<string, string> = {
  pos: "text-pos",
  neg: "text-neg",
  warn: "text-warn",
  neutral: "text-sub",
};

const sparkColor: Record<string, string> = {
  pos: "#1d9e75",
  neg: "#d85a30",
  warn: "#ef9f27",
  neutral: "#9a978f",
};

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60;
  const h = 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / range) * (h - 4)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Kpi({
  label,
  value,
  sub,
  tone = "neutral",
  valueTone,
  spark,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "pos" | "neg" | "warn" | "neutral";
  valueTone?: "pos" | "neg";
  spark?: number[];
}) {
  const valueClass =
    valueTone === "pos" ? "kpi-val text-pos" : valueTone === "neg" ? "kpi-val text-neg" : "kpi-val";

  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className={valueClass}>{value}</div>
          <div className={`kpi-sub ${toneClass[tone]}`}>{sub}</div>
        </div>
        {spark && <Sparkline data={spark} color={sparkColor[tone]} />}
      </div>
    </div>
  );
}

export function Funnel({
  stages,
  showPct = false,
}: {
  stages: { stage: string; count: number; pct: number; color: string }[];
  showPct?: boolean;
}) {
  return (
    <div className="space-y-1">
      {stages.map((s) => (
        <div key={s.stage}>
          <div
            className="mx-auto flex items-center justify-between rounded-[4px] px-3 py-2"
            style={{ width: `${Math.max(s.pct, 32)}%`, background: s.color }}
          >
            <span className="truncate text-2xs font-medium text-white">{s.stage}</span>
            <span className="num pl-2 text-2xs font-semibold text-white">{s.count}</span>
          </div>
          {showPct && <div className="mt-0.5 text-center text-2xs text-faint">{s.pct}%</div>}
        </div>
      ))}
    </div>
  );
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className ? `sec-label mb-3 ${className}` : "sec-label mb-3"}>{children}</div>;
}

export function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-[5px] w-full overflow-hidden rounded-full bg-panel">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
