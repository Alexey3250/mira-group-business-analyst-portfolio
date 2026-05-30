"use client";

import { useCallback, useEffect, useState } from "react";
import { Database, Play, Ship, TrendingUp } from "lucide-react";
import { useI18n } from "@/i18n";

type TradeRequest = {
  product: "wheat" | "corn" | "urea" | "copper";
  quantityMt: number;
  sellPricePerMt: number;
  sellCurrency: "USD" | "EUR";
  counterparty: string;
  destinationPort: "jebel-ali" | "rotterdam" | "santos";
};

type ProcessTradeResponse = {
  market: { label: string; usdPerMt: number; source: string; observedAt: string };
  fx: { base: string; toUsd: number; toAed: number; observedAt?: string };
  sourcing: Array<{ market: string; marketName: string; stageName: string; priceOriginal: number; currency: "USD" | "EUR"; period: string }>;
  logistics: { port: string; windKph: number; gustKph: number; precipitationMm: number; risk: "Clear" | "Watch" | "High"; reason: string };
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
  quantityMt: 25000,
  sellPricePerMt: 245,
  sellCurrency: "USD",
  counterparty: "GCC Flour Mills",
  destinationPort: "jebel-ali",
};

const productPriceDefaults: Record<TradeRequest["product"], number> = {
  wheat: 245,
  corn: 218,
  urea: 560,
  copper: 9800,
};

