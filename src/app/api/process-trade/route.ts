import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductKey = "wheat" | "corn" | "urea" | "copper";
type CurrencyCode = "USD" | "EUR";
type PortKey = "jebel-ali" | "rotterdam" | "santos";
type RiskLevel = "Clear" | "Watch" | "High";

type ProcessTradeRequest = {
  product?: ProductKey;
  quantityMt?: number;
  sellPricePerMt?: number;
  sellCurrency?: CurrencyCode;
  counterparty?: string;
  destinationPort?: PortKey;
};

type StooqRow = Record<"Symbol" | "Date" | "Time" | "Open" | "High" | "Low" | "Close", string>;

type AgriPriceRow = {
  memberStateCode?: string;
  memberStateName?: string;
  beginDate?: string;
  endDate?: string;
  referencePeriod?: string;
  productName?: string;
  marketName?: string;
  stageName?: string;
  price?: string | number;
  unit?: string;
  year?: number;
  month?: string;
};

type PortWeather = {
  port: string;
  windKph: number;
  gustKph: number;
  precipitationMm: number;
  risk: RiskLevel;
  reason: string;
  observedAt: string;
};

const products = {
  wheat: {
    label: "Milling wheat",
    materialGroup: "AGRI-WHEAT",
    costCenter: "TRD-AGRI-DXB",
    stooqSymbol: "zw.f",
    stooqLabel: "Wheat futures",
    bushelMt: 0.0272155422,
    euProductCode: "BLTPAN",
  },
  corn: {
    label: "Feed corn",
    materialGroup: "AGRI-CORN",
    costCenter: "TRD-AGRI-DXB",
    stooqSymbol: "zc.f",
    stooqLabel: "Corn futures",
    bushelMt: 0.0254011727,
    euProductCode: "MAI",
  },
  urea: {
    label: "Granular urea",
    materialGroup: "FERT-UREA",
    costCenter: "TRD-FERT-DXB",
    fertiliserProduct: "N (Nitrogen)",
  },
  copper: {
    label: "Copper cathodes",
    materialGroup: "IND-COPPER",
    costCenter: "TRD-IND-DXB",
    stooqSymbol: "hg.f",
    stooqLabel: "Copper futures",
  },
} as const;

const ports = {
  "jebel-ali": { name: "Jebel Ali, Dubai", latitude: 25.0118, longitude: 55.061, freightUsdPerMt: 18 },
  rotterdam: { name: "Port of Rotterdam", latitude: 51.949, longitude: 4.142, freightUsdPerMt: 24 },
  santos: { name: "Port of Santos", latitude: -23.9535, longitude: -46.3339, freightUsdPerMt: 38 },
} as const;

