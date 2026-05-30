"use client";

import { useMemo } from "react";
import { Building2, CircleDollarSign, PieChart as PieIcon } from "lucide-react";
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
import { projectPortfolio } from "@/data/operationsData";
import {
  ChartFrame,
  Panel,
  Stat,
  chartColors,
  formatAed,
  tooltipStyle,
} from "./shared";

export default function RealEstateTab() {
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
    <article className="content-auto rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
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

function shortProjectName(name: string) {
  return name
    .replace(" designed by Bentley Home", "")
    .replace(" Residences Phase II", " II")
    .replace("POST Hotel & Residences by ", "")
    .replace("Gianfranco Ferre Residences", "Ferre RAK");
}
