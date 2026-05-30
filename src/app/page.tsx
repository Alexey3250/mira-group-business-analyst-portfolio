import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import LiveMarketSignals from "@/components/dashboard/LiveMarketSignals";
import {
  dashboardKpis,
  projectPortfolio,
  sourceNotes,
} from "@/data/operationsData";

export default function Home() {
  const totals = projectPortfolio.reduce(
    (acc, project) => {
      acc.total += project.totalUnits;
      acc.sold += project.sold;
      acc.reserved += project.reserved;
      acc.available += project.available;
      return acc;
    },
    { total: 0, sold: 0, reserved: 0, available: 0 }
  );

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
            <HeaderFact label="Units tracked" value={totals.total.toLocaleString()} />
            <HeaderFact label="Sold units" value={totals.sold.toLocaleString()} />
            <HeaderFact label="Reserved" value={totals.reserved.toLocaleString()} />
            <HeaderFact label="Available" value={totals.available.toLocaleString()} />
          </div>
        </header>

        <section className="grid metric-grid gap-3">
          {dashboardKpis.map((kpi) => (
            <MetricCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <LiveMarketSignals />

        <DashboardTabs />

        <section className="grid gap-3 border-t border-slate-300 pt-5 md:grid-cols-4">
          {sourceNotes.map((note) => (
            <div
              key={note.label}
              className="content-auto rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200"
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

export const dynamic = "force-static";
export const revalidate = 86400;

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
