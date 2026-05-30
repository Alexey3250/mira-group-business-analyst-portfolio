import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Database,
  Factory,
  GitBranch,
  Handshake,
  LineChart,
  MapPinned,
  PackageCheck,
  ShieldCheck,
  Ship,
  TableProperties,
  Workflow,
} from "lucide-react";

export const commodityFamilies = [
  "Fertilizers",
  "Agricultural bulk products",
  "Industrial bulk materials",
] as const;

export type CommodityFamily = (typeof commodityFamilies)[number];

export type ProductFamily = {
  name: string;
  category: CommodityFamily;
  supplyRoute: string;
  primaryUse: string;
  planningWindow: string;
  contractedMt: number;
  shippedMt: number;
  inTransitMt: number;
  openMt: number;
  revenueAedM: number;
  supplierBackedPct: number;
  customerBackedPct: number;
  serviceLevelPct: number;
};

export type TradePosition = {
  id: string;
  commodity: CommodityFamily;
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

export type ChannelPerformance = {
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

export const supplyPortfolio: ProductFamily[] = [
  {
    name: "Granular urea",
    category: "Fertilizers",
    supplyRoute: "CIS / GCC -> East Africa",
    primaryUse: "Nitrogen fertilizer programs",
    planningWindow: "Jun-Aug 2026",
    contractedMt: 42000,
    shippedMt: 27500,
    inTransitMt: 8200,
    openMt: 6300,
    revenueAedM: 62,
    supplierBackedPct: 72,
    customerBackedPct: 28,
    serviceLevelPct: 94,
  },
  {
    name: "DAP / MAP phosphates",
    category: "Fertilizers",
    supplyRoute: "GCC / North Africa -> South Asia",
    primaryUse: "Row-crop nutrient blends",
    planningWindow: "Jul-Sep 2026",
    contractedMt: 28600,
    shippedMt: 16200,
    inTransitMt: 7400,
    openMt: 5000,
    revenueAedM: 48,
    supplierBackedPct: 68,
    customerBackedPct: 32,
    serviceLevelPct: 91,
  },
  {
    name: "NPK blends",
    category: "Fertilizers",
    supplyRoute: "UAE blending -> MENA distributors",
    primaryUse: "Distributor replenishment",
    planningWindow: "Jun-Jul 2026",
    contractedMt: 18400,
    shippedMt: 13100,
    inTransitMt: 2600,
    openMt: 2700,
    revenueAedM: 34,
    supplierBackedPct: 61,
    customerBackedPct: 39,
    serviceLevelPct: 96,
  },
  {
    name: "Milling wheat",
    category: "Agricultural bulk products",
    supplyRoute: "Black Sea -> MENA mills",
    primaryUse: "Food-grade flour supply",
    planningWindow: "Jun-Oct 2026",
    contractedMt: 58200,
    shippedMt: 33400,
    inTransitMt: 14900,
    openMt: 9900,
    revenueAedM: 71,
    supplierBackedPct: 76,
    customerBackedPct: 24,
    serviceLevelPct: 89,
  },
  {
    name: "Feed corn and barley",
    category: "Agricultural bulk products",
    supplyRoute: "CIS / LatAm -> GCC feed mills",
    primaryUse: "Livestock and poultry feed",
    planningWindow: "Jul-Nov 2026",
    contractedMt: 39100,
    shippedMt: 21800,
    inTransitMt: 9300,
    openMt: 8000,
    revenueAedM: 43,
    supplierBackedPct: 64,
    customerBackedPct: 36,
    serviceLevelPct: 92,
  },
  {
    name: "Aluminum, copper, steel lots",
    category: "Industrial bulk materials",
    supplyRoute: "GCC / CIS -> industrial buyers",
    primaryUse: "Fabrication and infrastructure inputs",
    planningWindow: "Jun-Sep 2026",
    contractedMt: 19100,
    shippedMt: 9800,
    inTransitMt: 5100,
    openMt: 4200,
    revenueAedM: 82,
    supplierBackedPct: 58,
    customerBackedPct: 42,
    serviceLevelPct: 88,
  },
];

export const tradePositions: TradePosition[] = [
  {
    id: "MTR-2606-118",
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
    id: "MTR-2606-121",
    commodity: "Industrial bulk materials",
    product: "Aluminum billets",
    counterparty: "Gulf Industrial Materials",
    region: "GCC",
    status: "Delivery",
    quantityMt: 4200,
    pnlAedK: 515,
    exposureAedM: 18.2,
    costCenter: "TRD-IND-DXB",
    incoterm: "FOB",
    eta: "2026-06-09",
    risk: "Low",
  },
  {
    id: "MTR-2606-127",
    commodity: "Agricultural bulk products",
    product: "Milling wheat",
    counterparty: "Black Sea Grain Co.",
    region: "CIS",
    status: "Contract",
    quantityMt: 27000,
    pnlAedK: 366,
    exposureAedM: 31.4,
    costCenter: "TRD-AGRI-DXB",
    incoterm: "CIF",
    eta: "2026-07-03",
    risk: "High",
  },
  {
    id: "MTR-2606-132",
    commodity: "Fertilizers",
    product: "NPK 15-15-15",
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
    id: "MTR-2606-135",
    commodity: "Industrial bulk materials",
    product: "Copper cathodes",
    counterparty: "Caspian Industrial Supply",
    region: "CIS",
    status: "Shipment",
    quantityMt: 1600,
    pnlAedK: -124,
    exposureAedM: 26.8,
    costCenter: "TRD-IND-DXB",
    incoterm: "DAP",
    eta: "2026-06-27",
    risk: "Watch",
  },
  {
    id: "MTR-2606-141",
    commodity: "Agricultural bulk products",
    product: "Feed barley",
    counterparty: "Levant Grain Partners",
    region: "MENA",
    status: "Delivery",
    quantityMt: 21800,
    pnlAedK: 294,
    exposureAedM: 15.1,
    costCenter: "TRD-AGRI-DXB",
    incoterm: "CFR",
    eta: "2026-06-12",
    risk: "Low",
  },
];

export const shipmentPipeline = [
  { stage: "Contract", trades: 10, valueAedM: 128 },
  { stage: "Shipment", trades: 14, valueAedM: 176 },
  { stage: "Delivery", trades: 8, valueAedM: 88 },
  { stage: "Settled", trades: 19, valueAedM: 132 },
];

export const costCenterRollup = [
  { center: "TRD-FERT-DXB", commodity: "Fertilizers", revenueAedM: 144, costAedM: 131, marginPct: 9.0 },
  { center: "TRD-AGRI-DXB", commodity: "Agricultural bulk products", revenueAedM: 114, costAedM: 108, marginPct: 5.3 },
  { center: "TRD-IND-DXB", commodity: "Industrial bulk materials", revenueAedM: 118, costAedM: 110, marginPct: 6.8 },
  { center: "OPS-LOG-DXB", commodity: "Freight and documentation", revenueAedM: 21, costAedM: 18, marginPct: 14.3 },
];

export const crmFunnel: FunnelStage[] = [
  { stage: "RFQ received", leads: 1260, conversion: 100, color: "#2563eb" },
  { stage: "Qualified counterparty", leads: 812, conversion: 64.4, color: "#0f766e" },
  { stage: "Spec / credit approved", leads: 544, conversion: 43.2, color: "#b45309" },
  { stage: "Offer issued", leads: 376, conversion: 29.8, color: "#be123c" },
  { stage: "Contracted", leads: 146, conversion: 11.6, color: "#4f46e5" },
];

export const counterpartyChannels: ChannelPerformance[] = [
  { name: "Fertilizer distributors", volumeAedM: 186, leads: 164, conversion: 16.5 },
  { name: "Agri co-ops", volumeAedM: 154, leads: 139, conversion: 18.1 },
  { name: "Feed mill buyers", volumeAedM: 141, leads: 122, conversion: 14.8 },
  { name: "Industrial fabricators", volumeAedM: 128, leads: 118, conversion: 13.6 },
  { name: "Government tenders", volumeAedM: 104, leads: 96, conversion: 12.9 },
  { name: "Trading houses", volumeAedM: 92, leads: 88, conversion: 11.4 },
  { name: "Logistics partners", volumeAedM: 76, leads: 74, conversion: 10.8 },
  { name: "Regional importers", volumeAedM: 68, leads: 61, conversion: 9.9 },
  { name: "Food processors", volumeAedM: 61, leads: 58, conversion: 9.2 },
  { name: "Construction suppliers", volumeAedM: 55, leads: 53, conversion: 8.7 },
];

export const destinationGeography: Geography[] = [
  { market: "UAE", region: "GCC", leads: 318, conversion: 11.5, valueAedM: 215 },
  { market: "Saudi Arabia", region: "GCC", leads: 206, conversion: 9.4, valueAedM: 192 },
  { market: "Kenya", region: "East Africa", leads: 188, conversion: 14.8, valueAedM: 174 },
  { market: "India", region: "South Asia", leads: 247, conversion: 9.8, valueAedM: 142 },
  { market: "Kazakhstan", region: "CIS", leads: 136, conversion: 13.9, valueAedM: 118 },
  { market: "Turkey", region: "MENA", leads: 118, conversion: 8.7, valueAedM: 84 },
  { market: "Egypt", region: "North Africa", leads: 106, conversion: 9.4, valueAedM: 92 },
  { market: "China", region: "APAC", leads: 88, conversion: 7.2, valueAedM: 57 },
];

export const productConversion = [
  { product: "Urea", inquiry: 286, qualified: 181, closed: 42 },
  { product: "DAP/MAP", inquiry: 216, qualified: 144, closed: 29 },
  { product: "NPK blends", inquiry: 184, qualified: 119, closed: 27 },
  { product: "Wheat", inquiry: 238, qualified: 151, closed: 31 },
  { product: "Feed grains", inquiry: 196, qualified: 124, closed: 24 },
  { product: "Industrial lots", inquiry: 140, qualified: 86, closed: 18 },
];

export const architectureNodes: ArchitectureNode[] = [
  {
    title: "Trade CRM",
    subtitle: "RFQs, counterparties, price offers, approvals",
    owner: "Commercial operations",
    icon: Handshake,
    tone: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  {
    title: "Trading Ops",
    subtitle: "Contracts, shipments, documents, settlements",
    owner: "Trade operations",
    icon: Ship,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  {
    title: "SAP ERP",
    subtitle: "Cost centers, invoices, inventory, approvals",
    owner: "Finance",
    icon: Factory,
    tone: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  {
    title: "Supabase Postgres",
    subtitle: "Curated analytical schema for demo reporting",
    owner: "Data platform",
    icon: Database,
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  {
    title: "ETL Controls",
    subtitle: "Validation, source mapping, refresh logs",
    owner: "Business analyst",
    icon: GitBranch,
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  {
    title: "Power BI",
    subtitle: "Management dashboards and exception alerts",
    owner: "Leadership",
    icon: BarChart3,
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
];

export const dataFlowSteps = [
  { step: "Extract", detail: "RFQ snapshots, trade tracker, SAP cost centers, shipment files", icon: TableProperties },
  { step: "Transform", detail: "Normalize product, counterparty, shipment-stage, and cost-center keys", icon: Workflow },
  { step: "Validate", detail: "Missing specs, duplicate RFQs, unmatched cost centers, expired offers", icon: ShieldCheck },
  { step: "Load", detail: "Publish star-schema tables into Supabase analytical mart", icon: PackageCheck },
  { step: "Report", detail: "Power BI semantic model with management KPI definitions", icon: LineChart },
];

export const sourceNotes = [
  {
    label: "Operating focus",
    value: "Fertilizers, agricultural bulk products, and industrial bulk materials",
  },
  {
    label: "Job alignment",
    value: "CRM, SAP, Power BI, SQL, ETL, trade execution, documentation",
  },
  {
    label: "Data policy",
    value: "All dashboard values are synthetic and candidate-generated",
  },
  {
    label: "Commercial signal",
    value: "Landed margin, shipment status, cost centers, and counterparty RFQs",
  },
];

export const dashboardKpis = [
  { label: "Open trade exposure", value: "AED 124.8M", delta: "-3.1%", icon: Ship, tone: "text-emerald-700" },
  { label: "Contracted volume", value: "205K MT", delta: "+14.2%", icon: PackageCheck, tone: "text-blue-700" },
  { label: "Weighted margin", value: "7.2%", delta: "+1.1pp", icon: BarChart3, tone: "text-rose-700" },
  { label: "Priority exceptions", value: "19", delta: "-6.4%", icon: MapPinned, tone: "text-amber-700" },
];