export default function TradeWorkbench() {
  const { t, tr, locale } = useI18n();
  const [trade, setTrade] = useState<TradeRequest>(defaultTrade);
  const [data, setData] = useState<ProcessTradeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runProcessing = useCallback(async (requestBody: TradeRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/process-trade", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      setData((await response.json()) as ProcessTradeResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.workbench.failed);
    } finally {
      setLoading(false);
    }
  }, [t.workbench.failed]);

  useEffect(() => {
    void runProcessing(defaultTrade);
  }, [runProcessing]);

  const cheapestSource = data?.sourcing[0];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="pill-info">{t.workbench.flow}</span>
        <button
          onClick={() => void runProcessing(trade)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-[13px] font-medium text-white transition hover:bg-ink/90 disabled:opacity-50"
        >
          <Play className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
          {loading ? t.workbench.running : t.workbench.run}
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <article className="panel p-4">
          <div className="mb-3.5 flex items-center gap-2 text-[13px] font-medium text-ink">
            <TrendingUp className="h-4 w-4 text-c-green" strokeWidth={1.75} />
            {t.workbench.inputTitle}
          </div>
          <div className="grid gap-3">
            <SelectField
              label={t.workbench.product}
              value={trade.product}
              options={[
                { value: "wheat", label: tr("Milling Wheat (12.5% Protein)") },
                { value: "corn", label: tr("Feed Corn") },
                { value: "urea", label: tr("Granular Urea") },
                { value: "copper", label: tr("Copper Cathodes") },
              ]}
              onChange={(product) => {
                const nextProduct = product as TradeRequest["product"];
                setTrade((current) => ({ ...current, product: nextProduct, sellPricePerMt: productPriceDefaults[nextProduct] }));
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              <NumField label={t.workbench.quantity} value={trade.quantityMt} onChange={(quantityMt) => setTrade((current) => ({ ...current, quantityMt }))} />
              <NumField label={t.workbench.sellPrice} value={trade.sellPricePerMt} onChange={(sellPricePerMt) => setTrade((current) => ({ ...current, sellPricePerMt }))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SelectField
                label={t.workbench.currency}
                value={trade.sellCurrency}
                options={[{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }]}
                onChange={(sellCurrency) => setTrade((current) => ({ ...current, sellCurrency: sellCurrency as "USD" | "EUR" }))}
              />
              <SelectField
                label={t.workbench.port}
                value={trade.destinationPort}
                options={[
                  { value: "jebel-ali", label: tr("Jebel Ali, UAE") },
                  { value: "rotterdam", label: tr("Rotterdam, NL") },
                  { value: "santos", label: tr("Santos, BR") },
                ]}
                onChange={(destinationPort) => setTrade((current) => ({ ...current, destinationPort: destinationPort as TradeRequest["destinationPort"] }))}
              />
            </div>
          </div>
        </article>

        <article className="panel p-4">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
              <Database className="h-4 w-4 text-c-blue" strokeWidth={1.75} />
              {t.workbench.marginTitle}
            </div>
            {data && <RiskPill level={data.margin.riskLevel} />}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Metric label={t.workbench.benchmark} value={data ? `$${data.margin.benchmarkUsdPerMt.toFixed(0)}/MT` : "-"} />
            <Metric label={t.workbench.sellPriceLabel} value={data ? `$${data.margin.sellPriceUsdPerMt.toFixed(0)}/MT` : "-"} />
            <Metric label={t.workbench.landedMargin} value={data ? `${data.margin.landedMarginPct.toFixed(2)}%` : "-"} highlight={data ? data.margin.landedMarginPct > 5 : false} />
            <Metric label={t.workbench.freight} value={data ? `$${data.margin.estimatedFreightUsdPerMt.toFixed(0)}/MT` : "-"} />
          </div>
          <div className="mt-3 rounded-md bg-panel p-3">
            <p className="field-label">{t.workbench.cheapestSource}</p>
            <p className="mt-1 text-[13px] font-medium text-ink">
              {cheapestSource ? `${tr(cheapestSource.market)} - $${cheapestSource.priceOriginal.toFixed(0)}/MT` : t.workbench.noSource}
            </p>
            {cheapestSource && <p className="mt-0.5 text-2xs text-sub">{tr(cheapestSource.marketName)} / {cheapestSource.period}</p>}
          </div>
        </article>

        <article className="panel p-4">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
              <Ship className="h-4 w-4 text-c-amber" strokeWidth={1.75} />
              {t.workbench.logisticsTitle}
            </div>
            {data && <RiskPill level={data.logistics.risk} />}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric label={t.workbench.wind} value={data ? `${data.logistics.windKph.toFixed(0)}` : "-"} unit="km/h" />
            <Metric label={t.workbench.gusts} value={data ? `${data.logistics.gustKph.toFixed(0)}` : "-"} unit="km/h" />
            <Metric label={t.workbench.rain} value={data ? `${data.logistics.precipitationMm.toFixed(1)}` : "-"} unit="mm" />
          </div>
          <div className="mt-3">
            <p className="field-label mb-1.5">{t.workbench.sapPayload}</p>
            <pre className="num max-h-28 overflow-auto rounded-md bg-ink p-2.5 text-2xs leading-relaxed text-[#7ee0a8] mini-scrollbar">
              {data ? JSON.stringify(data.sapPayload, null, 2) : "{ ... }"}
            </pre>
          </div>
        </article>
      </div>

      <div className="mt-3 rounded-lg bg-ink p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-2xs font-semibold uppercase tracking-wider text-white/50">{t.workbench.processingLog}</p>
          {error && <span className="text-2xs text-[#f1a08a]">{tr(error)}</span>}
        </div>
        <pre className="num max-h-44 overflow-auto whitespace-pre-wrap text-2xs leading-5 text-white/70 mini-scrollbar">
          {data?.processingLog.map((line) => localizeLogLine(line, tr, locale)).join("\n") ?? t.workbench.waiting}
        </pre>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="field">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="field-label">{label}</span>
      <input type="number" value={value} min={0} onChange={(event) => onChange(Number(event.target.value))} className="field num min-w-0" />
    </label>
  );
}

function Metric({ label, value, unit, highlight }: { label: string; value: string; unit?: string; highlight?: boolean }) {
  return (
    <div className="rounded-md bg-panel p-2.5">
      <p className="text-2xs uppercase tracking-wider text-sub">{label}</p>
      <p className={`num mt-0.5 text-[13px] font-medium ${highlight ? "text-pos" : "text-ink"}`}>
        {value}
        {unit && <span className="ml-0.5 text-2xs font-normal text-faint">{unit}</span>}
      </p>
    </div>
  );
}

function RiskPill({ level }: { level: "Clear" | "Watch" | "High" }) {
  const { tr } = useI18n();
  const cls = { Clear: "pill-pos", Watch: "pill-warn", High: "pill-neg" };
  return <span className={cls[level]}>{tr(level)}</span>;
}

function localizeLogLine(line: string, tr: (value: string) => string, locale: "en" | "ru") {
  if (locale !== "ru") return line;

  return line
    .replace("Received CRM deal", "CRM-сделка получена")
    .replace("for", "на")
    .replace("Fetching live", "Получение live")
    .replace("benchmark from", "бенчмарка из")
    .replace("Fetching USD/USD and USD/AED FX via Frankfurter", "Получение USD/USD и USD/AED FX через Frankfurter")
    .replace("Querying EU Agri-food regional prices", "Запрос региональных цен EU Agri-food")
    .replace("is cheapest at", "лучшая цена")
    .replace("Checking Jebel Ali, Dubai weather via Open-Meteo", "Проверка погоды Jebel Ali, Dubai через Open-Meteo")
    .replace("gusts", "порывы")
    .replace("rain", "осадки")
    .replace("Transforming CRM payload to SAP ERP JSON structure", "Трансформация пакета CRM в структуру SAP ERP JSON")
    .replace("SUCCESS", "УСПЕХ")
    .replace("risk deal pushed to simulated ERP payload", "риск-сделка отправлена в симулированный ERP-пакет")
    .replace("Milling wheat", tr("Milling Wheat (12.5% Protein)"))
    .replace("Wheat futures", tr("Wheat futures"))
    .replace("Romania", "Румыния");
}
