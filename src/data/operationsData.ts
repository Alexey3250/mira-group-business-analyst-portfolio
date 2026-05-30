import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  Database,
  GitBranch,
  Handshake,
  LineChart,
  MapPinned,
  PackageCheck,
  Pipette,
  ShieldCheck,
  Ship,
  TableProperties,
  Workflow,
} from "lucide-react";

export type Project = {
  name: string;
  location: string;
  brandPartner: string;
  handover: string;
  startingPriceAed: number;
  totalUnits: number;
  sold: number;
  reserved: number;
  available: number;
  revenueAedM: number;
  brokerPct: number;
  directPct: number;
  constructionPct: number;
};

export type TradePosition = {
  id: string;
  commodity: "Fertilizers" | "Metals" | "Grains";
  product: string;
  counterparty: string;
  region: string;
  status: "Contract" | "Shipment" | "Delivery" | "Settled";
  quantityMt: number;
  pnlAedK: number;
  exposureAedM: number;
  costCenter: string;
  incoterm: string;
  eta: string;
  risk: "Low" | "Watch" | "High";
};

export type FunnelStage = {
  stage: string;
  leads: number;
  conversion: number;
  color: string;
};

export type Broker = {
  name: string;
  volumeAedM: number;
  leads: number;
  conversion: number;
};

export type Geography = {
  market: string;
  region: string;
  leads: number;
  conversion: number;
  valueAedM: number;
};

export type ArchitectureNode = {
  title: string;
  subtitle: string;
  owner: string;
  icon: LucideIcon;
  tone: string;
};

export const projectPortfolio: Project[] = [
  {
    name: "Richmond District",
    location: "Discovery Gardens, Al Furjan",
    brandPartner: "John Richmond",
    handover: "Q1 2029",
    startingPriceAed: 880000,
    totalUnits: 1420,
    sold: 418,
    reserved: 136,
    available: 866,
    revenueAedM: 746,
    brokerPct: 68,
    directPct: 32,
    constructionPct: 9,
  },
  {
    name: "Trussardi Residences Phase II",
    location: "Discovery Gardens, Al Furjan",
    brandPartner: "Trussardi Casa",
    handover: "Q2 2027",
    startingPriceAed: 1100000,
    totalUnits: 366,
    sold: 213,
    reserved: 41,
    available: 112,
    revenueAedM: 472,
    brokerPct: 61,
    directPct: 39,
    constructionPct: 31,
  },
  {
    name: "Trussardi Residences",
    location: "Al Furjan, Dubai",
    brandPartner: "Trussardi Casa",
    handover: "Q4 2026",
    startingPriceAed: 3400000,
    totalUnits: 165,
    sold: 139,
    reserved: 12,
    available: 14,
    revenueAedM: 586,
    brokerPct: 54,
    directPct: 46,
    constructionPct: 72,
  },
  {
    name: "Mira Villas designed by Bentley Home",
    location: "District 11, Meydan",
    brandPartner: "Bentley Home",
    handover: "Q4 2026",
    startingPriceAed: 27200000,
    totalUnits: 36,
    sold: 28,
    reserved: 3,
    available: 5,
    revenueAedM: 912,
    brokerPct: 47,
    directPct: 53,
    constructionPct: 67,
  },
  {
    name: "Gianfranco Ferre Residences",
    location: "Al Marjan Island, Ras Al Khaimah",
    brandPartner: "Gianfranco Ferre Home",
    handover: "Q1 2028",
    startingPriceAed: 1600000,
    totalUnits: 485,
    sold: 162,
    reserved: 58,
    available: 265,
    revenueAedM: 391,
    brokerPct: 72,
    directPct: 28,
    constructionPct: 18,
  },
  {
    name: "POST Hotel & Residences by ELIE SAAB",
    location: "Andermatt, Switzerland",
    brandPartner: "ELIE SAAB Maison",
    handover: "Q3 2027",
    startingPriceAed: 20500000,
    totalUnits: 52,
    sold: 21,
    reserved: 7,
    available: 24,
    revenueAedM: 648,
    brokerPct: 39,
    directPct: 61,
    constructionPct: 38,
  },
];