export async function POST(request: Request) {
  const input = normalizeRequest((await request.json()) as ProcessTradeRequest);
  const product = products[input.product];
  const port = ports[input.destinationPort];
  const now = new Date();
  const logStamp = formatLogStamp(now);
  const dealId = `CRM-${now.getUTCFullYear()}-${String(now.getTime()).slice(-6)}`;

  const [market, fx, sourcing, weather] = await Promise.all([
    getBenchmark(input.product, input.sellCurrency),
    getFxRates(input.sellCurrency),
    getSourcingOptions(input.product, input.sellCurrency),
    getPortWeather(input.destinationPort),
  ]);

  const sellPriceUsd = input.sellPricePerMt * fx.toUsd;
  const benchmarkUsd = market.usdPerMt;
  const freightUsd = port.freightUsdPerMt + (weather.risk === "High" ? 12 : weather.risk === "Watch" ? 6 : 0);
  const grossMarginUsdPerMt = sellPriceUsd - benchmarkUsd;
  const landedMarginUsdPerMt = sellPriceUsd - benchmarkUsd - freightUsd;
  const landedMarginPct = (landedMarginUsdPerMt / sellPriceUsd) * 100;
  const totalValueOriginal = input.quantityMt * input.sellPricePerMt;
  const totalValueUsd = input.quantityMt * sellPriceUsd;
  const totalValueAed = totalValueOriginal * fx.toAed;
  const riskLevel = scoreDealRisk(landedMarginPct, weather.risk);
  const cheapestSource = sourcing[0] ?? null;

  const crmPayload = {
    deal_id: dealId,
    counterparty: input.counterparty,
    product: product.label,
    quantity_mt: input.quantityMt,
    sell_price_per_mt: input.sellPricePerMt,
    currency: input.sellCurrency,
    destination_port: port.name,
    stage: "Offer issued",
  };

  const sapPayload = {
    document_type: "ZBULK_TRADE_QUOTE",
    reference: dealId,
    material_group: product.materialGroup,
    cost_center: product.costCenter,
    quantity_mt: input.quantityMt,
    unit_price_usd: round(sellPriceUsd, 2),
    benchmark_usd_per_mt: round(benchmarkUsd, 2),
    estimated_freight_usd_per_mt: round(freightUsd, 2),
    total_value_usd: round(totalValueUsd, 2),
    total_value_aed: round(totalValueAed, 2),
    landed_margin_pct: round(landedMarginPct, 2),
    risk_status: riskLevel,
  };

  const processingLog = [
    `[${logStamp}] Received CRM deal ${dealId} for ${input.quantityMt.toLocaleString()} MT ${product.label}.`,
    `[${logStamp}] Fetching live ${market.label} benchmark from ${market.source}... ${formatUsd(market.usdPerMt)}/MT.`,
    `[${logStamp}] Fetching ${input.sellCurrency}/USD and ${input.sellCurrency}/AED FX via Frankfurter... ${fx.toUsd.toFixed(4)} / ${fx.toAed.toFixed(4)}.`,
    `[${logStamp}] Querying EU Agri-food regional prices... ${cheapestSource ? `${cheapestSource.market} is cheapest at ${formatCurrency(cheapestSource.priceOriginal, input.sellCurrency)}/MT.` : "no comparable regional market returned."}`,
    `[${logStamp}] Checking ${port.name} weather via Open-Meteo... ${weather.gustKph.toFixed(1)} km/h gusts, ${weather.precipitationMm.toFixed(1)} mm rain.`,
    `[${logStamp}] Transforming CRM payload to SAP ERP JSON structure...`,
    `[${logStamp}] SUCCESS: ${riskLevel} risk deal pushed to simulated ERP payload.`,
  ];

  return NextResponse.json(
    {
      generatedAt: now.toISOString(),
      crmPayload,
      market,
      fx,
      sourcing,
      logistics: weather,
      margin: {
        sellPriceUsdPerMt: round(sellPriceUsd, 2),
        benchmarkUsdPerMt: round(benchmarkUsd, 2),
        grossMarginUsdPerMt: round(grossMarginUsdPerMt, 2),
        estimatedFreightUsdPerMt: round(freightUsd, 2),
        landedMarginUsdPerMt: round(landedMarginUsdPerMt, 2),
        landedMarginPct: round(landedMarginPct, 2),
        riskLevel,
      },
      sapPayload,
      processingLog,
      sources: [
        { label: market.source, url: market.sourceUrl },
        { label: "Frankfurter FX API", url: "https://frankfurter.dev/" },
        { label: "EU Agri-food Data Portal API", url: "https://api.tech.ec.europa.eu/agrifood/" },
        { label: "Open-Meteo Forecast API", url: "https://open-meteo.com/" },
      ],
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

function normalizeRequest(input: ProcessTradeRequest): Required<ProcessTradeRequest> {
  const product: ProductKey = input.product && input.product in products ? input.product : "wheat";
  const destinationPort: PortKey = input.destinationPort && input.destinationPort in ports ? input.destinationPort : "jebel-ali";
  const sellCurrency = input.sellCurrency === "EUR" ? "EUR" : "USD";

  return {
    product,
    destinationPort,
    sellCurrency,
    quantityMt: clampNumber(input.quantityMt, 1000, 100000, 10000),
    sellPricePerMt: clampNumber(input.sellPricePerMt, 100, 1000, product === "copper" ? 9800 : product === "urea" ? 560 : 230),
    counterparty: input.counterparty?.trim() || "MIRA demo counterparty",
  };
}

async function getBenchmark(productKey: ProductKey, currency: CurrencyCode) {
  const product = products[productKey];

  if ("fertiliserProduct" in product) {
    const rows = await fetchJson<AgriPriceRow[]>(
      `https://api.tech.ec.europa.eu/agrifood/api/fertiliser/prices?products=${encodeURIComponent(product.fertiliserProduct)}`,
      300
    );
    const latest = rows
      .filter((row) => Number.isFinite(parsePrice(row.price)))
      .sort((a, b) => fertiliserSortKey(b) - fertiliserSortKey(a))[0];

    if (!latest) throw new Error("No EU fertiliser price returned");
    const eurPerMt = parsePrice(latest.price);
    const fx = await getFxRates("EUR");
    return {
      label: `${product.label} proxy`,
      usdPerMt: eurPerMt * fx.toUsd,
      originalPrice: eurPerMt,
      originalCurrency: "EUR",
      unit: latest.unit ?? "EUR/tonne",
      observedAt: `${latest.month ?? ""} ${latest.year ?? ""}`.trim(),
      source: "EU fertiliser price API",
      sourceUrl: "https://api.tech.ec.europa.eu/agrifood/api/fertiliser/prices",
    };
  }

  const row = await getStooqQuote(product.stooqSymbol);
  const close = Number(row.Close);
  let usdPerMt: number;
  if (productKey === "copper") {
    usdPerMt = (close / 100) * 2204.62262;
  } else if ("bushelMt" in product) {
    usdPerMt = (close / 100) / product.bushelMt;
  } else {
    usdPerMt = close;
  }

  return {
    label: product.stooqLabel,
    usdPerMt,
    originalPrice: currency === "EUR" ? usdPerMt / (await getFxRates("EUR")).toUsd : usdPerMt,
    originalCurrency: "USD",
    unit: "USD/MT equivalent",
    observedAt: `${row.Date} ${row.Time}`,
    source: "Stooq public CSV quotes",
    sourceUrl: "https://stooq.com/",
  };
}

async function getFxRates(base: CurrencyCode) {
  if (base === "USD") {
    const rows = await fetchJson<Array<{ quote: string; rate: number; date: string }>>(
      "https://api.frankfurter.dev/v2/rates?base=USD&quotes=AED,EUR",
      300
    );
    const byQuote = new Map(rows.map((row) => [row.quote, row.rate]));
    return {
      base,
      toUsd: 1,
      toAed: byQuote.get("AED") ?? 3.6725,
      observedAt: rows[0]?.date,
    };
  }

  const rows = await fetchJson<Array<{ quote: string; rate: number; date: string }>>(
    "https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD,AED",
    300
  );
  const byQuote = new Map(rows.map((row) => [row.quote, row.rate]));
  return {
    base,
    toUsd: byQuote.get("USD") ?? 1.16,
    toAed: byQuote.get("AED") ?? 4.27,
    observedAt: rows[0]?.date,
  };
}

async function getSourcingOptions(productKey: ProductKey, currency: CurrencyCode) {
  const product = products[productKey];
  if (!("euProductCode" in product)) return [];

  const dateRange = getEuDateRange();
  const rows = await fetchJson<AgriPriceRow[]>(
    `https://api.tech.ec.europa.eu/agrifood/api/cereal/prices?memberStateCodes=FR,DE,PL,RO&productCodes=${product.euProductCode}&beginDate=${dateRange.begin}&endDate=${dateRange.end}`,
    300
  );

  const latestByCountry = new Map<string, AgriPriceRow>();
  for (const row of rows) {
    const price = parsePrice(row.price);
    if (!row.memberStateCode || !Number.isFinite(price)) continue;

    const current = latestByCountry.get(row.memberStateCode);
    if (!current || isPreferredSourcingRow(row, current)) {
      latestByCountry.set(row.memberStateCode, row);
    }
  }

  const eurFx = await getFxRates("EUR");
  return Array.from(latestByCountry.values())
    .map((row) => {
      const eurPerMt = parsePrice(row.price);
      const priceOriginal = currency === "EUR" ? eurPerMt : eurPerMt * eurFx.toUsd;
      return {
        market: row.memberStateName ?? row.memberStateCode ?? "Unknown",
        code: row.memberStateCode ?? "NA",
        product: row.productName ?? product.label,
        marketName: row.marketName ?? "National Average",
        stageName: row.stageName ?? "Not specified",
        priceOriginal: round(priceOriginal, 2),
        currency,
        eurPerMt: round(eurPerMt, 2),
        unit: row.unit ?? "TONNES",
        period: row.referencePeriod ?? row.endDate ?? row.beginDate ?? "Latest",
      };
    })
    .sort((a, b) => a.priceOriginal - b.priceOriginal);
}

async function getPortWeather(portKey: PortKey): Promise<PortWeather> {
  const port = ports[portKey];
  const query = new URLSearchParams({
    latitude: port.latitude.toString(),
    longitude: port.longitude.toString(),
    current: "wind_speed_10m,wind_gusts_10m,precipitation",
    timezone: "auto",
  });
  const data = await fetchJson<{
    current: {
      time: string;
      wind_speed_10m: number;
      wind_gusts_10m: number;
      precipitation: number;
    };
  }>(`https://api.open-meteo.com/v1/forecast?${query.toString()}`, 300);

  const windKph = data.current.wind_speed_10m;
  const gustKph = data.current.wind_gusts_10m;
  const precipitationMm = data.current.precipitation;
  const risk = scorePortRisk(windKph, gustKph, precipitationMm);

  return {
    port: port.name,
    windKph,
    gustKph,
    precipitationMm,
    risk,
    reason: risk === "High"
      ? "Weather may disrupt loading or berth operations."
      : risk === "Watch"
        ? "Monitor loading windows and demurrage exposure."
        : "No immediate weather disruption signal.",
    observedAt: data.current.time,
  };
}

async function getStooqQuote(symbol: string): Promise<StooqRow> {
  const query = new URLSearchParams({
    s: symbol,
    f: "sd2t2ohlcv",
    h: "",
    e: "csv",
  });
  const response = await fetch(`https://stooq.com/q/l/?${query.toString()}`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Stooq ${symbol} returned ${response.status}`);

  const [headerLine, rowLine] = (await response.text()).trim().split(/\r?\n/);
  if (!headerLine || !rowLine) throw new Error(`Stooq ${symbol} returned an empty CSV`);
  const headers = headerLine.split(",");
  const values = rowLine.split(",");
  return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as StooqRow;
}

async function fetchJson<T>(url: string, revalidate: number): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return (await response.json()) as T;
}

function isPreferredSourcingRow(candidate: AgriPriceRow, current: AgriPriceRow) {
  const candidateDate = parseEuDate(candidate.referencePeriod ?? candidate.endDate ?? candidate.beginDate);
  const currentDate = parseEuDate(current.referencePeriod ?? current.endDate ?? current.beginDate);
  if (candidateDate !== currentDate) return candidateDate > currentDate;

  const candidateNational = candidate.marketName?.toLowerCase().includes("national") ? 1 : 0;
  const currentNational = current.marketName?.toLowerCase().includes("national") ? 1 : 0;
  return candidateNational > currentNational;
}

function getEuDateRange() {
  const end = new Date();
  const begin = new Date(end);
  begin.setDate(begin.getDate() - 180);
  return {
    begin: formatEuDate(begin),
    end: formatEuDate(end),
  };
}

function formatEuDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function parseEuDate(value?: string) {
  if (!value) return 0;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return 0;
  return Date.UTC(year, month - 1, day);
}

function parsePrice(value: unknown) {
  if (typeof value === "number") return value;
  const normalized = String(value ?? "")
    .replace(/[^\d,.-]/g, "")
    .trim();
  if (!normalized) return Number.NaN;
  if (normalized.includes(",") && !normalized.includes(".")) return Number(normalized.replace(",", "."));
  return Number(normalized.replace(/,/g, ""));
}

function fertiliserSortKey(row: AgriPriceRow) {
  const year = Number((row as { year?: number }).year ?? 0);
  const month = monthIndex((row as { month?: string }).month);
  return year * 100 + month;
}

function monthIndex(value?: string) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(value ?? "") + 1;
}

function scoreDealRisk(marginPct: number, portRisk: RiskLevel): RiskLevel {
  if (marginPct < 2 || portRisk === "High") return "High";
  if (marginPct < 6 || portRisk === "Watch") return "Watch";
  return "Clear";
}

function scorePortRisk(windKph: number, gustKph: number, precipitationMm: number): RiskLevel {
  if (gustKph >= 45 || windKph >= 30 || precipitationMm >= 8) return "High";
  if (gustKph >= 30 || windKph >= 20 || precipitationMm >= 2) return "Watch";
  return "Clear";
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function round(value: number, digits: number) {
  return Number(value.toFixed(digits));
}

function formatLogStamp(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
