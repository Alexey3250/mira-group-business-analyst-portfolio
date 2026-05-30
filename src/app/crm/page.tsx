"use client";

import { useI18n } from "@/i18n";
import { Bar, DeskTitle, Funnel, Kpi, KpiRow, SectionLabel } from "@/components/desk";
import ExportPdfButton from "@/components/ExportPdfButton";
import { crmFunnel, investorGeography } from "@/data/miraData";

const leadChannels = [
  { name: "Mira International brokers", leads: 268, pct: 100, color: "#378add" },
  { name: "Percent&Co investor club", leads: 142, pct: 70, color: "#1d9e75" },
  { name: "Digital / paid media", leads: 96, pct: 48, color: "#7f77dd" },
  { name: "Referrals", leads: 74, pct: 37, color: "#ef9f27" },
  { name: "Events / roadshows", leads: 68, pct: 34, color: "#d4537e" },
];

const productConversion = [
  { product: "Trussardi Residences", inquiry: 184, qualified: 131, closed: 27 },
  { product: "Mira Villas - Bentley Home", inquiry: 96, qualified: 74, closed: 24 },
  { product: "Richmond District", inquiry: 142, qualified: 88, closed: 14 },
  { product: "Gianfranco Ferre Residences", inquiry: 118, qualified: 72, closed: 11 },
  { product: "Mira Verde - Tbilisi", inquiry: 108, qualified: 62, closed: 9 },
];

export default function CrmDesk() {
  const { t, tr } = useI18n();

  return (
    <div className="animate-fade-in">
      <DeskTitle title={t.crm.title} sub={t.crm.sub} right={<ExportPdfButton section="crm" />} />

      <KpiRow>
        <Kpi label={t.crm.totalLeads} value="648" sub={tr("34 this week")} tone="pos" spark={[540, 560, 590, 610, 630, 648]} />
        <Kpi label={t.crm.qualified} value="467" sub={tr("72% of inquiries")} tone="neutral" spark={[380, 405, 425, 440, 455, 467]} />
        <Kpi label={t.crm.closedDeals} value="57" sub={tr("8.8% conversion")} tone="pos" spark={[41, 45, 48, 51, 54, 57]} />
        <Kpi label={t.crm.brokerShare} value="68%" sub={tr("of closed deals")} tone="neutral" spark={[62, 64, 66, 65, 67, 68]} />
        <Kpi label={t.crm.avgCycle} value={tr("38 days")} sub={tr("inquiry -> offer")} tone="pos" spark={[46, 44, 43, 41, 40, 38]} />
      </KpiRow>

      <div className="grid lg:grid-cols-[1fr_300px]">
        <div className="border-b border-line px-5 py-5 sm:px-7 lg:border-b-0 lg:border-r">
          <SectionLabel>{t.crm.funnel}</SectionLabel>
          <div className="mb-7">
            <Funnel stages={crmFunnel.map((stage) => ({ ...stage, stage: tr(stage.stage) }))} showPct />
          </div>

          <SectionLabel>{t.crm.conversion}</SectionLabel>
          <div className="overflow-x-auto mini-scrollbar">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-line">
                  <Th>{t.crm.project}</Th>
                  <Th right>{t.crm.inquiry}</Th>
                  <Th right>{t.crm.qualified}</Th>
                  <Th right>{t.crm.closed}</Th>
                  <Th right>{t.crm.conv}</Th>
                </tr>
              </thead>
              <tbody>
                {productConversion.map((product) => (
                  <tr key={product.product} className="border-b border-line/60 transition hover:bg-panel">
                    <td className="py-2.5 pr-3 font-medium text-ink">{tr(product.product)}</td>
                    <td className="num py-2.5 pr-3 text-right text-sub">{product.inquiry}</td>
                    <td className="num py-2.5 pr-3 text-right text-sub">{product.qualified}</td>
                    <td className="num py-2.5 pr-3 text-right text-sub">{product.closed}</td>
                    <td className="num py-2.5 text-right font-medium text-pos">
                      {((product.closed / product.inquiry) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <SectionLabel>{t.crm.channels}</SectionLabel>
          <div className="mb-6 divide-y divide-line">
            {leadChannels.map((channel) => (
              <div key={channel.name} className="py-2.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-2xs text-ink">{tr(channel.name)}</span>
                  <span className="num text-2xs font-medium text-sub">{channel.leads}</span>
                </div>
                <Bar pct={channel.pct} color={channel.color} />
              </div>
            ))}
          </div>

          <SectionLabel>{t.crm.geography}</SectionLabel>
          <div className="divide-y divide-line">
            {investorGeography.map((geo) => (
              <div key={geo.label} className="flex items-center gap-2.5 py-1.5">
                <span className="w-5 text-sm">{geo.flag}</span>
                <span className="flex-1 text-2xs text-sub">{tr(geo.label)}</span>
                <div className="w-14">
                  <Bar pct={geo.bar} color={geo.color} />
                </div>
                <span className="num w-7 text-right text-2xs font-medium text-ink">{geo.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={right ? "pb-2 pr-3 text-2xs font-semibold uppercase tracking-wider text-sub text-right" : "pb-2 pr-3 text-2xs font-semibold uppercase tracking-wider text-sub"}>
      {children}
    </th>
  );
}
