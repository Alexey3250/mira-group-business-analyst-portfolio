"use client";

import { useCallback, useEffect, useState } from "react";
import { DatabaseZap, Play, Route, Ship, TrendingUp } from "lucide-react";

type TradeRequest = {
  product: "wheat" | "corn" | "urea" | "copper";
  quantityMt: number;
  sellPricePerMt: number;
  sellCurrency: "USD" | "EUR";
  counterparty: string;
  destinationPort: "jebel-ali" | "rotterdam" | "santos";
};

type ProcessTradeResponse = {
  generatedAt: string;
  crmPayload: Record<string, string | number>;
  market: {
    label: string;
    usdPerMt: number;
    source: string;
    observedAt: string;
  };
  fx: {
    base: string;
    toUsd: number;
    toAed: number;
    observedAt?: string;
  };
  sourcing: Array<{
    market: string;
    marketName: string;
    stageName: string;
    priceOriginal: number;
    currency: "USD" | "EUR";
    period: string;
  }>;
  logistics: {
    port: string;
    windKph: number;
    gustKph: number;
    precipitationMm: number;
    risk: "Clear" | "Watch" | "High";
    reason: string;
  };
  margin: {
    sellPriceUsdPerMt: number;
    benchmarkUsdPerMt: number;
    grossMarginUsdPerMt: number;
    estimatedFreightUsdPerMt: number;
    landedMarginUsdPerMt: number;
    landedMarginPct: number;
    riskLevel: "Clear" | "Watch" | "High";
  };
  sapPayload: Record<string, string | number>;
  processingLog: string[];
};

const defaultTrade: TradeRequest = {
  product: "wheat",
  quantityMt: 10000,
  sellPricePerMt: 230,
  sellCurrency: "USD",
  counterparty: "GCC Flour Mills",
  destinationPort: "jebel-ali",
};

const productPriceDefaults: Record<TradeRequest["product"], number> = {
  wheat: 230,
  corn: 218,
  urea: 560,
  copper: 9800,
};

export default function TradeAutomationWorkbench() {
  const [trade, setTrade] = useState<TradeRequest>(defaultTrade);
  const [data, setData] = useState<ProcessTradeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runProcessing = useCallback(async (requestBody = trade) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/process-trade", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`Process route returned ${response.status}`);
      setData((await response.json()) as ProcessTradeResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trade processing failed");
    } finally {
      setLoading(false);
    }
  }, [trade]);

  useEffect(() => {
    void runProcessing(defaultTrade);
  }, [runProcessing]);

  const cheapestSource = data?.sourcing[0];

  return (
    <section className="rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-white">
              <DatabaseZap className="h-3.5 w-3.5" aria-hidden="true" />
              Automated extraction and processing
            </span>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-emerald-700 ring-1 ring-emerald-200">
              CRM &gt; API proxy &gt; SAP payload
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            Deal margin analyzer and sourcing decision flow
          </h2>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
            One mock RFQ is enriched with commodity benchmarks, EU regional prices,
            FX conversion, and port weather before it becomes an ERP-ready JSON record.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void runProcessing()}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
        >
          <Play className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} aria-hidden="true" />
          {loading ? "Processing" : "Run process"}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.1fr_1.1fr]">
        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
            <TrendingUp className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Mock CRM deal
          </div>
          <div className="grid gap-3">
            <label className="grid gap-1 text-sm">
              <span className="text-xs font-semibold uppercase tracking-normal text-slate-500">Product</span>
              <select
                value={trade.product}
                onChange={(event) => {
                  const product = event.target.value as TradeRequest["product"];
                  setTrade((current) => ({
                    ...current,
                    product,
                    sellPricePerMt: productPriceDefaults[product],
                  }));
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950"
              >
                <option value="wheat">Milling wheat</option>
                <option value="corn">Feed corn</option>
                <option value="urea">Granular urea</option>
                <option value="copper">Copper cathodes</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <NumberField
                label="Quantity MT"
                value={trade.quantityMt}
                onChange={(quantityMt) => setTrade((current) => ({ ...current, quantityMt }))}
              />
              <NumberField
                label={`Sell / MT ${trade.sellCurrency}`}
                value={trade.sellPricePerMt}
                onChange={(sellPricePerMt) => setTrade((current) => ({ ...current, sellPricePerMt }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-normal text-slate-500">Currency</span>
                <select
                  value={trade.sellCurrency}
                  onChange={(event) => setTrade((current) => ({
                    ...current,
                    sellCurrency: event.target.value as TradeRequest["sellCurrency"],
                  }))}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-normal text-slate-500">Port</span>
                <select
                  value={trade.destinationPort}
                  onChange={(event) => setTrade((current) => ({
                    ...current,
                    destinationPort: event.target.value as TradeRequest["destinationPort"],
                  }))}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950"
                >
                  <option value="jebel-ali">Jebel Ali</option>
                  <option value="rotterdam">Rotterdam</option>
                  <option value="santos">Santos</option>
                </select>
              </label>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Route className="h-4 w-4 text-blue-700" aria-hidden="true" />
              Margin and sourcing
            </div>
            {data && <RiskPill level={data.margin.riskLevel} />}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="Live benchmark" value={data ? `${formatMoney(data.margin.benchmarkUsdPerMt, "USD")}/MT` : "..."} />
            <Metric label="Sell price" value={data ? `${formatMoney(data.margin.sellPriceUsdPerMt, "USD")}/MT` : "..."} />
            <Metric label="Landed margin" value={data ? `${data.margin.landedMarginPct.toFixed(2)}%` : "..."} />
            <Metric label="Freight estimate" value={data ? `${formatMoney(data.margin.estimatedFreightUsdPerMt, "USD")}/MT` : "..."} />
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
              Cheapest EU sourcing signal
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {cheapestSource ? `${cheapestSource.market} - ${formatMoney(cheapestSource.priceOriginal, cheapestSource.currency)}/MT` : "No comparable EU regional market"}
            </p>
            {cheapestSource && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {cheapestSource.marketName} / {cheapestSource.stageName} / {cheapestSource.period}
              </p>
            )}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Ship className="h-4 w-4 text-amber-700" aria-hidden="true" />
              Logistics and ERP payload
            </div>
            {data && <RiskPill level={data.logistics.risk} />}
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <Metric label="Wind" value={data ? `${data.logistics.windKph.toFixed(1)} km/h` : "..."} />
            <Metric label="Gusts" value={data ? `${data.logistics.gustKph.toFixed(1)} km/h` : "..."} />
            <Metric label="Rain" value={data ? `${data.logistics.precipitationMm.toFixed(1)} mm` : "..."} />
          </div>
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-emerald-100 mini-scrollbar">
            {data ? JSON.stringify(data.sapPayload, null, 2) : "Awaiting SAP payload..."}
          </pre>
        </article>
      </div>

      <div className="mt-4 rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100 ring-1 ring-slate-800">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-semibold uppercase tracking-normal text-slate-300">Data processing log</p>
          {error && <span className="text-rose-200">{error}</span>}
        </div>
        <pre className="max-h-44 overflow-auto whitespace-pre-wrap font-mono mini-scrollbar">
          {data?.processingLog.join("\n") ?? "Waiting for first run..."}
        </pre>
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950"
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function RiskPill({ level }: { level: "Clear" | "Watch" | "High" }) {
  const classes = {
    Clear: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Watch: "bg-amber-50 text-amber-700 ring-amber-200",
    High: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${classes[level]}`}>
      {level}
    </span>
  );
}

function formatMoney(value: number, currency: "USD" | "EUR") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
