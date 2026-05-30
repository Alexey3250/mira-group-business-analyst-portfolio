"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n";
import { Bar, DeskTitle, Kpi, KpiRow, SectionLabel } from "@/components/desk";
import ExportPdfButton from "@/components/ExportPdfButton";
import {
  brokers,
  handoverTimeline,
  investorGeography,
  projects,
  realEstateKpis,
  type Project,
} from "@/data/miraData";

type Filter = "all" | "dubai" | "international" | "luxury";

const statusPill: Record<Project["statusTone"], string> = {
  pos: "pill-pos",
  warn: "pill-warn",
  neutral: "pill-neutral",
  rose: "pill",
};

export default function RealEstateDesk() {
  const { t, tr } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>("bentley");

  const filtered = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "luxury") return project.tier === "luxury";
    return project.market === filter;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t.realEstate.all },
    { id: "dubai", label: t.realEstate.dubai },
    { id: "international", label: t.realEstate.international },
    { id: "luxury", label: t.realEstate.luxury },
  ];

  return (
    <div className="animate-fade-in">
      <DeskTitle
        title={t.realEstate.title}
        sub={t.realEstate.sub}
        right={
          <ExportPdfButton section="real-estate" />
        }
      />

      <KpiRow>
        {realEstateKpis.map((kpi) => (
          <Kpi key={kpi.label} label={tr(kpi.label)} value={tr(kpi.value)} sub={tr(kpi.sub)} tone={kpi.tone} spark={kpi.spark} />
        ))}
      </KpiRow>

      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="border-b border-line px-5 py-5 sm:px-7 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <SectionLabel className="mb-0">{t.realEstate.projects}</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full border px-3 py-1 text-2xs transition ${
                    filter === item.id ? "border-ink bg-ink text-white" : "border-line text-sub hover:bg-panel"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filtered.map((project) => {
              const open = expanded === project.id;

              return (
                <div key={project.id} className={`overflow-hidden rounded-lg border transition ${open ? "border-sub" : "border-line"}`}>
                  <button onClick={() => setExpanded(open ? null : project.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: project.color }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-ink">
                        {tr(project.name)} - {tr(project.location)}
                      </div>
                      <div className="text-2xs text-sub">
                        {project.brand} / {tr(project.units)} / {project.handover}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="num text-[12px] font-medium text-ink">{tr(project.priceRange)}</span>
                      <span
                        className={statusPill[project.statusTone]}
                        style={project.statusTone === "rose" ? { background: "#fbeaf0", color: "#72243e" } : undefined}
                      >
                        {tr(project.status)}
                      </span>
                    </div>
                    <ChevronDown className={open ? "h-4 w-4 shrink-0 rotate-180 text-faint transition" : "h-4 w-4 shrink-0 text-faint transition"} />
                  </button>

                  {open && (
                    <div className="border-t border-line px-4 pb-4 pt-3">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <MiniStat label={t.realEstate.estUnits} value={tr(project.units)} />
                        <MiniStat label={t.realEstate.unitsSold} value={tr(project.unitsSold)} />
                        <MiniStat label={t.realEstate.entry} value={tr(project.entry)} />
                        <MiniStat label={t.realEstate.buyer} value={tr(project.buyer)} />
                      </div>
                      <div className="mt-3">
                        <Bar pct={project.progress} color={project.color} />
                        <div className="mt-1 flex justify-between text-2xs text-sub">
                          <span>{t.realEstate.construction}</span>
                          <span>{project.progress}%</span>
                        </div>
                      </div>
                      <p className="mt-3 text-2xs leading-relaxed text-sub">{tr(project.note)}</p>
                      {project.dataFlag && (
                        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-warn-bg px-2.5 py-1.5 text-2xs leading-relaxed text-warn">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                          {tr(project.dataFlag)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <SectionLabel>{t.realEstate.brokers}</SectionLabel>
          <div className="mb-6 divide-y divide-line">
            {brokers.map((broker) => (
              <div key={broker.initials} className="flex items-center gap-2.5 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel text-[9px] font-semibold text-sub">{broker.initials}</span>
                <span className="flex-1 text-2xs text-ink">{tr(broker.name)}</span>
                <div className="w-14">
                  <Bar pct={broker.pct} color="#378add" />
                </div>
                <span className="num w-14 text-right text-2xs font-medium text-sub">{broker.volume}</span>
              </div>
            ))}
          </div>

          <SectionLabel>{t.realEstate.geography}</SectionLabel>
          <div className="mb-6 divide-y divide-line">
            {investorGeography.map((geo) => (
              <div key={geo.label} className="flex items-center gap-2.5 py-1.5">
                <span className="w-5 text-sm">{geo.flag}</span>
                <span className="flex-1 text-2xs text-sub">{tr(geo.label)}</span>
                <div className="w-12">
                  <Bar pct={geo.bar} color={geo.color} />
                </div>
                <span className="num w-7 text-right text-2xs font-medium text-ink">{geo.pct}%</span>
              </div>
            ))}
          </div>

          <SectionLabel>{t.realEstate.timeline}</SectionLabel>
          <div className="space-y-0">
            {handoverTimeline.map((item, index) => (
              <div key={item.quarter} className="flex gap-2.5">
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2 w-2 rounded-full" style={{ background: item.color }} />
                  {index < handoverTimeline.length - 1 && <span className="my-0.5 w-px flex-1 bg-line" />}
                </div>
                <div className="pb-3">
                  <div className="text-2xs font-medium text-ink">{item.quarter}</div>
                  <div className="text-2xs text-sub">{tr(item.label)}</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/crm" className="mt-4 flex w-full items-center justify-center rounded-md border border-line py-2 text-2xs text-sub transition hover:bg-panel">
            {t.crm.title}
          </Link>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-panel px-2.5 py-2">
      <div className="text-2xs text-sub">{label}</div>
      <div className="mt-0.5 text-[13px] font-medium text-ink">{value}</div>
    </div>
  );
}
