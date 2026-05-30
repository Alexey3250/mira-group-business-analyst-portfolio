import type { ReactNode } from "react";
import {
  commodityExposure,
  crmFunnel,
  groupKpis,
  priceFeed,
  projects,
  realEstateKpis,
  sapStatus,
  shipmentStages,
  tradeBlotter,
  tradingKpis,
} from "@/data/miraData";

const accent = {
  green: "#1d9e75",
  blue: "#378add",
  violet: "#7f77dd",
  amber: "#ef9f27",
  rose: "#d4537e",
  ink: "#1a1a1a",
  sub: "#6b6862",
  line: "#e7e4dd",
  panel: "#f5f4f0",
};

export default function PortfolioReportPage() {
  return (
    <div className="pdf-report">
      <ReportPage variant="cover">
        <div className="pdf-cover-grid">
          <div>
            <ReportBrand />
            <div className="pdf-kicker">Business Analyst portfolio prototype</div>
            <h1>MIRA Group operations intelligence platform</h1>
            <p className="pdf-lead">
              A working Next.js prototype for property development oversight, commodities trading controls, CRM
              visibility, and CRM-to-SAP automation.
            </p>

            <div className="pdf-cover-stats">
              {groupKpis.map((kpi) => (
                <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} />
              ))}
            </div>
          </div>

          <aside className="pdf-profile-card">
            <img src="/analyst-avatar.jpg" alt="Alexey Efimik" />
            <div>
              <div className="pdf-small-label">Prepared by</div>
              <h2>Alexey Efimik</h2>
              <p>Business Analyst candidate</p>
              <p className="pdf-muted">Dubai-focused operations, data processing, dashboards, and system workflows.</p>
            </div>
          </aside>
        </div>

        <div className="pdf-cover-band">
          <Statement
            title="What this proves"
            text="Automated extraction from multiple sources, business logic transformation, dashboard-ready outputs, and a clear handoff model for developers."
          />
          <Statement
            title="Why it fits MIRA"
            text="The prototype keeps real estate as the group overview while giving MIRA General Trading a dedicated commodities risk desk."
          />
          <Statement
            title="Delivery style"
            text="Fast, static-first Next.js routes with cached API calls and a pre-rendered PDF export for HR-friendly sharing."
          />
        </div>
      </ReportPage>

      <ReportPage title="Group Overview" eyebrow="Real estate first, operations connected">
        <div className="pdf-two-col">
          <section className="pdf-panel pdf-panel-fill">
            <SectionTitle title="Development portfolio" meta="7 tracked projects" />
            <div className="pdf-project-list">
              {projects.slice(0, 7).map((project) => (
                <div className="pdf-project-row" key={project.id}>
                  <span className="pdf-dot" style={{ background: project.color }} />
                  <div>
                    <strong>{project.name}</strong>
                    <span>
                      {project.brand} / {project.location} / {project.handover}
                    </span>
                  </div>
                  <div className="pdf-row-metric">
                    <Bar pct={project.progress} color={project.color} />
                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pdf-stack">
            <section className="pdf-panel">
              <SectionTitle title="Portfolio KPIs" meta="commercial snapshot" />
              <div className="pdf-mini-grid">
                {realEstateKpis.slice(0, 4).map((kpi) => (
                  <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} compact />
                ))}
              </div>
            </section>

            <section className="pdf-panel">
              <SectionTitle title="CRM funnel" meta="lead conversion" />
              <div className="pdf-funnel">
                {crmFunnel.map((stage) => (
                  <div key={stage.stage}>
                    <div
                      className="pdf-funnel-bar"
                      style={{ width: `${Math.max(stage.pct, 28)}%`, background: stage.color }}
                    >
                      <span>{stage.stage}</span>
                      <strong>{stage.count}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </ReportPage>

      <ReportPage title="Commodities Desk" eyebrow="MIRA General Trading focus">
        <div className="pdf-grid-4">
          {tradingKpis.slice(0, 4).map((kpi) => (
            <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} />
          ))}
        </div>

        <div className="pdf-two-col pdf-top-gap">
          <section className="pdf-panel">
            <SectionTitle title="Bulk market watch" meta="fertilizers, agri, industrial materials" />
            <div className="pdf-price-grid">
              {priceFeed.map((item) => (
                <div className="pdf-price-card" key={item.name}>
                  <div>
                    <span>{item.name}</span>
                    <strong>{item.price}</strong>
                    <small>{item.unit}</small>
                  </div>
                  <em className={item.changePct >= 0 ? "pdf-pos" : "pdf-neg"}>
                    {item.changePct >= 0 ? "+" : "-"}
                    {Math.abs(item.changePct)}%
                  </em>
                  <svg viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden>
                    <polyline
                      points={item.spark}
                      fill="none"
                      stroke={item.changePct >= 0 ? accent.green : "#d85a30"}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </section>

          <section className="pdf-panel">
            <SectionTitle title="Gulf-region risk signal" meta="prediction market monitor" />
            <div className="pdf-risk-card">
              <div>
                <span>US x Iran permanent peace deal</span>
                <strong>71%</strong>
                <small>Yes probability by Dec 31, 2026</small>
              </div>
              <div>
                <span>No probability</span>
                <strong>30%</strong>
                <small>Signal used as freight and demurrage risk input</small>
              </div>
            </div>

            <SectionTitle title="Exposure by commodity" meta="open book" small />
            <div className="pdf-exposure">
              {commodityExposure.map((item) => (
                <div key={item.name}>
                  <span>{item.name}</span>
                  <Bar pct={item.bar} color={item.color} />
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>

      </ReportPage>

      <ReportPage title="Trade Controls" eyebrow="Blotter, logistics, and system status">
        <section className="pdf-panel">
          <SectionTitle title="Trade blotter" meta="sample controls view" />
          <table className="pdf-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Commodity</th>
                <th>Direction</th>
                <th>Volume</th>
                <th>Price</th>
                <th>Counterparty</th>
                <th>Status</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody>
              {tradeBlotter.slice(0, 7).map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.commodity}</td>
                  <td className={row.direction === "BUY" ? "pdf-pos" : "pdf-neg"}>{row.direction}</td>
                  <td>{row.volume}</td>
                  <td>{row.price}</td>
                  <td>{row.counterparty}</td>
                  <td>{row.statusLabel}</td>
                  <td className={row.positive ? "pdf-pos" : "pdf-neg"}>{row.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="pdf-three-col pdf-top-gap">
          <section className="pdf-panel">
            <SectionTitle title="SAP integration status" meta="systems" small />
            <div className="pdf-status-list">
              {sapStatus.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="pdf-panel">
            <SectionTitle title="Shipment pipeline" meta="operations" small />
            <div className="pdf-shipment-row">
              {shipmentStages.map((stage) => (
                <div key={stage.label}>
                  <strong>{stage.count}</strong>
                  <span>{stage.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="pdf-panel">
            <SectionTitle title="Architecture" meta="handoff-ready" small />
            <div className="pdf-architecture">
              <Chip>CRM</Chip>
              <Chip>CTRM</Chip>
              <Chip>API routes</Chip>
              <Chip>ETL controls</Chip>
              <Chip>SAP ERP</Chip>
              <Chip>Power BI</Chip>
            </div>
          </section>
        </div>
      </ReportPage>

      <ReportPage title="Automation Workbench" eyebrow="CRM deal to SAP-ready payload">
        <div className="pdf-two-col">
          <section className="pdf-panel">
            <SectionTitle title="Automated data processing" meta="business analyst use case" />
            <div className="pdf-process">
              <ProcessStep n="1" title="Capture CRM deal" text="Commodity, volume, currency, counterparty, and target margin." />
              <ProcessStep n="2" title="Fetch live signals" text="Commodity spot proxy, FX conversion, and logistics risk context." />
              <ProcessStep n="3" title="Apply controls" text="Margin check, exposure threshold, documentation status, and hedging recommendation." />
              <ProcessStep n="4" title="Prepare ERP payload" text="Clean JSON structure ready for SAP, Power BI, or downstream approval workflow." />
            </div>
          </section>

          <section className="pdf-panel pdf-dark-panel">
            <SectionTitle title="Processing log" meta="demo output" />
            <pre>{`[2026-05-30 23:42] Fetching Urea market proxy... $312/MT
[2026-05-30 23:42] Fetching EUR/USD FX rate... 1.08
[2026-05-30 23:42] Calculating gross margin... +$2,000
[2026-05-30 23:42] Checking exposure threshold... OK
[2026-05-30 23:42] Transforming CRM payload to SAP JSON...
[2026-05-30 23:42] SUCCESS: deal ready for ERP sync`}</pre>
          </section>
        </div>
      </ReportPage>
    </div>
  );
}

function ReportPage({
  children,
  title,
  eyebrow,
  variant,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  variant?: "cover";
}) {
  return (
    <section className={variant === "cover" ? "pdf-page pdf-page-cover" : "pdf-page"}>
      {title && (
        <header className="pdf-page-header">
          <div>
            <div className="pdf-kicker">{eyebrow}</div>
            <h2>{title}</h2>
          </div>
          <ReportBrand compact />
        </header>
      )}
      {children}
    </section>
  );
}

function ReportBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "pdf-brand pdf-brand-compact" : "pdf-brand"}>
      <img src="/mira-logo.svg" alt="" />
      <div>
        <strong>Mira Group</strong>
        <span>Operations Intelligence</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, compact = false }: { label: string; value: string; sub: string; compact?: boolean }) {
  return (
    <div className={compact ? "pdf-metric pdf-metric-compact" : "pdf-metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function SectionTitle({ title, meta, small = false }: { title: string; meta: string; small?: boolean }) {
  return (
    <div className={small ? "pdf-section-title pdf-section-title-small" : "pdf-section-title"}>
      <h3>{title}</h3>
      <span>{meta}</span>
    </div>
  );
}

function Statement({ title, text }: { title: string; text: string }) {
  return (
    <div className="pdf-statement">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function ProcessStep({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="pdf-process-step">
      <span>{n}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="pdf-chip">{children}</span>;
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <span className="pdf-bar">
      <span style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}
