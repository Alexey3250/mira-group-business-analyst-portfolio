"use client";

import { Filter, Globe2, Handshake, Layers3, MapPinned } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  brokerPerformance,
  crmFunnel,
  investorGeography,
  projectConversion,
} from "@/data/operationsData";
import {
  ChartFrame,
  Panel,
  Stat,
  chartColors,
  tooltipStyle,
} from "./shared";

export default function CrmTab() {
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

function heatColor(valueAedM: number) {
  if (valueAedM > 300) return "#bfdbfe";
  if (valueAedM > 180) return "#ccfbf1";
  if (valueAedM > 100) return "#fde68a";
  return "#f1f5f9";
}
