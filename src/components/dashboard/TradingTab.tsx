"use client";

import { Factory, PackageCheck, Ship, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  costCenterRollup,
  shipmentPipeline,
  tradePositions,
} from "@/data/operationsData";
import {
  ChartFrame,
  Panel,
  RiskBadge,
  Stat,
  StatusBadge,
  chartColors,
  tooltipStyle,
} from "./shared";

export default function TradingTab() {
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
