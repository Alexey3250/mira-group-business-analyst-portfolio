"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CandlestickChart,
  RefreshCw,
  Users,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { Bar, DeskTitle, Funnel, Kpi, KpiRow, SectionLabel } from "@/components/desk";
import AnalystCard from "@/components/AnalystCard";
import ExportPdfButton from "@/components/ExportPdfButton";
import {
  commodityExposure,
  crmFunnel,
  groupActivity,
  groupKpis,
  priceFeed,
  projects,
  systemChips,
} from "@/data/miraData";

const activityIcon = {
  building: Building2,
  trade: CandlestickChart,
  users: Users,
  alert: AlertTriangle,
  ship: CandlestickChart,
  invoice: CandlestickChart,
  receipt: CandlestickChart,
};

export default function OverviewDesk() {
  const { t, tr } = useI18n();

  return (
    <div className="animate-fade-in">
      <DeskTitle
        title={t.overview.title}
        sub={t.overview.sub}
        right={
          <>
            <ExportPdfButton section="overview" />
            <button className="ghost-btn">
              <RefreshCw className="h-3.5 w-3.5" />
              {t.nav.refresh}
            </button>
          </>
        }
      />

      <KpiRow>
        {groupKpis.map((kpi) => (
          <Kpi key={kpi.label} label={tr(kpi.label)} value={tr(kpi.value)} sub={tr(kpi.sub)} tone={kpi.tone} spark={kpi.spark} />
        ))}
      </KpiRow>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_336px]">
        {/* Main column — commodities-led */}
        <section className="space-y-7 border-b border-line px-5 py-6 sm:px-7 lg:border-b-0 lg:border-r">
          {/* Commodities & trading */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <SectionLabel className="mb-0">{t.overview.commodities}</SectionLabel>
              <Link href="/commodities" className="inline-flex items-center gap-1 text-2xs font-medium text-c-blue hover:underline">
                {t.overview.commoditiesLink}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {priceFeed.map((commodity) => (
                <div key={commodity.name} className="rounded-lg border border-line p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-2xs font-medium text-ink">{tr(commodity.name)}</span>
                    <span className={commodity.changePct >= 0 ? "pill-pos" : "pill-neg"}>
                      {commodity.changePct >= 0 ? "+" : "-"}
                      {Math.abs(commodity.changePct)}%
                    </span>
                  </div>
                  <div className="num text-[16px] font-semibold text-ink">{commodity.price}</div>
                  <div className="truncate text-2xs text-sub">{tr(commodity.unit)}</div>
                  <svg className="mt-2 h-8 w-full" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden>
                    <polyline
                      points={commodity.spark}
                      fill="none"
                      stroke={commodity.changePct >= 0 ? "#1d9e75" : "#d85a30"}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="sec-label mb-2.5">{t.overview.openTrades}</div>
              <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {commodityExposure.map((exposure) => (
                  <div key={exposure.name} className="flex items-center gap-2.5">
                    <span className="w-24 shrink-0 text-2xs text-sub">{tr(exposure.name)}</span>
                    <div className="flex-1">
                      <Bar pct={exposure.bar} color={exposure.color} />
                    </div>
                    <span className="num w-14 shrink-0 text-right text-2xs font-medium text-ink">{exposure.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development portfolio */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <SectionLabel className="mb-0">{t.overview.portfolio}</SectionLabel>
              <Link href="/real-estate" className="inline-flex items-center gap-1 text-2xs font-medium text-c-blue hover:underline">
                {t.overview.portfolioLink}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-line">
              {projects.slice(0, 6).map((project) => (
                <Link key={project.id} href="/real-estate" className="group flex items-center gap-3.5 py-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: project.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-ink group-hover:text-c-blue">{tr(project.name)}</div>
                    <div className="text-2xs text-sub">
                      {project.brand} / {tr(project.location)} / {project.handover}
                    </div>
                  </div>
                  <div className="hidden w-20 shrink-0 sm:block">
                    <Bar pct={project.progress} color={project.color} />
                    <div className="mt-0.5 text-right text-2xs text-sub">{project.progress}%</div>
                  </div>
                  <div className="num w-20 shrink-0 text-right text-[12px] font-medium text-ink">
                    {project.priceRange.split(" ")[0]} {project.priceRange.split(" ")[1]}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div>
            <SectionLabel>{t.overview.activity}</SectionLabel>
            <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {groupActivity.map((activity, index) => {
                const Icon = activityIcon[activity.icon];
                return (
                  <div key={`${activity.bold}-${index}`} className="flex gap-2.5 border-b border-line py-2.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-panel text-sub">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <div className="text-2xs leading-relaxed text-sub">
                        <strong className="font-medium text-ink">{tr(activity.bold)}</strong> - {tr(activity.text)}
                      </div>
                      <div className="mt-0.5 text-2xs text-faint">{tr(activity.time)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right rail — profile, funnel, systems */}
        <aside className="px-5 py-6 sm:px-7">
          <AnalystCard className="mb-6" />

          <SectionLabel>{t.overview.funnel}</SectionLabel>
          <div className="mb-6">
            <Funnel stages={crmFunnel.map((stage) => ({ ...stage, stage: tr(stage.stage) }))} />
          </div>

          <SectionLabel>{t.overview.systems}</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {systemChips.map((system) => (
              <span key={system.label} className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-2xs text-sub">
                <span className={`h-1.5 w-1.5 rounded-full ${system.tone === "warn" ? "bg-[#ba7517]" : "bg-[#639922]"}`} />
                {tr(system.label)}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
