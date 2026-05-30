"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  ShieldAlert,
  Signal,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "@/i18n";

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

export default function CommodityLiveSignals() {
  const { t, tr, locale } = useI18n();
  const [data, setData] = useState<LiveMarketPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadLiveData() {
      try {
        const response = await fetch("/api/live-market", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error(`Live market route returned ${response.status}`);
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
    if (!data?.generatedAt) return t.trading.live.waiting;
    return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data.generatedAt));
  }, [data?.generatedAt, locale, t.trading.live.waiting]);

  return (
    <section className="rounded-lg bg-ink p-4 text-white">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-[#7ee0a8]">
              <Signal className="h-3.5 w-3.5" aria-hidden="true" />
              {t.trading.live.badge}
            </span>
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-white/60">
              {t.trading.live.cache}
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold">{t.trading.live.title}</h2>
          <p className="mt-1 max-w-4xl text-[13px] leading-6 text-white/65">
            {t.trading.live.description}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-2xs text-white/70">
          <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} aria-hidden="true" />
          {updatedLabel}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-[#401e19] px-3 py-2 text-2xs text-[#f1a08a]">
          {tr(error)}
        </div>
      )}

      <div className="grid gap-3 xl:grid-cols-[0.82fr_1fr_1.05fr]">
        <LivePanel title={t.trading.live.fx} icon={<TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />}>
          {loading && !data ? (
            <LoadingRows count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {data?.fx.map((rate) => (
                <div key={rate.pair} className="rounded-md bg-white/10 p-3">
                  <p className="text-2xs text-white/45">{rate.pair}</p>
                  <p className="num mt-1 text-lg font-semibold">{formatRate(rate.rate)}</p>
                  <p className="mt-1 text-2xs text-white/45">{rate.date}</p>
                </div>
              ))}
            </div>
          )}
        </LivePanel>

        <LivePanel title={t.trading.live.proxies} icon={<Signal className="h-3.5 w-3.5" aria-hidden="true" />}>
          {loading && !data ? (
            <LoadingRows count={6} />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {data?.commodities.map((quote) => (
                <div key={quote.symbol} className="rounded-md bg-white/10 p-3">
                  <div className="mb-1.5 flex items-start justify-between gap-2">
                    <p className="text-2xs text-white/50">{tr(quote.label)}</p>
                    <ChangeBadge value={quote.changePct} />
                  </div>
                  <p className="num text-[15px] font-semibold">{formatRate(quote.price)}</p>
                  <p className="mt-1 text-2xs text-white/45">{tr(quote.unit)}</p>
                </div>
              ))}
            </div>
          )}
        </LivePanel>

        <LivePanel title={t.trading.live.watchlist} icon={<ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />}>
          {loading && !data ? (
            <LoadingRows count={4} />
          ) : data?.riskSignals.length ? (
            <div className="space-y-2">
              {data.riskSignals.map((signal) => (
                <div key={signal.desk} className="rounded-md bg-white/10 p-3">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-2xs font-semibold uppercase tracking-wider text-white/45">{tr(signal.desk)}</p>
                      <p className="mt-1 text-[13px] font-semibold leading-5 text-white">{tr(signal.headline)}</p>
                    </div>
                    <RiskBadge level={signal.level} />
                  </div>
                  <p className="text-2xs leading-5 text-white/60">{tr(signal.impact)}</p>
                  <p className="mt-2 text-2xs text-white/45">{formatEvidence(signal.evidence, tr, locale)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-2xs text-white/55">{t.trading.live.unavailable}</p>
          )}
        </LivePanel>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-2xs text-white/45">
        {data?.sources.map((source) => (
          <span key={source.label} className="rounded-md bg-white/10 px-2 py-1">
            {tr(source.label)}
          </span>
        ))}
        {data?.errors.map((item) => (
          <span key={item} className="rounded-md bg-[#403419] px-2 py-1 text-[#f0d38a]">
            {t.trading.live.partial}: {tr(item)}
          </span>
        ))}
      </div>
    </section>
  );
}

function LivePanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <article className="rounded-lg bg-white/[0.055] p-4 ring-1 ring-white/10">
      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-white/85">
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
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-2xs font-semibold ${positive ? "bg-[#183323] text-[#9de0b6]" : "bg-[#3c211d] text-[#f1a08a]"}`}>
      {positive ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function RiskBadge({ level }: { level: "Low" | "Watch" | "High" }) {
  const { tr } = useI18n();
  const classes = {
    Low: "bg-[#183323] text-[#9de0b6]",
    Watch: "bg-[#403419] text-[#f0d38a]",
    High: "bg-[#3c211d] text-[#f1a08a]",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-2xs font-semibold ${classes[level]}`}>
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      {tr(level)}
    </span>
  );
}

function LoadingRows({ count }: { count: number }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-md bg-white/10" />
      ))}
    </div>
  );
}

function formatEvidence(value: string, tr: (value: string) => string, locale: "en" | "ru") {
  if (locale !== "ru") return value;

  if (!value.includes("intraday") && !value.includes("Wheat") && !value.includes("WTI")) {
    return tr(value);
  }

  return value
    .replace("Natural gas", tr("Natural gas futures"))
    .replace("Copper", tr("Copper futures"))
    .replace("Wheat", tr("Wheat futures"))
    .replace("corn", tr("Corn futures").toLowerCase())
    .replace("soybean", tr("Soybean futures").toLowerCase())
    .replace("intraday, close", "внутри дня, закрытие")
    .replace("WTI", "WTI")
    .replace("USD/RUB", "USD/RUB")
    .replace("USD/KZT", "USD/KZT");
}

function formatRate(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value > 100 ? 2 : 4,
  }).format(value);
}
