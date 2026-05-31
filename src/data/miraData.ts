// Synthetic but business-accurate data modeled on Mira Group's public footprint:
// Mira Developments (real estate), Mira General Trading (commodities), Mira International (brokers).

export type Project = {
  id: string;
  name: string;
  brand: string;
  location: string;
  market: "dubai" | "international";
  tier: "mid" | "luxury";
  color: string;
  handover: string;
  progress: number;
  priceRange: string;
  status: string;
  statusTone: "pos" | "warn" | "neutral" | "rose";
  units: string;
  unitsSold: string;
  entry: string;
  buyer: string;
  note: string;
  dataFlag?: string;
};

export const projects: Project[] = [
  {
    id: "richmond",
    name: "Richmond District",
    brand: "John Richmond",
    location: "Al Furjan, Dubai",
    market: "dubai",
    tier: "mid",
    color: "#1d9e75",
    handover: "Q1 2029",
    progress: 22,
    priceRange: "AED 880K – 2.1M",
    status: "On track",
    statusTone: "pos",
    units: "~320",
    unitsSold: "71 (22%)",
    entry: "AED 880K",
    buyer: "Investors / CIS",
    note: "Metro proximity and a 3-yr post-handover plan are the primary sales drivers. Tower 1 launched Q1 2026; towers 2–5 and office block follow in phases.",
  },
  {
    id: "trussardi2",
    name: "Trussardi Residences Phase II",
    brand: "Trussardi",
    location: "Al Furjan, Dubai",
    market: "dubai",
    tier: "mid",
    color: "#378add",
    handover: "Q2 2027",
    progress: 55,
    priceRange: "AED 1.1M – 3.8M",
    status: "On track",
    statusTone: "pos",
    units: "~160",
    unitsSold: "88 (55%)",
    entry: "AED 1.1M",
    buyer: "Owner-occ / investor",
    note: "Milanese branded interiors. Phase I (119 units, Q4 2026) running ahead — Phase II rides the same brand momentum. Office component adds commercial diversification.",
  },
  {
    id: "bentley",
    name: "Mira Villas — Bentley Home",
    brand: "Bentley Home",
    location: "Meydan D11, Dubai",
    market: "dubai",
    tier: "luxury",
    color: "#7f77dd",
    handover: "Q4 2027",
    progress: 68,
    priceRange: "AED 27.2M+",
    status: "68% sold",
    statusTone: "pos",
    units: "36 (27 villas + 9 VIP)",
    unitsSold: "24 (68%)",
    entry: "AED 27.2M",
    buyer: "UHNW / family office",
    note: "Flagship ultra-luxury product. A limited 36-unit scarcity drives pricing power. UHNW pipeline sourced through Percent&Co and the Mira International broker network.",
  },
  {
    id: "ferre",
    name: "Gianfranco Ferré Residences",
    brand: "GF Ferré",
    location: "Al Marjan Island, RAK",
    market: "international",
    tier: "mid",
    color: "#ef9f27",
    handover: "Q1 2028",
    progress: 38,
    priceRange: "AED 1.6M – 4.2M",
    status: "38% sold",
    statusTone: "warn",
    units: "Studio – 4BR + duplexes",
    unitsSold: "38%",
    entry: "AED 1.6M",
    buyer: "Investor + lifestyle",
    note: "Resort-residential on Al Marjan Island. Strong demand for larger family units and flexible studio layouts suited to short-term rental strategies.",
  },
  {
    id: "saab",
    name: "POST Hotel & Residences — ELIE SAAB",
    brand: "ELIE SAAB",
    location: "Andermatt, Switzerland",
    market: "international",
    tier: "luxury",
    color: "#d4537e",
    handover: "Q3 2027",
    progress: 45,
    priceRange: "AED 20.5M+",
    status: "45% sold",
    statusTone: "rose",
    units: "16–19 residences + 21 keys",
    unitsSold: "45%",
    entry: "AED 20.5M",
    buyer: "UHNW / hospitality",
    note: "International trophy asset targeting UHNW buyers and hospitality investors.",
    dataFlag: "Unit count inconsistent across official materials (16 vs 19 residences) — requires CRM data reconciliation.",
  },
  {
    id: "tbilisi",
    name: "Trussardi Residences — Mira Verde",
    brand: "Trussardi",
    location: "Tbilisi, Georgia",
    market: "international",
    tier: "mid",
    color: "#888780",
    handover: "Q3 2029",
    progress: 8,
    priceRange: "AED 706K+",
    status: "Early stage",
    statusTone: "neutral",
    units: "Apartments + villas",
    unitsSold: "8%",
    entry: "AED 706K",
    buyer: "CIS investors",
    note: "Sold on investor economics: off-plan pricing, 8% guaranteed returns, and Georgia tax/residency benefits. Primary audience is CIS-region investors diversifying away from UAE concentration.",
  },
  {
    id: "coral",
    name: "Mira Coral Bay",
    brand: "14 luxury brands",
    location: "Ras Al Khaimah",
    market: "international",
    tier: "luxury",
    color: "#5dcaa5",
    handover: "TBD",
    progress: 3,
    priceRange: "TBD",
    status: "Pre-launch",
    statusTone: "warn",
    units: "Villas + townhouses + resort",
    unitsSold: "Pre-launch",
    entry: "TBD",
    buyer: "UHNW / lifestyle",
    note: "Most ambitious project in the pipeline. Dolce&Gabbana Casa, ETRO Home and Jacob&Co partnerships confirmed; 250-room resort + spa.",
    dataFlag: "Public materials show conflicting inventory (124 vs 165 villas) — flagged for CRM-SAP reconciliation.",
  },
];

