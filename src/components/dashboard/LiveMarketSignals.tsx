"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, RefreshCw, ShieldAlert, Signal, TrendingUp } from "lucide-react";

type LiveMarketPayload = {
  generatedAt: string;
  status: "live" | "partial";
  fx: Array<{
    pair: string;
    rate: number;
    date: string;
    source: string;
  }>;
  commodities: Array<{
    symbol: string;
    label: string;
    open: number;
    high: number;
    low: number;
    price: number;
    changePct: number;
    unit: string;
    date: string;
    time: string;
    source: string;
  }>;
  riskSignals: Array<{
    desk: string;
    level: "Low" | "Watch" | "High";
    headline: string;
    impact: string;
    evidence: string;
  }>;
  sources: Array<{ label: string; url: string }>;
  errors: string[];
};

export default function LiveMarketSignals() {
  const [data, setData] = useState<LiveMarketPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadLiveData() {
      try {
        const response = await fetch("/api/live-market", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Live market route returned ${response.status}`);
        }

        const payload = (await response.json()) as LiveMarketPayload;
        if (active) {
          setData(payload);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Live data unavailable");
          setLoading(false);
        }
      }
    }

    void loadLiveData();
    const interval = window.setInterval(loadLiveData, 300000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const updatedLabel = useMemo(() => {
    if (!data?.generatedAt) return "Waiting for first refresh";
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(new Date(data.generatedAt));
  }, [data?.generatedAt]);

  return (
    <section className="rounded-lg bg-slate-950 p-4 text-white shadow-panel ring-1 ring-slate-800">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-emerald-200 ring-1 ring-emerald-400/20">
              <Signal className="h-3.5 w-3.5" aria-hidden="true" />
              Live market signals
            </span>
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-slate-200 ring-1 ring-white/10">
              Server cached for 5 min
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold">Trade risk signals from FX and commodity feeds</h2>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
            Pulls no-key public data through a Next.js route handler, then turns raw market values into business-facing watch points for trading, finance, and CRM/SAP controls.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          {updatedLabel}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-100 ring-1 ring-rose-400/20">
          {error}
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[1fr_1.2fr_1.1fr]">
        <LivePanel title="FX exposure" icon={<TrendingUp className="h-4 w-4" aria-hidden="true" />}>
          {loading && !data ? (
            <LoadingRows count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {data?.fx.map((rate) => (
                <div key={rate.pair} className="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
                  <p className="text-xs text-slate-400">{rate.pair}</p>
                  <p className="mt-1 text-xl font-semibold">{formatRate(rate.rate)}</p>
                  <p className="mt-1 text-xs text-slate-400">{rate.date}</p>
                </div>
              ))}
            </div>
          )}
        </LivePanel>

        <LivePanel title="Commodity proxies" icon={<Signal className="h-4 w-4" aria-hidden="true" />}>
          {loading && !data ? (
            <LoadingRows count={6} />
          ) : (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {data?.commodities.map((quote) => (
                <div key={quote.symbol} className="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-slate-400">{quote.label}</p>
                    <ChangeBadge value={quote.changePct} />
                  </div>
                  <p className="mt-1 text-lg font-semibold">{formatRate(quote.price)}</p>
                  <p className="mt-1 text-xs text-slate-400">{quote.unit}</p>
                </div>
              ))}
            </div>
          )}
        </LivePanel>

        <LivePanel title="Trade risk watchlist" icon={<ShieldAlert className="h-4 w-4" aria-hidden="true" />}>
          {loading && !data ? (
            <LoadingRows count={4} />
          ) : data?.riskSignals?.length ? (
            <div className="space-y-2">
              {data.riskSignals.map((signal) => (
                <div key={signal.desk} className="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-normal text-slate-400">{signal.desk}</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-white">{signal.headline}</p>
                    </div>
                    <RiskBadge level={signal.level} />
                  </div>
                  <p className="text-xs leading-5 text-slate-300">{signal.impact}</p>
                  <p className="mt-2 text-xs text-slate-400">{signal.evidence}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-300">Risk signal calculation unavailable.</p>
          )}
        </LivePanel>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        {data?.sources.map((source) => (
          <span key={source.label} className="rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
            {source.label}
          </span>
        ))}
        {data?.errors.map((item) => (
          <span key={item} className="rounded-md bg-amber-400/10 px-2 py-1 text-amber-100 ring-1 ring-amber-400/20">
            Partial: {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function LivePanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg bg-slate-900 p-4 ring-1 ring-white/10">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100">
        {icon}
        {title}
      </div>
      {children}
    </article>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
        positive ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"
      }`}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function RiskBadge({ level }: { level: "Low" | "Watch" | "High" }) {
  const classes = {
    Low: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/20",
    Watch: "bg-amber-400/10 text-amber-100 ring-amber-400/20",
    High: "bg-rose-400/10 text-rose-100 ring-rose-400/20",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 ${classes[level]}`}>
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
      {level}
    </span>
  );
}

function LoadingRows({ count }: { count: number }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-lg bg-white/10" />
      ))}
    </div>
  );
}

function formatRate(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value > 100 ? 2 : 4,
  }).format(value);
}
