"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  FileText,
  Receipt,
  Ship,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { Bar, DeskTitle, Kpi, KpiRow, SectionLabel } from "@/components/desk";
import CommodityLiveSignals from "@/components/dashboard/CommodityLiveSignals";
import ExportPdfButton from "@/components/ExportPdfButton";
import {
  commodityExposure,
  priceFeed,
  sapStatus,
  shipmentStages,
  tradeActivity,
  tradeBlotter,
  tradingKpis,
  type Trade,
} from "@/data/miraData";

type Filter = "all" | "open" | "pending";

const CommodityPredictionSignal = dynamic(() => import("@/components/dashboard/CommodityPredictionSignal"), {
  loading: () => <section className="panel h-[220px] animate-pulse" />,
  ssr: false,
});

const statusPill: Record<Trade["status"], string> = {
  open: "pill-info",
  confirmed: "pill-pos",
  pending: "pill-warn",
  settled: "pill-neutral",
  hedged: "pill-violet",
};

const activityIcon = {
  ship: Ship,
  invoice: FileText,
  receipt: Receipt,
  alert: AlertCircle,
  building: Ship,
  trade: Ship,
  users: Ship,
};

export default function CommoditiesDesk() {
  const { t, tr } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const rows = tradeBlotter.filter((row) => (filter === "all" ? true : row.status === filter));

  return (
    <div className="animate-fade-in">
      <DeskTitle
        title={t.trading.title}
        sub={t.trading.sub}
        right={
          <>
            <ExportPdfButton section="commodities" />
            <span className="pill-pos">
              <span className="h-1.5 w-1.5 rounded-full bg-[#639922]" />
              {t.trading.marketOpen}
            </span>
          </>
        }
      />

      <KpiRow>
        {tradingKpis.map((kpi) => (
          <Kpi
            key={kpi.label}
            label={tr(kpi.label)}
            value={tr(kpi.value)}
            sub={tr(kpi.sub)}
            tone={kpi.tone}
            spark={kpi.spark}
            valueTone={kpi.label.includes("P&L") ? "pos" : undefined}
          />
        ))}
      </KpiRow>

      {/* Reconciliation alert */}
      <div className="border-b border-line px-5 py-3 sm:px-7">
        <div className="flex items-start gap-2 rounded-md bg-warn-bg px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
          <p className="text-2xs leading-relaxed text-warn">{t.trading.alert}</p>
        </div>
      </div>

      <div className="space-y-10 px-5 py-7 sm:px-7">
        {/* ZONE 1 — Market intelligence */}
        <section className="space-y-4">
          <ZoneHeader n={1} title={t.trading.zoneMarket} />
          <CommodityLiveSignals />

          <div className="space-y-5">
            <div>
              <SectionLabel>{t.trading.priceFeed}</SectionLabel>
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                {priceFeed.map((commodity) => (
                  <div key={commodity.name} className="rounded-lg border border-line p-3.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-2xs font-medium text-ink">{tr(commodity.name)}</span>
                      <span className={commodity.changePct >= 0 ? "pill-pos" : "pill-neg"}>
                        {commodity.changePct >= 0 ? "+" : "-"}
                        {Math.abs(commodity.changePct)}%
                      </span>
                    </div>
                    <div className="num text-lg font-semibold text-ink">{commodity.price}</div>
                    <div className="mb-2 text-2xs text-sub">{tr(commodity.unit)}</div>
                    <svg className="h-9 w-full" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden>
                      <polyline
                        points={commodity.spark}
                        fill="none"
                        stroke={commodity.changePct >= 0 ? "#1d9e75" : "#d85a30"}
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            <CommodityPredictionSignal />
          </div>
        </section>

        {/* ZONE 2 — Trading book */}
        <section className="space-y-4">
          <ZoneHeader n={2} title={t.trading.zoneBook} />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="panel p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <SectionLabel className="mb-0">{t.trading.blotter}</SectionLabel>
                <div className="flex gap-1.5">
                  {(["all", "open", "pending"] as Filter[]).map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-md border px-2.5 py-1 text-2xs transition ${
                        filter === item ? "border-ink bg-ink text-white" : "border-line text-sub hover:bg-panel"
                      }`}
                    >
                      {item === "all" ? t.trading.all : item === "open" ? t.trading.open : t.trading.pending}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto mini-scrollbar">
                <table className="w-full min-w-[820px] text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-line">
                      <Th>{t.trading.cols.contract}</Th>
                      <Th>{t.trading.cols.commodity}</Th>
                      <Th>{t.trading.cols.direction}</Th>
                      <Th>{t.trading.cols.volume}</Th>
                      <Th>{t.trading.cols.price}</Th>
                      <Th>{t.trading.cols.counterparty}</Th>
                      <Th>{t.trading.cols.status}</Th>
                      <Th right>{t.trading.cols.pnl}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-b border-line/60 transition hover:bg-panel">
                        <td className="num py-2.5 pr-3 text-2xs text-sub">{row.id}</td>
                        <td className="py-2.5 pr-3 font-medium text-ink">{tr(row.commodity)}</td>
                        <td className="py-2.5 pr-3">
                          <span className={`text-2xs font-semibold ${row.direction === "BUY" ? "text-pos" : "text-neg"}`}>{tr(row.direction)}</span>
                        </td>
                        <td className="num py-2.5 pr-3 text-sub">{row.volume}</td>
                        <td className="num py-2.5 pr-3 text-sub">{row.price}</td>
                        <td className="py-2.5 pr-3 text-2xs text-sub">{row.counterparty}</td>
                        <td className="py-2.5 pr-3">
                          <span className={statusPill[row.status]}>{tr(row.statusLabel)}</span>
                        </td>
                        <td className={`num py-2.5 text-right font-medium ${row.positive ? "text-pos" : "text-neg"}`}>{row.pnl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="panel p-4">
                <SectionLabel>{t.trading.exposure}</SectionLabel>
                <div className="divide-y divide-line">
                  {commodityExposure.map((exposure) => (
                    <div key={exposure.name} className="flex items-center gap-2.5 py-2">
                      <span className="w-20 shrink-0 text-2xs text-sub">{tr(exposure.name)}</span>
                      <div className="flex-1">
                        <Bar pct={exposure.bar} color={exposure.color} />
                      </div>
                      <span className="num w-12 text-right text-2xs font-medium text-ink">{exposure.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-4">
                <SectionLabel>{t.trading.shipments}</SectionLabel>
                <div className="mb-2 grid grid-cols-4 gap-1.5">
                  {shipmentStages.map((stage, index) => (
                    <div key={stage.label} className="text-center">
                      <div className="text-base font-semibold text-ink">{stage.count}</div>
                      <div className="text-2xs text-sub">{Object.values(t.trading.stages)[index]}</div>
                    </div>
                  ))}
                </div>
                <div className="flex h-1 gap-0.5 overflow-hidden rounded-full">
                  <div className="bg-[#888780]" style={{ flex: 3 }} />
                  <div className="bg-[#ef9f27]" style={{ flex: 2 }} />
                  <div className="bg-[#378add]" style={{ flex: 3 }} />
                  <div className="bg-[#1d9e75]" style={{ flex: 4 }} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ZONE 3 — Integration & operations */}
        <section className="space-y-4">
          <ZoneHeader n={3} title={t.trading.zoneOps} />
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="panel p-4">
              <SectionLabel>{t.trading.sap}</SectionLabel>
              <div className="space-y-1.5">
                {sapStatus.map((status) => (
                  <div key={status.label} className="flex items-center justify-between text-2xs">
                    <span className="text-sub">{tr(status.label)}</span>
                    <span className={`flex items-center gap-1 font-medium ${status.tone === "pos" ? "text-pos" : status.tone === "warn" ? "text-warn" : "text-sub"}`}>
                      {status.tone === "pos" && <Check className="h-3 w-3" />}
                      {status.tone === "warn" && <AlertTriangle className="h-3 w-3" />}
                      {tr(status.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-4">
              <SectionLabel>{t.trading.activity}</SectionLabel>
              <div className="grid divide-y divide-line md:grid-cols-2 md:gap-x-5 md:divide-y-0">
                {tradeActivity.map((activity, index) => {
                  const Icon = activityIcon[activity.icon];
                  return (
                    <div key={`${activity.bold}-${index}`} className="flex gap-2.5 border-b border-line py-2.5 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel text-sub">
                        <Icon className="h-3 w-3" strokeWidth={1.75} />
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
          </div>
        </section>
      </div>
    </div>
  );
}

function ZoneHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-line pb-2">
      <span className="num flex h-5 w-5 items-center justify-center rounded bg-ink text-2xs font-semibold text-white">{n}</span>
      <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
    </div>
  );
}

function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th className={right ? "pb-2 pr-3 text-2xs font-semibold uppercase tracking-wider text-sub text-right" : "pb-2 pr-3 text-2xs font-semibold uppercase tracking-wider text-sub"}>
      {children}
    </th>
  );
}
