"use client";

import { useMemo } from "react";
import { CircleDollarSign, PackageCheck, PieChart as PieIcon } from "lucide-react";
import {
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
import { supplyPortfolio } from "@/data/operationsData";
import {
  ChartFrame,
  Panel,
  Stat,
  chartColors,
  tooltipStyle,
} from "./shared";

export default function SupplyPortfolioTab() {
  const backingMix = useMemo(
    () => [
      {
        name: "Supplier-backed",
        value: Math.round(
          supplyPortfolio.reduce((sum, item) => sum + item.supplierBackedPct, 0) /
            supplyPortfolio.length
        ),
      },
      {
        name: "Customer-backed",
        value: Math.round(
          supplyPortfolio.reduce((sum, item) => sum + item.customerBackedPct, 0) /
            supplyPortfolio.length
        ),
      },
    ],
    []
  );

  const productChart = supplyPortfolio.map((item) => ({
    product: shortProductName(item.name),
    contracted: item.contractedMt,
    shipped: item.shippedMt,
    inTransit: item.inTransitMt,
    open: item.openMt,
    revenue: item.revenueAedM,
  }));

  return (
    <div className="grid gap-5">
      <section className="grid supply-grid gap-3">
        {supplyPortfolio.map((item) => (
          <ProductCard key={item.name} item={item} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Contracted, shipped, in-transit, and open MT" eyebrow="Bulk supply portfolio" icon={PackageCheck}>
          <ChartFrame className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productChart} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="product" tick={{ fontSize: 12 }} interval={0} height={58} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="shipped" stackId="mt" name="Shipped MT" fill={chartColors.sold} radius={[4, 4, 0, 0]} />
                <Bar dataKey="inTransit" stackId="mt" name="In transit MT" fill={chartColors.reserved} />
                <Bar dataKey="open" stackId="mt" name="Open MT" fill={chartColors.available} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>

        <Panel title="Supplier-backed versus customer-backed volume" eyebrow="Commercial coverage" icon={PieIcon}>
          <ChartFrame className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={backingMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={112}
                  paddingAngle={4}
                >
                  <Cell fill={chartColors.coverage} />
                  <Cell fill={chartColors.direct} />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Panel>
      </section>

      <Panel title="Revenue and service reliability by product family" eyebrow="Management view" icon={CircleDollarSign}>
        <ChartFrame className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={productChart.map((item, index) => ({
                ...item,
                serviceLevel: supplyPortfolio[index].serviceLevelPct,
              }))}
              margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="product" tick={{ fontSize: 12 }} interval={0} height={58} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue AED M" fill={chartColors.revenue} radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" dataKey="serviceLevel" name="Service level %" stroke={chartColors.sold} strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartFrame>
      </Panel>
    </div>
  );
}

function ProductCard({ item }: { item: (typeof supplyPortfolio)[number] }) {
  const shippedPct = Math.round((item.shippedMt / item.contractedMt) * 100);
  const transitPct = Math.round((item.inTransitMt / item.contractedMt) * 100);
  const openPct = Math.max(0, 100 - shippedPct - transitPct);

  return (
    <article className="content-auto rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
            {item.category}
          </p>
          <h2 className="mt-1 text-base font-semibold leading-6 text-slate-950">
            {item.name}
          </h2>
        </div>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          {item.planningWindow}
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{item.supplyRoute}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Stat label="Shipped" value={`${formatMt(item.shippedMt)} MT`} />
        <Stat label="In transit" value={`${formatMt(item.inTransitMt)} MT`} />
        <Stat label="Open" value={`${formatMt(item.openMt)} MT`} />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>{item.primaryUse}</span>
          <span>{shippedPct}% shipped</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-md bg-slate-200">
          <div className="bg-blue-600" style={{ width: `${shippedPct}%` }} />
          <div className="bg-amber-600" style={{ width: `${transitPct}%` }} />
          <div className="bg-slate-500" style={{ width: `${openPct}%` }} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Stat label="Revenue" value={`AED ${item.revenueAedM}M`} />
        <Stat label="Service" value={`${item.serviceLevelPct}%`} />
      </div>
    </article>
  );
}

function shortProductName(name: string) {
  return name
    .replace("Granular ", "")
    .replace(" / MAP phosphates", "/MAP")
    .replace(" and barley", "/barley")
    .replace("Aluminum, copper, steel lots", "Industrial");
}

function formatMt(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value);
}
