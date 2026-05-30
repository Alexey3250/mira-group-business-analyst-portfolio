"use client";

import { useI18n } from "@/i18n";
import {
  Handshake,
  Ship,
  Factory,
  Database,
  GitBranch,
  BarChart3,
  ArrowRight,
  TableProperties,
  Workflow,
  ShieldCheck,
  PackageCheck,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { SectionLabel } from "@/components/desk";

const systems: Array<{ icon: LucideIcon; title: string; titleRu: string; subtitle: string; subtitleRu: string; owner: string; ownerRu: string; sapMapping: string }> = [
  { icon: Handshake, title: "Trade CRM", titleRu: "Торговая CRM", subtitle: "RFQs, counterparties, price offers", subtitleRu: "RFQ, контрагенты, предложения", owner: "Commercial Ops", ownerRu: "Коммерция", sapMapping: "Account_ID → KNA1 (Customer Master)" },
  { icon: Ship, title: "Trading Ops", titleRu: "Торговые операции", subtitle: "Contracts, shipments, documents", subtitleRu: "Контракты, отгрузки, документы", owner: "Operations", ownerRu: "Операции", sapMapping: "Deal_Terms → VBAK (Sales Document)" },
  { icon: Factory, title: "SAP ERP", titleRu: "SAP ERP", subtitle: "Cost centers, invoices, approvals", subtitleRu: "Центры затрат, счета, согласования", owner: "Finance", ownerRu: "Финансы", sapMapping: "Commodity_Code → MARA (Material Master)" },
  { icon: Database, title: "Data Warehouse", titleRu: "Хранилище данных", subtitle: "Star-schema analytical mart", subtitleRu: "Витрина (star-schema)", owner: "Data Platform", ownerRu: "Платформа данных", sapMapping: "Denormalized facts + dimensions" },
  { icon: GitBranch, title: "ETL Layer", titleRu: "ETL слой", subtitle: "Validation, mapping, refresh logs", subtitleRu: "Валидация, маппинг, логи", owner: "Business Analyst", ownerRu: "Бизнес-аналитик", sapMapping: "Transform & quality gates" },
  { icon: BarChart3, title: "Power BI", titleRu: "Power BI", subtitle: "Management dashboards & alerts", subtitleRu: "Дашборды и алерты", owner: "Leadership", ownerRu: "Руководство", sapMapping: "KPI layer → executive reports" },
];

const pipeline: Array<{ icon: LucideIcon; step: string; stepRu: string; detail: string; detailRu: string }> = [
  { icon: TableProperties, step: "Extract", stepRu: "Извлечение", detail: "CRM snapshots, trade tracker, SAP cost centers", detailRu: "Снимки CRM, трекер сделок, центры затрат" },
  { icon: Workflow, step: "Transform", stepRu: "Трансформация", detail: "Normalize product, counterparty, shipment keys", detailRu: "Нормализация продуктов, контрагентов" },
  { icon: ShieldCheck, step: "Validate", stepRu: "Валидация", detail: "Missing specs, duplicate RFQs, unmatched entries", detailRu: "Пропуски, дубликаты RFQ, несовпадения" },
  { icon: PackageCheck, step: "Load", stepRu: "Загрузка", detail: "Publish star-schema into analytical warehouse", detailRu: "Публикация star-schema в хранилище" },
  { icon: LineChart, step: "Report", stepRu: "Отчётность", detail: "Power BI semantic model with KPI definitions", detailRu: "Модель Power BI с KPI" },
];

export default function SystemArchitecture() {
  const { t, locale } = useI18n();
  const ru = locale === "ru";

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>{t.architecture.dataFlow}</SectionLabel>
        <div className="flex flex-wrap items-stretch gap-1">
          {pipeline.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex items-center gap-1">
                <div className="panel min-w-[150px] p-3.5">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-c-blue" strokeWidth={1.75} />
                    <span className="text-2xs font-semibold text-ink">{ru ? step.stepRu : step.step}</span>
                  </div>
                  <p className="text-2xs leading-tight text-sub">{ru ? step.detailRu : step.detail}</p>
                </div>
                {i < pipeline.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-faint" />}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel>{t.architecture.systems}</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((sys) => {
            const Icon = sys.icon;
            return (
              <div key={sys.title} className="panel p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-panel">
                    <Icon className="h-4 w-4 text-c-blue" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{ru ? sys.titleRu : sys.title}</p>
                    <p className="text-2xs uppercase tracking-wider text-faint">{ru ? sys.ownerRu : sys.owner}</p>
                  </div>
                </div>
                <p className="mb-2.5 text-2xs leading-5 text-sub">{ru ? sys.subtitleRu : sys.subtitle}</p>
                <p className="num rounded-md bg-ink px-2.5 py-1.5 text-2xs text-[#7ee0a8]">{sys.sapMapping}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
