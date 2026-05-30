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
  price: number;
  unit: string;
  date: string;
  time: string;
  source: "Stooq";
};

type LogisticsWeather = {
  location: string;
  temperatureC: number;
  windKph: number;
  gustKph: number;
  precipitationMm: number;
  time: string;
  source: "Open-Meteo";
};

type LiveMarketPayload = {
  generatedAt: string;
  status: "live" | "partial";
  fx: FxRate[];
  commodities: CommodityQuote[];
  weather: LogisticsWeather | null;
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
  const [fxResult, commodityResult, weatherResult] = await Promise.allSettled([
    getFxRates(),
    getCommodityQuotes(),
    getLogisticsWeather(),
  ]);

  const errors: string[] = [];
  const fx = unwrapResult(fxResult, "FX rates", errors) ?? [];
  const commodities = unwrapResult(commodityResult, "commodity quotes", errors) ?? [];
  const weather = unwrapResult(weatherResult, "logistics weather", errors) ?? null;

  const payload: LiveMarketPayload = {
    generatedAt: new Date().toISOString(),
    status: errors.length === 0 ? "live" : "partial",
    fx,
    commodities,
    weather,
    sources: [
      { label: "Frankfurter FX API", url: "https://frankfurter.dev/" },
      { label: "Stooq public CSV quotes", url: "https://stooq.com/" },
      { label: "Open-Meteo weather API", url: "https://open-meteo.com/" },
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
      const close = Number(row.Close);

      if (!Number.isFinite(close)) {
        throw new Error(`Stooq ${item.symbol} did not return a numeric close`);
      }

      return {
        symbol: row.Symbol || item.symbol.toUpperCase(),
        label: item.label,
        price: close,
        unit: item.unit,
        date: row.Date,
        time: row.Time,
        source: "Stooq" as const,
      };
    })
  );

  return quotes;
}

async function getLogisticsWeather(): Promise<LogisticsWeather> {
  const query = new URLSearchParams({
    latitude: "25.0118",
    longitude: "55.0610",
    current: "temperature_2m,wind_speed_10m,wind_gusts_10m,precipitation",
    timezone: "Asia/Dubai",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo returned ${response.status}`);
  }

  const data = (await response.json()) as {
    current: {
      time: string;
      temperature_2m: number;
      wind_speed_10m: number;
      wind_gusts_10m: number;
      precipitation: number;
    };
  };

  return {
    location: "Jebel Ali / Dubai logistics corridor",
    temperatureC: data.current.temperature_2m,
    windKph: data.current.wind_speed_10m,
    gustKph: data.current.wind_gusts_10m,
    precipitationMm: data.current.precipitation,
    time: data.current.time,
    source: "Open-Meteo",
  };
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