export const groupKpis = [
  { label: "Total AUM", value: "AED 3.2B", sub: "↑ 18% vs Q1", tone: "pos" as const, spark: [2.4, 2.6, 2.7, 2.9, 3.0, 3.2] },
  { label: "Active projects", value: "7", sub: "3 markets", tone: "neutral" as const, spark: [5, 5, 6, 6, 7, 7] },
  { label: "CRM pipeline", value: "648", sub: "↑ 34 this week", tone: "pos" as const, spark: [540, 560, 590, 610, 630, 648] },
  { label: "Open trades", value: "12", sub: "↓ 2 pending docs", tone: "neg" as const, spark: [16, 15, 14, 13, 14, 12] },
];

export const realEstateKpis = [
  { label: "Portfolio GDV", value: "AED 2.8B", sub: "↑ 12% vs last quarter", tone: "pos" as const, spark: [2.3, 2.4, 2.5, 2.6, 2.7, 2.8] },
  { label: "Units total", value: "847", sub: "Across 7 projects", tone: "neutral" as const, spark: [780, 800, 815, 830, 840, 847] },
  { label: "Units sold", value: "531", sub: "63% absorption", tone: "pos" as const, spark: [410, 440, 470, 495, 515, 531] },
  { label: "Avg. ticket", value: "AED 3.4M", sub: "↑ 8% YoY", tone: "pos" as const, spark: [3.0, 3.1, 3.15, 3.25, 3.3, 3.4] },
  { label: "Broker share", value: "68%", sub: "of closed deals", tone: "neutral" as const, spark: [62, 64, 66, 65, 67, 68] },
];

export const tradingKpis = [
  { label: "Realized P&L MTD", value: "+$184K", sub: "↑ 22% vs prior month", tone: "pos" as const, spark: [90, 110, 130, 150, 170, 184] },
  { label: "Open exposure", value: "$2.4M", sub: "Across 4 commodities", tone: "neutral" as const, spark: [2.0, 2.2, 2.1, 2.3, 2.5, 2.4] },
  { label: "Open contracts", value: "12", sub: "2 pending docs", tone: "warn" as const, spark: [9, 10, 11, 13, 12, 12] },
  { label: "Shipments active", value: "5", sub: "3 in transit", tone: "pos" as const, spark: [3, 4, 4, 5, 4, 5] },
  { label: "Hedged positions", value: "67%", sub: "of open exposure", tone: "neutral" as const, spark: [60, 62, 64, 63, 66, 67] },
];

