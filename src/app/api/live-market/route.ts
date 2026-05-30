import { NextResponse } from "next/server";

export const revalidate = 300;

type FxRate = {
  pair: string;
  rate: number;
  date: string;
  source: "Frankfurter";
};

type CommodityQuote = {
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
  source: "Stooq";
};

type TradeRiskSignal = {
  desk: string;
  level: "Low" | "Watch" | "High";
  headline: string;
  impact: string;
  evidence: string;
};

type LiveMarketPayload = {
  generatedAt: string;
  status: "live" | "partial";
  fx: FxRate[];
  commodities: CommodityQuote[];
  riskSignals: TradeRiskSignal[];
  sources: Array<{ label: string; url: string }>;
  errors: string[];
};

const stooqSymbols = [
  { symbol: "xauusd", label: "Gold spot", unit: "USD/oz" },
  { symbol: "xagusd", label: "Silver spot", unit: "USD/oz" },
  { symbol: "hg.f", label: "Copper futures", unit: "US cents/lb" },
  { symbol: "zw.f", label: "Wheat futures", unit: "US cents/bu" },
  { symbol: "zc.f", label: "Corn futures", unit: "US cents/bu" },
  { symbol: "cl.f", label: "WTI crude futures", unit: "USD/bbl" },
] as const;

export async function GET() {
  const [fxResult, commodityResult] = await Promise.allSettled([
    getFxRates(),
    getCommodityQuotes(),
  ]);

  const errors: string[] = [];
  const fx = unwrapResult(fxResult, "FX rates", errors) ?? [];
  const commodities = unwrapResult(commodityResult, "commodity quotes", errors) ?? [];

  const payload: LiveMarketPayload = {
    generatedAt: new Date().toISOString(),
    status: errors.length === 0 ? "live" : "partial",
    fx,
    commodities,
    riskSignals: buildRiskSignals(fx, commodities),
    sources: [
      { label: "Frankfurter FX API", url: "https://frankfurter.dev/" },
      { label: "Stooq public CSV quotes", url: "https://stooq.com/" },
    ],
    errors,
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=1800",
    },
  });
}

async function getFxRates(): Promise<FxRate[]> {
  const response = await fetch(
    "https://api.frankfurter.dev/v2/rates?base=USD&quotes=AED,RUB,KZT,EUR",
    { next: { revalidate: 300 } }
  );

  if (!response.ok) {
    throw new Error(`Frankfurter returned ${response.status}`);
  }

  const rows = (await response.json()) as Array<{
    date: string;
    base: string;
    quote: string;
    rate: number;
  }>;

  return rows.map((row) => ({
    pair: `${row.base}/${row.quote}`,
    rate: row.rate,
    date: row.date,
    source: "Frankfurter",
  }));
}

async function getCommodityQuotes(): Promise<CommodityQuote[]> {
  const quotes = await Promise.all(
    stooqSymbols.map(async (item) => {
      const query = new URLSearchParams({
        s: item.symbol,
        f: "sd2t2ohlcv",
        h: "",
        e: "csv",
      });
      const response = await fetch(`https://stooq.com/q/l/?${query.toString()}`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`Stooq ${item.symbol} returned ${response.status}`);
      }

      const csv = await response.text();
      const row = parseStooqCsv(csv);
      const open = Number(row.Open);
      const high = Number(row.High);
      const low = Number(row.Low);
      const close = Number(row.Close);

      if (!Number.isFinite(close) || !Number.isFinite(open)) {
        throw new Error(`Stooq ${item.symbol} did not return a numeric close`);
      }

      return {
        symbol: row.Symbol || item.symbol.toUpperCase(),
        label: item.label,
        open,
        high,
        low,
        price: close,
        changePct: ((close - open) / open) * 100,
        unit: item.unit,
        date: row.Date,
        time: row.Time,
        source: "Stooq" as const,
      };
    })
  );

  return quotes;
}