export const tradePositions: TradePosition[] = [
  {
    id: "MTR-2406-118",
    commodity: "Fertilizers",
    product: "Granular urea",
    counterparty: "CIS Agri Export",
    region: "Black Sea",
    status: "Shipment",
    quantityMt: 18500,
    pnlAedK: 842,
    exposureAedM: 23.6,
    costCenter: "TRD-FERT-DXB",
    incoterm: "CFR",
    eta: "2026-06-18",
    risk: "Watch",
  },
  {
    id: "MTR-2406-121",
    commodity: "Metals",
    product: "Aluminum billets",
    counterparty: "Gulf Metals DMCC",
    region: "GCC",
    status: "Delivery",
    quantityMt: 4200,
    pnlAedK: 515,
    exposureAedM: 18.2,
    costCenter: "TRD-MET-DXB",
    incoterm: "FOB",
    eta: "2026-06-09",
    risk: "Low",
  },
  {
    id: "MTR-2406-127",
    commodity: "Grains",
    product: "Milling wheat",
    counterparty: "Black Sea Grain Co.",
    region: "CIS",
    status: "Contract",
    quantityMt: 27000,
    pnlAedK: 366,
    exposureAedM: 31.4,
    costCenter: "TRD-AGR-DXB",
    incoterm: "CIF",
    eta: "2026-07-03",
    risk: "High",
  },
  {
    id: "MTR-2406-132",
    commodity: "Fertilizers",
    product: "NPK blend",
    counterparty: "East Africa Inputs",
    region: "Africa",
    status: "Settled",
    quantityMt: 11200,
    pnlAedK: 610,
    exposureAedM: 9.7,
    costCenter: "TRD-FERT-DXB",
    incoterm: "CIP",
    eta: "2026-05-24",
    risk: "Low",
  },
  {
    id: "MTR-2406-135",
    commodity: "Metals",
    product: "Copper cathodes",
    counterparty: "Caspian Industrial Supply",
    region: "CIS",
    status: "Shipment",
    quantityMt: 1600,
    pnlAedK: -124,
    exposureAedM: 26.8,
    costCenter: "TRD-MET-DXB",
    incoterm: "DAP",
    eta: "2026-06-27",
    risk: "Watch",
  },
  {
    id: "MTR-2406-141",
    commodity: "Grains",
    product: "Feed barley",
    counterparty: "Levant Grain Partners",
    region: "MENA",
    status: "Delivery",
    quantityMt: 21800,
    pnlAedK: 294,
    exposureAedM: 15.1,
    costCenter: "TRD-AGR-DXB",
    incoterm: "CFR",
    eta: "2026-06-12",
    risk: "Low",
  },
];

export const shipmentPipeline = [
  { stage: "Contract", trades: 9, valueAedM: 118 },
  { stage: "Shipment", trades: 13, valueAedM: 164 },
  { stage: "Delivery", trades: 7, valueAedM: 82 },
  { stage: "Settled", trades: 18, valueAedM: 126 },
];

export const costCenterRollup = [
  { center: "TRD-FERT-DXB", commodity: "Fertilizers", revenueAedM: 138, costAedM: 126, marginPct: 8.7 },
  { center: "TRD-MET-DXB", commodity: "Metals", revenueAedM: 111, costAedM: 104, marginPct: 6.3 },
  { center: "TRD-AGR-DXB", commodity: "Grains", revenueAedM: 96, costAedM: 91, marginPct: 5.2 },
  { center: "OPS-LOG-DXB", commodity: "Logistics", revenueAedM: 18, costAedM: 15, marginPct: 16.1 },
];

export const crmFunnel: FunnelStage[] = [
  { stage: "Inquiry", leads: 1840, conversion: 100, color: "#2563eb" },
  { stage: "Qualified", leads: 1096, conversion: 59.6, color: "#0f766e" },
  { stage: "Site Visit", leads: 612, conversion: 33.3, color: "#b45309" },
  { stage: "Offer", leads: 388, conversion: 21.1, color: "#be123c" },
  { stage: "Closed", leads: 207, conversion: 11.3, color: "#4f46e5" },
];

export const brokerPerformance: Broker[] = [
  { name: "Driven Properties", volumeAedM: 186, leads: 164, conversion: 16.5 },
  { name: "Seven Luxury Real Estate", volumeAedM: 154, leads: 139, conversion: 18.1 },
  { name: "Aeon & Trisl", volumeAedM: 141, leads: 122, conversion: 14.8 },
  { name: "Metropolitan Premium", volumeAedM: 128, leads: 118, conversion: 13.6 },
  { name: "Fam Properties", volumeAedM: 104, leads: 96, conversion: 12.9 },
  { name: "Betterhomes", volumeAedM: 92, leads: 88, conversion: 11.4 },
  { name: "D&B Properties", volumeAedM: 76, leads: 74, conversion: 10.8 },
  { name: "Allsopp & Allsopp", volumeAedM: 68, leads: 61, conversion: 9.9 },
  { name: "Provident Estate", volumeAedM: 61, leads: 58, conversion: 9.2 },
  { name: "Haus & Haus", volumeAedM: 55, leads: 53, conversion: 8.7 },
];