export const crmFunnel = [
  { stage: "Inquiry", count: 648, pct: 100, color: "#1d9e75" },
  { stage: "Qualified", count: 467, pct: 72, color: "#378add" },
  { stage: "Site visit", count: 261, pct: 40, color: "#7f77dd" },
  { stage: "Offer", count: 118, pct: 18, color: "#ef9f27" },
  { stage: "Closed", count: 57, pct: 9, color: "#d4537e" },
];

export const brokers = [
  { initials: "AK", name: "Aleksei K.", volume: "AED 48M", pct: 100 },
  { initials: "NP", name: "Natalia P.", volume: "AED 39M", pct: 82 },
  { initials: "DM", name: "Dmitri M.", volume: "AED 31M", pct: 65 },
  { initials: "SR", name: "Sara R.", volume: "AED 25M", pct: 52 },
  { initials: "IM", name: "Ivan M.", volume: "AED 19M", pct: 40 },
];

export const investorGeography = [
  { flag: "🌐", label: "CIS", pct: 42, bar: 100, color: "#378add" },
  { flag: "🇦🇪", label: "UAE local", pct: 22, bar: 52, color: "#1d9e75" },
  { flag: "🇬🇧", label: "Europe", pct: 15, bar: 36, color: "#7f77dd" },
  { flag: "🇮🇳", label: "South Asia", pct: 11, bar: 26, color: "#ef9f27" },
  { flag: "🌍", label: "Other", pct: 10, bar: 24, color: "#888780" },
];

export const handoverTimeline = [
  { quarter: "Q4 2026", label: "Trussardi Ph. I — Al Furjan", color: "#378add" },
  { quarter: "Q2 2027", label: "Trussardi Ph. II — Al Furjan", color: "#378add" },
  { quarter: "Q3 2027", label: "POST Hotel — Andermatt CH", color: "#d4537e" },
  { quarter: "Q1 2028", label: "GF Ferré — Al Marjan, RAK", color: "#ef9f27" },
  { quarter: "Q1 2029", label: "Richmond District — Al Furjan", color: "#1d9e75" },
  { quarter: "Q3 2029", label: "Mira Verde — Tbilisi GE", color: "#888780" },
];

export type PriceCard = {
  name: string;
  price: string;
  unit: string;
  changePct: number;
  spark: string;
};

export const priceFeed: PriceCard[] = [
  { name: "Urea (fertilizer)", price: "$312", unit: "per MT · FOB Black Sea", changePct: 1.4, spark: "0,28 15,26 30,24 45,27 60,22 75,18 90,20 105,16 120,14" },
  { name: "DAP (fertilizer)", price: "$574", unit: "per MT · FOB Tampa", changePct: 0.9, spark: "0,30 15,28 30,26 45,29 60,25 75,22 90,21 105,19 120,17" },
  { name: "Copper", price: "$9,842", unit: "per MT · LME", changePct: 0.8, spark: "0,20 15,22 30,18 45,24 60,20 75,16 90,19 105,15 120,13" },
  { name: "Wheat", price: "$214", unit: "per MT · CBOT", changePct: -0.6, spark: "0,14 15,16 30,18 45,15 60,20 75,22 90,20 105,24 120,26" },
];

export type Trade = {
  id: string;
  commodity: string;
  direction: "BUY" | "SELL";
  volume: string;
  price: string;
  counterparty: string;
  status: "open" | "confirmed" | "pending" | "settled" | "hedged";
  statusLabel: string;
  pnl: string;
  positive: boolean;
};

