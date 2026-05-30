"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  DatabaseZap,
  Factory,
  Filter,
  GitBranch,
  Globe2,
  Handshake,
  Layers3,
  MapPinned,
  PackageCheck,
  PieChart as PieIcon,
  Ship,
  TableProperties,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  architectureNodes,
  brokerPerformance,
  costCenterRollup,
  crmFunnel,
  dashboardKpis,
  dataFlowSteps,
  investorGeography,
  projectConversion,
  projectPortfolio,
  shipmentPipeline,
  sourceNotes,
  tradePositions,
} from "./data/operationsData";

type TabKey = "realEstate" | "trading" | "crm" | "architecture";

type Tab = {
  id: TabKey;
  label: string;
  icon: LucideIcon;
};

const tabs: Tab[] = [
  { id: "realEstate", label: "Real Estate Pipeline", icon: Building2 },
  { id: "trading", label: "Commodities Desk", icon: Ship },
  { id: "crm", label: "CRM Funnel", icon: Handshake },
  { id: "architecture", label: "Data Architecture", icon: GitBranch },
];

const chartColors = {
  sold: "#2563eb",
  reserved: "#d97706",
  available: "#64748b",
  revenue: "#0f766e",
  direct: "#be123c",
  broker: "#4f46e5",
  grid: "#e2e8f0",
};

const formatAed = (value: number) => {
  if (value >= 1000000) {
    return `AED ${(value / 1000000).toFixed(value >= 10000000 ? 1 : 2)}M`;
  }

  return `AED ${Math.round(value / 1000)}K`;
};

const tooltipStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  color: "#172033",
};

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("realEstate");

  const totals = useMemo(() => {
    const units = projectPortfolio.reduce(
      (acc, project) => {
        acc.total += project.totalUnits;
        acc.sold += project.sold;
        acc.reserved += project.reserved;
        acc.available += project.available;
        acc.revenue += project.revenueAedM;
        return acc;
      },
      { total: 0, sold: 0, reserved: 0, available: 0, revenue: 0 }
    );

    const trade = tradePositions.reduce(
      (acc, position) => {
        acc.pnl += position.pnlAedK;
        acc.exposure += position.exposureAedM;
        return acc;
      },
      { pnl: 0, exposure: 0 }
    );

    return { units, trade };
  }, []);

  return (
    <main className="min-h-screen bg-[#eef2f7] text-slate-900">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="grid gap-4 border-b border-slate-300 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-normal text-slate-600">
              <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-200">
                Candidate BA Portfolio
              </span>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-emerald-200">
                Synthetic demo data
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
              Mira Group Operations Intelligence Platform
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Multi-entity dashboard concept aligning real estate sales, commodity
              trading operations, CRM funnel control, and CRM to SAP to BI data
              architecture for a Dubai business analyst role.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:w-[560px]">
            <HeaderFact label="Units tracked" value={totals.units.total.toLocaleString()} />
            <HeaderFact label="Sold units" value={totals.units.sold.toLocaleString()} />
            <HeaderFact label="Reserved" value={totals.units.reserved.toLocaleString()} />
            <HeaderFact label="Available" value={totals.units.available.toLocaleString()} />
          </div>
        </header>

        <section className="grid metric-grid gap-3">
          {dashboardKpis.map((kpi) => (
            <MetricCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <nav className="grid gap-2 rounded-lg bg-white p-2 shadow-panel ring-1 ring-slate-200 md:grid-cols-4">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>

        {activeTab === "realEstate" && <RealEstateTab />}
        {activeTab === "trading" && <TradingTab />}
        {activeTab === "crm" && <CrmTab />}
        {activeTab === "architecture" && <ArchitectureTab />}

        <section className="grid gap-3 border-t border-slate-300 pt-5 md:grid-cols-4">
          {sourceNotes.map((note) => (
            <div
              key={note.label}
              className="rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200"
            >
              <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                {note.label}
              </p>
              <p className="mt-2 text-sm font-medium leading-5 text-slate-900">
                {note.value}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function HeaderFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3 shadow-panel ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: string;
}) {
  const positive = !delta.startsWith("-");

  return (
    <article className="rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
            positive
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {delta}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
        {value}
      </p>
    </article>
  );
}

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: Tab;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{tab.label}</span>
    </button>
  );
}

function Panel({
  title,
  eyebrow,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-base font-semibold text-slate-950">{title}</h2>
        </div>
        <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

function ChartFrame({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={`min-w-0 ${className}`}>
      {ready ? (
        children
      ) : (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500">
          Loading chart
        </div>
      )}
    </div>
  );
}

function RealEstateTab() {
  const channelData = useMemo(
    () => [
      {
        name: "Broker channel",
        value: Math.round(
          projectPortfolio.reduce((sum, project) => sum + project.brokerPct, 0) /
            projectPortfolio.length
        ),
      },
      {
        name: "Direct sales",
        value: Math.round(
          projectPortfolio.reduce((sum, project) => sum + project.directPct, 0) /
            projectPortfolio.length
        ),
      },
    ],
    []
  );

  const projectChart = projectPortfolio.map((project) => ({
    project: shortProjectName(project.name),
    sold: project.sold,
    reserved: project.reserved,
    available: project.available,
    revenue: project.revenueAedM,
  }));

  return (
    <div className="grid gap-5">
      <section className="grid project-grid gap-3">
        {projectPortfolio.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Units sold, reserved, and available" eyebrow="Project inventory" icon={Building2}>
          <ChartFrame className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChart} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="project" tick={{ fontSize: 12 }} interval={0} height={58} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="sold" stackId="units" fill={chartColors.sold} radius={[4, 4, 0, 0]} />
                <Bar dataKey="reserved" stackId="units" fill={chartColors.reserved} />
                <Bar dataKey="available" stackId="units" fill={chartColors.available} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>

        <Panel title="Broker channel versus direct sales" eyebrow="Go-to-market mix" icon={PieIcon}>
          <ChartFrame className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={4}
                >
                  <Cell fill={chartColors.broker} />
                  <Cell fill={chartColors.direct} />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>
      </section>

      <Panel title="Revenue and handover timeline" eyebrow="Management view" icon={CircleDollarSign}>
        <ChartFrame className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projectChart}
              margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="project" tick={{ fontSize: 12 }} interval={0} height={58} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue AED M" fill={chartColors.revenue} radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" dataKey="sold" name="Sold units" stroke={chartColors.sold} strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartFrame>
      </Panel>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projectPortfolio)[number] }) {
  const soldPct = Math.round((project.sold / project.totalUnits) * 100);
  const reservedPct = Math.round((project.reserved / project.totalUnits) * 100);
  const availablePct = Math.max(0, 100 - soldPct - reservedPct);

  return (
    <article className="rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
            {project.location}
          </p>
          <h2 className="mt-1 text-base font-semibold leading-6 text-slate-950">
            {project.name}
          </h2>
        </div>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          {project.handover}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Stat label="Sold" value={project.sold.toLocaleString()} />
        <Stat label="Reserved" value={project.reserved.toLocaleString()} />
        <Stat label="Available" value={project.available.toLocaleString()} />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>{project.brandPartner}</span>
          <span>{soldPct}% sold</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-md bg-slate-200">
          <div className="bg-blue-600" style={{ width: `${soldPct}%` }} />
          <div className="bg-amber-600" style={{ width: `${reservedPct}%` }} />
          <div className="bg-slate-500" style={{ width: `${availablePct}%` }} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Stat label="Revenue" value={`AED ${project.revenueAedM}M`} />
        <Stat label="From" value={formatAed(project.startingPriceAed)} />
      </div>
    </article>
  );
}

function TradingTab() {
  const exposureByCommodity = ["Fertilizers", "Metals", "Grains"].map((commodity) => {
    const related = tradePositions.filter((position) => position.commodity === commodity);
    return {
      commodity,
      exposure: Number(related.reduce((sum, position) => sum + position.exposureAedM, 0).toFixed(1)),
      pnl: related.reduce((sum, position) => sum + position.pnlAedK, 0),
    };
  });

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Open positions tracker" eyebrow="Trading desk" icon={Ship}>
          <div className="overflow-x-auto mini-scrollbar">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-normal text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Trade</th>
                  <th className="py-2 pr-3 font-semibold">Commodity</th>
                  <th className="py-2 pr-3 font-semibold">Counterparty</th>
                  <th className="py-2 pr-3 font-semibold">Stage</th>
                  <th className="py-2 pr-3 font-semibold">MT</th>
                  <th className="py-2 pr-3 font-semibold">P&L AED K</th>
                  <th className="py-2 pr-3 font-semibold">Exposure</th>
                  <th className="py-2 pr-3 font-semibold">Cost center</th>
                  <th className="py-2 pr-3 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {tradePositions.map((position) => (
                  <tr key={position.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-3 font-semibold text-slate-950">{position.id}</td>
                    <td className="py-3 pr-3">
                      <div className="font-medium">{position.commodity}</div>
                      <div className="text-xs text-slate-500">{position.product}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-medium">{position.counterparty}</div>
                      <div className="text-xs text-slate-500">{position.region} / {position.incoterm}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge label={position.status} />
                    </td>
                    <td className="py-3 pr-3">{position.quantityMt.toLocaleString()}</td>
                    <td className={`py-3 pr-3 font-semibold ${position.pnlAedK < 0 ? "text-rose-700" : "text-emerald-700"}`}>
                      {position.pnlAedK.toLocaleString()}
                    </td>
                    <td className="py-3 pr-3">AED {position.exposureAedM.toFixed(1)}M</td>
                    <td className="py-3 pr-3 font-mono text-xs">{position.costCenter}</td>
                    <td className="py-3 pr-3">
                      <RiskBadge risk={position.risk} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Shipment status pipeline" eyebrow="Contract to settlement" icon={PackageCheck}>
          <ChartFrame className="h-[338px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shipmentPipeline} layout="vertical" margin={{ left: 18, right: 18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} width={76} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="valueAedM" name="Value AED M" fill={chartColors.sold} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="P&L and counterparty exposure" eyebrow="Commodity risk" icon={TrendingUp}>
          <ChartFrame className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={exposureByCommodity} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="commodity" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar yAxisId="left" dataKey="exposure" name="Exposure AED M" fill={chartColors.reserved} radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" dataKey="pnl" name="P&L AED K" stroke={chartColors.revenue} strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>

        <Panel title="SAP-style cost center rollup" eyebrow="Finance reconciliation" icon={Factory}>
          <div className="space-y-3">
            {costCenterRollup.map((center) => (
              <div key={center.center} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-semibold text-slate-500">{center.center}</p>
                    <p className="font-semibold text-slate-950">{center.commodity}</p>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    {center.marginPct}% margin
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Stat label="Revenue" value={`AED ${center.revenueAedM}M`} />
                  <Stat label="Cost" value={`AED ${center.costAedM}M`} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function CrmTab() {
  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Lead pipeline" eyebrow="Inquiry to close" icon={Filter}>
          <div className="space-y-3">
            {crmFunnel.map((stage, index) => (
              <div key={stage.stage}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-950">{stage.stage}</span>
                  <span className="text-slate-500">
                    {stage.leads.toLocaleString()} / {stage.conversion}%
                  </span>
                </div>
                <div className="h-8 rounded-lg bg-slate-100">
                  <div
                    className="flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-white"
                    style={{
                      width: `${Math.max(stage.conversion, 8)}%`,
                      background: stage.color,
                    }}
                  >
                    Stage {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Conversion rates by project" eyebrow="Project-level funnel" icon={Layers3}>
          <ChartFrame className="h-[338px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectConversion} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="inquiry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.sold} stopOpacity={0.38} />
                    <stop offset="95%" stopColor={chartColors.sold} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="project" tick={{ fontSize: 12 }} interval={0} height={54} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="inquiry" name="Inquiry" stroke={chartColors.sold} fill="url(#inquiry)" />
                <Line type="monotone" dataKey="qualified" name="Qualified" stroke={chartColors.revenue} strokeWidth={3} />
                <Line type="monotone" dataKey="closed" name="Closed" stroke={chartColors.direct} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Broker network performance" eyebrow="Top 10 by volume" icon={Handshake}>
          <ChartFrame className="h-[390px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={brokerPerformance}
                layout="vertical"
                margin={{ top: 6, right: 18, left: 72, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={142} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="volumeAedM" name="Volume AED M" fill={chartColors.revenue} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>

        <Panel title="Investor geography heatmap" eyebrow="CIS-heavy demand signal" icon={Globe2}>
          <div className="grid grid-cols-2 gap-3">
            {investorGeography.map((market) => (
              <div
                key={market.market}
                className="rounded-lg border border-slate-200 p-3"
                style={{ backgroundColor: heatColor(market.valueAedM) }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-950">{market.market}</p>
                    <p className="text-xs text-slate-600">{market.region}</p>
                  </div>
                  <MapPinned className="h-4 w-4 text-slate-600" aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <Stat label="Leads" value={market.leads.toString()} />
                  <Stat label="Conv." value={`${market.conversion}%`} />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  AED {market.valueAedM}M pipeline
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div className="grid gap-5">
      <section className="grid architecture-grid gap-3">
        {architectureNodes.map((node) => {
          const Icon = node.icon;

          return (
            <article key={node.title} className="rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
              <div className={`mb-4 inline-flex rounded-lg p-2 ring-1 ${node.tone}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-slate-950">{node.title}</h2>
              <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{node.subtitle}</p>
              <p className="mt-3 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                Owner: {node.owner}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="CRM to SAP to Power BI data flow" eyebrow="Integration layer" icon={DatabaseZap}>
          <div className="grid gap-3 md:grid-cols-5">
            {dataFlowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.step} className="relative rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <Icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-950">{step.step}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{step.detail}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="grid gap-3 text-sm font-semibold text-slate-700 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <FlowBox label="CRM" sublabel="Lead and broker events" />
              <span className="hidden text-slate-400 md:block">-&gt;</span>
              <FlowBox label="SAP ERP" sublabel="Cost centers and finance" />
              <span className="hidden text-slate-400 md:block">-&gt;</span>
              <FlowBox label="Power BI" sublabel="Management semantic model" />
            </div>
          </div>
        </Panel>

        <Panel title="Business analyst documentation pack" eyebrow="Role evidence" icon={TableProperties}>
          <div className="space-y-3">
            <ChecklistItem label="Requirements matrix" detail="Business, functional, and non-functional requirements with acceptance criteria." />
            <ChecklistItem label="Data dictionary" detail="CRM, SAP, trade, project, broker, and investor geography fields." />
            <ChecklistItem label="Data flow diagram" detail="System owners, integration points, validation controls, refresh ownership." />
            <ChecklistItem label="User guidelines" detail="Manager dashboard usage, KPI definitions, data-quality escalation path." />
            <ChecklistItem label="ETL rules" detail="Join keys, status mapping, cost-center rollup, exception queue logic." />
          </div>
        </Panel>
      </section>
    </div>
  );
}

function FlowBox({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{sublabel}</p>
    </div>
  );
}

function ChecklistItem({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 p-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
      <div>
        <p className="font-semibold text-slate-950">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const classes: Record<string, string> = {
    Contract: "bg-blue-50 text-blue-700 ring-blue-200",
    Shipment: "bg-amber-50 text-amber-700 ring-amber-200",
    Delivery: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Settled: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${classes[label]}`}>
      {label}
    </span>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const classes: Record<string, string> = {
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Watch: "bg-amber-50 text-amber-700 ring-amber-200",
    High: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return (
    <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ${classes[risk]}`}>
      {risk}
    </span>
  );
}

function shortProjectName(name: string) {
  return name
    .replace(" designed by Bentley Home", "")
    .replace(" Residences Phase II", " II")
    .replace("POST Hotel & Residences by ", "")
    .replace("Gianfranco Ferre Residences", "Ferre RAK");
}

function heatColor(valueAedM: number) {
  if (valueAedM > 300) return "#bfdbfe";
  if (valueAedM > 180) return "#ccfbf1";
  if (valueAedM > 100) return "#fde68a";
  return "#f1f5f9";
}

export default App;
