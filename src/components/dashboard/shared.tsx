"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

export const chartColors = {
  sold: "#2563eb",
  reserved: "#d97706",
  available: "#64748b",
  revenue: "#0f766e",
  direct: "#be123c",
  coverage: "#4f46e5",
  grid: "#e2e8f0",
};

export const tooltipStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  color: "#172033",
};

export function Panel({
  title,
  eyebrow,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-base font-semibold text-slate-950">{title}</h2>
        </div>
        <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

export function ChartFrame({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={`min-w-0 ${className}`}>
      {ready ? (
        children
      ) : (
        <div className="flex h-full animate-pulse items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500">
          Loading chart
        </div>
      )}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const classes: Record<string, string> = {
    Contract: "bg-blue-50 text-blue-700 ring-blue-200",
    Shipment: "bg-amber-50 text-amber-700 ring-amber-200",
    Delivery: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${classes[label]}`}>
      {label}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: string }) {
  const classes: Record<string, string> = {
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Watch: "bg-amber-50 text-amber-700 ring-amber-200",
    High: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${classes[risk]}`}>
      {risk}
    </span>
  );
}

export function formatAed(value: number) {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(value >= 10000000 ? 1 : 2)}M`;
  }

  return `AED ${Math.round(value / 1000)}K`;
}