export const tradeBlotter: Trade[] = [
  { id: "FT-0441", commodity: "Urea", direction: "BUY", volume: "500 MT", price: "$308/t", counterparty: "AgriCIS LLC", status: "open", statusLabel: "Open", pnl: "+$2,000", positive: true },
  { id: "FT-0438", commodity: "DAP", direction: "BUY", volume: "200 MT", price: "$569/t", counterparty: "Fertis MENA", status: "confirmed", statusLabel: "Confirmed", pnl: "+$1,000", positive: true },
  { id: "GM-0118", commodity: "Copper", direction: "BUY", volume: "50 MT", price: "$9,780/t", counterparty: "MetEx Dubai", status: "hedged", statusLabel: "Hedged", pnl: "+$3,100", positive: true },
  { id: "GR-0092", commodity: "Wheat", direction: "SELL", volume: "1,200 MT", price: "$216/t", counterparty: "GrainTrade AE", status: "pending", statusLabel: "Pending docs", pnl: "−$2,400", positive: false },
  { id: "FT-0432", commodity: "Urea", direction: "SELL", volume: "800 MT", price: "$315/t", counterparty: "NutriCIS Group", status: "confirmed", statusLabel: "Confirmed", pnl: "+$5,600", positive: true },
  { id: "CH-0044", commodity: "Chemicals", direction: "BUY", volume: "30 MT", price: "$1,840/t", counterparty: "ChemPro DMCC", status: "pending", statusLabel: "Pending docs", pnl: "−$600", positive: false },
  { id: "FT-0421", commodity: "DAP", direction: "SELL", volume: "350 MT", price: "$578/t", counterparty: "Fertis MENA", status: "settled", statusLabel: "Settled", pnl: "+$9,800", positive: true },
];

export const commodityExposure = [
  { name: "Fertilizers", value: "$1.12M", bar: 100, color: "#1d9e75" },
  { name: "Copper", value: "$822K", bar: 73, color: "#378add" },
  { name: "Grains", value: "$278K", bar: 38, color: "#ef9f27" },
  { name: "Chemicals", value: "$164K", bar: 24, color: "#7f77dd" },
];

export const shipmentStages = [
  { label: "Contract", count: 3 },
  { label: "Loading", count: 2 },
  { label: "In transit", count: 3 },
  { label: "Delivered", count: 4 },
];

export const sapStatus = [
  { label: "CRM → SAP sync", value: "Live", tone: "pos" as const },
  { label: "CTRM → SAP sync", value: "Delayed 6h", tone: "warn" as const },
  { label: "Odoo → SAP sync", value: "Live", tone: "pos" as const },
  { label: "ETL last run", value: "6h ago", tone: "neutral" as const },
  { label: "Power BI refresh", value: "42 min ago", tone: "pos" as const },
];

export const systemChips = [
  { label: "CRM", tone: "ok" as const },
  { label: "SAP ERP", tone: "ok" as const },
  { label: "Odoo (Commodities)", tone: "warn" as const },
  { label: "Power BI", tone: "ok" as const },
  { label: "ETL pipeline", tone: "ok" as const },
  { label: "CTRM — 2 alerts", tone: "warn" as const },
];

export type Activity = {
  icon: "building" | "trade" | "users" | "alert" | "ship" | "invoice" | "receipt";
  text: string;
  bold: string;
  time: string;
};

export const groupActivity: Activity[] = [
  { icon: "building", bold: "Richmond District T1", text: "3 units reserved via broker channel", time: "14 min ago" },
  { icon: "trade", bold: "Fertilizers contract #FT-0441", text: "shipment confirmed, SAP updated", time: "1 hr ago" },
  { icon: "users", bold: "12 new CIS leads", text: "from Percent&Co investor club", time: "3 hr ago" },
  { icon: "alert", bold: "CTRM sync delay", text: "2 open positions pending reconciliation", time: "5 hr ago" },
];

export const tradeActivity: Activity[] = [
  { icon: "ship", bold: "FT-0432 Urea", text: "vessel departed Odessa, ETA Dubai 12 Jun", time: "2h ago" },
  { icon: "invoice", bold: "GR-0092", text: "LC issued by Emirates NBD, awaiting seller confirmation", time: "4h ago" },
  { icon: "receipt", bold: "FT-0421 DAP", text: "settled, $9,800 P&L booked to SAP cost centre TRD-02", time: "Yesterday" },
  { icon: "alert", bold: "CH-0044", text: "phytosanitary docs missing, shipment on hold", time: "Yesterday" },
];
