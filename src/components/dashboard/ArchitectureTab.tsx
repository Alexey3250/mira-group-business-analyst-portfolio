"use client";

import { CheckCircle2, DatabaseZap, TableProperties } from "lucide-react";
import { architectureNodes, dataFlowSteps } from "@/data/operationsData";
import { Panel } from "./shared";

export default function ArchitectureTab() {
  return (
    <div className="grid gap-5">
      <section className="grid architecture-grid gap-3">
        {architectureNodes.map((node) => {
          const Icon = node.icon;

          return (
            <article key={node.title} className="content-auto rounded-lg bg-white p-4 shadow-panel ring-1 ring-slate-200">
              <div className={`mb-4 inline-flex rounded-lg p-2 ring-1 ${node.tone}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-slate-950">{node.title}</h2>
              <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{node.subtitle}</p>
              <p className="mt-3 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                Owner: {node.owner}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="Bulk trading CRM to SAP to Power BI data flow" eyebrow="Integration layer" icon={DatabaseZap}>
          <div className="grid gap-3 md:grid-cols-5">
            {dataFlowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.step} className="relative rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <Icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-950">{step.step}</h3>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{step.detail}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="grid gap-3 text-sm font-semibold text-slate-700 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <FlowBox label="Trade CRM" sublabel="RFQs and counterparty events" />
              <span className="hidden text-slate-400 md:block">-&gt;</span>
              <FlowBox label="SAP ERP" sublabel="Cost centers, invoices, inventory" />
              <span className="hidden text-slate-400 md:block">-&gt;</span>
              <FlowBox label="Power BI" sublabel="Management semantic model" />
            </div>
          </div>
        </Panel>

        <Panel title="Business analyst documentation pack" eyebrow="Role evidence" icon={TableProperties}>
          <div className="space-y-3">
            <ChecklistItem label="Requirements matrix" detail="Business, functional, and non-functional requirements with acceptance criteria." />
            <ChecklistItem label="Data dictionary" detail="CRM, SAP, trade, product family, counterparty, shipment, and destination-market fields." />
            <ChecklistItem label="Data flow diagram" detail="System owners, integration points, validation controls, refresh ownership." />
            <ChecklistItem label="User guidelines" detail="Manager dashboard usage, KPI definitions, data-quality escalation path." />
            <ChecklistItem label="ETL rules" detail="Join keys, status mapping, cost-center rollup, exception queue logic." />
          </div>
        </Panel>
      </section>
    </div>
  );
}

function FlowBox({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
      <p className="text-sm font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{sublabel}</p>
    </div>
  );
}

function ChecklistItem({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 p-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
      <div>
        <p className="font-semibold text-slate-950">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
      </div>
    </div>
  );
}
