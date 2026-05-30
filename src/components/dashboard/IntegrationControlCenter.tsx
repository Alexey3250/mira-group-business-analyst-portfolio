import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileWarning,
  GitBranch,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const syncHealth = [
  {
    name: "Counterparty CRM sync",
    system: "CRM -> counterparty mart",
    status: "Healthy",
    matchRate: 98.4,
    openExceptions: 14,
    lastRun: "18:42 GST",
  },
  {
    name: "Product master mapping",
    system: "Trade master -> SAP item groups",
    status: "Watch",
    matchRate: 94.1,
    openExceptions: 22,
    lastRun: "18:35 GST",
  },
  {
    name: "SAP cost center mapping",
    system: "SAP ERP -> margin rollup",
    status: "Healthy",
    matchRate: 97.6,
    openExceptions: 9,
    lastRun: "18:33 GST",
  },
  {
    name: "Trade settlement ETL",
    system: "Trading ops -> SAP settlement",
    status: "Watch",
    matchRate: 96.8,
    openExceptions: 18,
    lastRun: "18:30 GST",
  },
] as const;

const exceptionQueue = [
  {
    rule: "Missing product spec code",
    source: "RFQ staging",
    count: 14,
    severity: "High",
    owner: "Commercial ops",
    sla: "4h",
  },
  {
    rule: "Missing SAP cost center",
    source: "Trade contract",
    count: 12,
    severity: "High",
    owner: "Finance ops",
    sla: "4h",
  },
  {
    rule: "Duplicate counterparty RFQ",
    source: "CRM",
    count: 26,
    severity: "Watch",
    owner: "Trade desk",
    sla: "1d",
  },
  {
    rule: "Shipment quantity variance",
    source: "Bill of lading",
    count: 8,
    severity: "High",
    owner: "Logistics ops",
    sla: "4h",
  },
  {
    rule: "Currency mismatch",
    source: "Invoice staging",
    count: 7,
    severity: "High",
    owner: "Business analyst",
    sla: "4h",
  },
  {
    rule: "Expired offer validity",
    source: "CRM follow-up",
    count: 31,
    severity: "Watch",
    owner: "Commercial manager",
    sla: "1d",
  },
] as const;

const sourceMappings = [
  { from: "CRM.rfq_product", to: "dim_product.product_code", quality: 97 },
  { from: "CRM.counterparty_account", to: "dim_counterparty.counterparty_id", quality: 95 },
  { from: "Trade.product_family", to: "dim_product.family_code", quality: 96 },
  { from: "SAP.cost_center", to: "fact_trade_position.cost_center_code", quality: 96 },
  { from: "Shipment.bill_of_lading_qty", to: "fact_trade_position.quantity_mt", quality: 93 },
  { from: "Invoice.currency", to: "fact_settlement.currency_code", quality: 93 },
] as const;

export default function IntegrationControlCenter() {
  const totalExceptions = exceptionQueue.reduce((sum, item) => sum + item.count, 0);
  const highExceptions = exceptionQueue
    .filter((item) => item.severity === "High")
    .reduce((sum, item) => sum + item.count, 0);
  const averageMatch = syncHealth.reduce((sum, item) => sum + item.matchRate, 0) / syncHealth.length;
  const watchPipelines = syncHealth.filter((item) => item.status === "Watch").length;

  return (
    <section className="rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-blue-700 ring-1 ring-blue-200">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              Bulk trade CRM &gt; SAP control center
            </span>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-slate-600 ring-1 ring-slate-200">
              BA integration evidence
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            Integration quality, exception handling, and source-to-target mapping
          </h2>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
            A recruiter should see how the analyst would support RFQ capture,
            product master data, SAP integration, ETL validation, and Power BI
            reliability before bulk trading data reaches management.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:w-[560px]">
          <ControlMetric label="Avg. match rate" value={`${averageMatch.toFixed(1)}%`} />
          <ControlMetric label="Open exceptions" value={totalExceptions.toString()} />
          <ControlMetric label="High severity" value={highExceptions.toString()} />
          <ControlMetric label="Watch pipelines" value={watchPipelines.toString()} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_1.25fr_0.9fr]">
        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
            <RefreshCw className="h-4 w-4 text-blue-700" aria-hidden="true" />
            Sync health
          </div>
          <div className="space-y-3">
            {syncHealth.map((item) => (
              <div key={item.name} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.system}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Auto-match</span>
                    <span>{item.matchRate}%</span>
                  </div>
                  <div className="h-2 rounded-md bg-slate-200">
                    <div
                      className="h-2 rounded-md bg-blue-600"
                      style={{ width: `${item.matchRate}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <ControlMetric label="Exceptions" value={item.openExceptions.toString()} compact />
                  <ControlMetric label="Last run" value={item.lastRun} compact />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
            <FileWarning className="h-4 w-4 text-amber-700" aria-hidden="true" />
            Exception queue
          </div>
          <div className="overflow-x-auto mini-scrollbar">
            <table className="w-full min-w-[680px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-normal text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Rule</th>
                  <th className="py-2 pr-3 font-semibold">Source</th>
                  <th className="py-2 pr-3 font-semibold">Count</th>
                  <th className="py-2 pr-3 font-semibold">Severity</th>
                  <th className="py-2 pr-3 font-semibold">Owner</th>
                  <th className="py-2 pr-3 font-semibold">SLA</th>
                </tr>
              </thead>
              <tbody>
                {exceptionQueue.map((item) => (
                  <tr key={item.rule} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-3 font-semibold text-slate-950">{item.rule}</td>
                    <td className="py-3 pr-3 text-slate-600">{item.source}</td>
                    <td className="py-3 pr-3 font-semibold">{item.count}</td>
                    <td className="py-3 pr-3">
                      <SeverityPill severity={item.severity} />
                    </td>
                    <td className="py-3 pr-3 text-slate-600">{item.owner}</td>
                    <td className="py-3 pr-3 font-mono text-xs text-slate-600">{item.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Database className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Source-to-target checks
          </div>
          <div className="space-y-3">
            {sourceMappings.map((mapping) => (
              <div key={mapping.from} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <p className="font-mono text-xs text-slate-500">{mapping.from}</p>
                <p className="mt-1 font-mono text-xs font-semibold text-slate-900">{mapping.to}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Quality</span>
                    <span>{mapping.quality}%</span>
                  </div>
                  <div className="h-2 rounded-md bg-slate-200">
                    <div
                      className="h-2 rounded-md bg-emerald-600"
                      style={{ width: `${mapping.quality}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function ControlMetric({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className={`rounded-lg bg-slate-50 ring-1 ring-slate-200 ${compact ? "p-2" : "p-3"}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`${compact ? "text-sm" : "text-lg"} mt-1 font-semibold text-slate-950`}>
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: "Healthy" | "Watch" }) {
  const isHealthy = status === "Healthy";
  const Icon = isHealthy ? CheckCircle2 : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 ${
        isHealthy
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-amber-200"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </span>
  );
}

function SeverityPill({ severity }: { severity: "High" | "Watch" }) {
  const Icon = severity === "High" ? AlertCircle : ShieldCheck;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 ${
        severity === "High"
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : "bg-amber-50 text-amber-700 ring-amber-200"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {severity}
    </span>
  );
}
