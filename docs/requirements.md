# Requirements

## Stakeholders

| Stakeholder | Primary Interest |
| --- | --- |
| Executive leadership | Portfolio revenue, exposure, conversion, and market demand. |
| Sales management | Project inventory, broker channel performance, direct sales, and CRM conversion. |
| Trading operations | Contract execution, shipment status, counterparty exposure, P&L, and settlement progress. |
| Finance | SAP-style cost center rollup, invoice alignment, margin, and reconciliation support. |
| Business analyst | Requirements, data mapping, KPI definitions, data quality, and user documentation. |
| Developers and data engineers | API, ETL, schema, validation, and refresh logic. |

## Business Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-001 | Consolidate real estate, CRM, trading, and finance-facing data into one management dashboard. | High |
| BR-002 | Show named real estate projects with sold, reserved, available, revenue, channel mix, and handover context. | High |
| BR-003 | Track commodities positions by product, counterparty, shipment stage, P&L, exposure, incoterm, and risk. | High |
| BR-004 | Show CRM funnel from Inquiry through Closed and compare conversion by project. | High |
| BR-005 | Rank broker performance and highlight investor demand by geography. | High |
| BR-006 | Document CRM to SAP to Supabase/Postgres to Power BI data flow. | High |
| BR-007 | Provide a SQL seed model that can support future live dashboard integration. | Medium |

## Functional Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-001 | Dashboard must include four tabs: Real Estate Pipeline, Commodities Trading Desk, CRM Funnel, and Data Architecture. | All tabs are visible and navigable in the app. |
| FR-002 | Real Estate tab must include project cards and unit mix visualization. | Each project shows sold, reserved, available, revenue, handover, and channel mix. |
| FR-003 | Trading tab must include an open positions table and shipment pipeline. | Each trade shows stage, P&L, exposure, cost center, incoterm, and risk. |
| FR-004 | CRM tab must include funnel, broker top 10, geography heatmap, and project conversion. | User can compare lead progression, broker volume, and CIS-heavy investor demand. |
| FR-005 | Architecture tab must show CRM, trading ops, SAP, ETL, Supabase, and Power BI flow. | User can understand source systems, transformation layer, controls, and BI target. |
| FR-006 | Seed SQL must create project, inventory, trade, cost center, funnel, broker, and geography tables. | `supabase/seed.sql` can be reviewed as a Postgres-compatible data model. |

## Non-Functional Requirements

| ID | Requirement | Rationale |
| --- | --- | --- |
| NFR-001 | Use Next.js rather than Vite or static HTML. | Aligns with requested implementation stack and Vercel deployment. |
| NFR-002 | Use synthetic data only. | Keeps the portfolio professional and safe to publish. |
| NFR-003 | Keep the first screen as the actual dashboard. | Recruiters should see the product immediately. |
| NFR-004 | Keep dashboard language business-facing. | The repo should read as a BA case study, not only a developer exercise. |
| NFR-005 | Build must pass lint, production build, and audit checks. | Supports a reliable deployable portfolio link. |