function parseStooqCsv(csv: string) {
  const [headerLine, rowLine] = csv.trim().split(/\r?\n/);
  if (!headerLine || !rowLine) {
    throw new Error("Stooq returned an empty CSV response");
  }

  const headers = headerLine.split(",");
  const values = rowLine.split(",");
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as Record<string, string>;
}

function unwrapResult<T>(
  result: PromiseSettledResult<T>,
  label: string,
  errors: string[]
) {
  if (result.status === "fulfilled") return result.value;

  errors.push(`${label}: ${result.reason instanceof Error ? result.reason.message : "unknown error"}`);
  return null;
}

function buildRiskSignals(fx: FxRate[], commodities: CommodityQuote[]): TradeRiskSignal[] {
  const byLabel = new Map(commodities.map((quote) => [quote.label, quote]));
  const byPair = new Map(fx.map((rate) => [rate.pair, rate]));
  const copper = byLabel.get("Copper futures");
  const wheat = byLabel.get("Wheat futures");
  const corn = byLabel.get("Corn futures");
  const crude = byLabel.get("WTI crude futures");
  const rub = byPair.get("USD/RUB");
  const kzt = byPair.get("USD/KZT");

  const grainMove = averageDefined([wheat?.changePct, corn?.changePct]);
  const metalMove = Math.abs(copper?.changePct ?? 0);
  const crudeMove = Math.abs(crude?.changePct ?? 0);

  return [
    {
      desk: "Metals desk",
      level: levelFromAbsMove(metalMove, 1.2, 2.5),
      headline: "Copper movement can pressure open metal exposure",
      impact: "Check counterparty limits before increasing aluminum/copper-linked positions.",
      evidence: copper
        ? `Copper ${formatSigned(copper.changePct)} intraday, close ${formatNumber(copper.price)} ${copper.unit}.`
        : "Copper quote unavailable.",
    },
    {
      desk: "Grains desk",
      level: levelFromAbsMove(Math.abs(grainMove), 1.0, 2.0),
      headline: "Wheat and corn movement affects grain margin assumptions",
      impact: "Review offer validity, purchase timing, and buyer pass-through terms.",
      evidence:
        wheat && corn
          ? `Wheat ${formatSigned(wheat.changePct)}, corn ${formatSigned(corn.changePct)}.`
          : "One or more grain quotes unavailable.",
    },
    {
      desk: "Trading operations",
      level: levelFromAbsMove(crudeMove, 1.5, 3.0),
      headline: "Oil movement can shift freight and delivery-cost assumptions",
      impact: "Flag trades where logistics costs are still estimated rather than contracted.",
      evidence: crude
        ? `WTI crude ${formatSigned(crude.changePct)}, close ${formatNumber(crude.price)} ${crude.unit}.`
        : "Crude quote unavailable.",
    },
    {
      desk: "CIS settlements",
      level: settlementLevel(rub?.rate, kzt?.rate),
      headline: "RUB/KZT settlement exposure should be watched for CIS-heavy flows",
      impact: "Prioritize CRM/SAP currency checks on CIS investor receipts and open trade invoices.",
      evidence:
        rub && kzt
          ? `USD/RUB ${formatNumber(rub.rate)}, USD/KZT ${formatNumber(kzt.rate)} from Frankfurter.`
          : "CIS FX rates unavailable.",
    },
  ];
}

function averageDefined(values: Array<number | undefined>) {
  const defined = values.filter((value): value is number => typeof value === "number");
  if (defined.length === 0) return 0;
  return defined.reduce((sum, value) => sum + value, 0) / defined.length;
}

function levelFromAbsMove(value: number, watchAt: number, highAt: number): TradeRiskSignal["level"] {
  if (value >= highAt) return "High";
  if (value >= watchAt) return "Watch";
  return "Low";
}

function settlementLevel(rub?: number, kzt?: number): TradeRiskSignal["level"] {
  if (!rub || !kzt) return "Watch";
  if (rub > 75 || kzt > 500) return "High";
  if (rub > 70 || kzt > 480) return "Watch";
  return "Low";
}

function formatSigned(value: number) {
  const formatted = `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  return formatted;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value > 100 ? 2 : 4,
  }).format(value);
}