export const investorGeography: Geography[] = [
  { market: "Russia", region: "CIS", leads: 428, conversion: 14.8, valueAedM: 374 },
  { market: "Kazakhstan", region: "CIS", leads: 236, conversion: 13.9, valueAedM: 188 },
  { market: "UAE", region: "GCC", leads: 318, conversion: 11.5, valueAedM: 215 },
  { market: "India", region: "South Asia", leads: 247, conversion: 9.8, valueAedM: 142 },
  { market: "UK", region: "Europe", leads: 142, conversion: 10.2, valueAedM: 131 },
  { market: "Turkey", region: "MENA", leads: 118, conversion: 8.7, valueAedM: 84 },
  { market: "Saudi Arabia", region: "GCC", leads: 106, conversion: 9.4, valueAedM: 92 },
  { market: "China", region: "APAC", leads: 88, conversion: 7.2, valueAedM: 57 },
];

export const projectConversion = [
  { project: "Richmond", inquiry: 472, qualified: 281, closed: 49 },
  { project: "Trussardi II", inquiry: 396, qualified: 244, closed: 57 },
  { project: "Trussardi", inquiry: 218, qualified: 141, closed: 38 },
  { project: "Bentley Villas", inquiry: 84, qualified: 67, closed: 18 },
  { project: "Ferre RAK", inquiry: 264, qualified: 139, closed: 26 },
  { project: "ELIE SAAB", inquiry: 78, qualified: 52, closed: 11 },
];

export const architectureNodes: ArchitectureNode[] = [
  {
    title: "CRM",
    subtitle: "Leads, brokers, follow-ups, site visits",
    owner: "Sales operations",
    icon: Handshake,
    tone: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  {
    title: "Trading Ops",
    subtitle: "Contracts, shipments, settlements",
    owner: "Trade operations",
    icon: Ship,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  {
    title: "SAP ERP",
    subtitle: "Cost centers, invoices, approvals",
    owner: "Finance",
    icon: Building2,
    tone: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  {
    title: "Supabase Postgres",
    subtitle: "Curated analytical schema",
    owner: "Data platform",
    icon: Database,
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  {
    title: "ETL Controls",
    subtitle: "Validation, mapping, refresh logs",
    owner: "Business analyst",
    icon: GitBranch,
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  {
    title: "Power BI",
    subtitle: "Management dashboards and alerts",
    owner: "Leadership",
    icon: BarChart3,
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
];

export const dataFlowSteps = [
  { step: "Extract", detail: "CRM lead snapshots, SAP cost centers, shipment tracker", icon: TableProperties },
  { step: "Transform", detail: "Normalize project, broker, counterparty, and trade-stage keys", icon: Workflow },
  { step: "Validate", detail: "Missing owner, duplicate leads, unmatched cost centers, late follow-ups", icon: ShieldCheck },
  { step: "Load", detail: "Publish star-schema tables into Supabase analytical mart", icon: PackageCheck },
  { step: "Report", detail: "Power BI semantic model with management KPI definitions", icon: LineChart },
];

export const sourceNotes = [
  {
    label: "Public real estate context",
    value: "Mira Developments public project catalogue",
  },
  {
    label: "Job alignment",
    value: "CRM, SAP, Power BI, SQL, ETL, trading/export lifecycle",
  },
  {
    label: "Data policy",
    value: "All dashboard values are synthetic and candidate-generated",
  },
  {
    label: "Commercial signal",
    value: "CIS-heavy investor view and broker-channel controls",
  },
];

export const dashboardKpis = [
  { label: "Portfolio revenue", value: "AED 3.75B", delta: "+14.2%", icon: Building2, tone: "text-blue-700" },
  { label: "Open trade exposure", value: "AED 124.8M", delta: "-3.1%", icon: Ship, tone: "text-emerald-700" },
  { label: "CRM conversion", value: "11.3%", delta: "+1.7pp", icon: Pipette, tone: "text-rose-700" },
  { label: "CIS lead share", value: "41%", delta: "+6.4%", icon: MapPinned, tone: "text-amber-700" },
];
