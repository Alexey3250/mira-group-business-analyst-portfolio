# Requirements

## Stakeholders

| Stakeholder | Primary Interest |
| --- | --- |
| Executive leadership | Contracted volume, open exposure, margin, conversion, and priority exceptions. |
| Commercial operations | RFQ status, counterparty channel performance, destination demand, and offer conversion. |
| Trading operations | Contract execution, shipment status, counterparty exposure, P&L, and settlement progress. |
| Finance | SAP-style cost center rollup, invoice alignment, margin, and reconciliation support. |
| Business analyst | Requirements, data mapping, KPI definitions, data quality, and user documentation. |
| Developers and data engineers | API, ETL, schema, validation, and refresh logic. |

## Business Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-001 | Consolidate fertilizers, agricultural bulk products, industrial bulk materials, CRM/RFQ, trading, and finance-facing data into one management dashboard. | High |
| BR-002 | Show product families with contracted, shipped, in-transit, open MT, revenue, service level, and commercial coverage. | High |
| BR-003 | Track bulk trade positions by product, counterparty, shipment stage, P&L, exposure, incoterm, ETA, and risk. | High |
| BR-004 | Show RFQ funnel from received through contracted and compare conversion by product family. | High |
| BR-005 | Rank counterparty channels and highlight demand by destination market. | High |
| BR-006 | Document Trade CRM to SAP to Supabase/Postgres to Power BI data flow. | High |
| BR-007 | Provide a SQL seed model that can support future live dashboard integration. | Medium |

## Functional Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| FR-001 | Dashboard must include four tabs: Bulk Supply Portfolio, Trade Execution Desk, RFQ / CRM Pipeline, and Data Architecture. | All tabs are visible and navigable in the app. |
| FR-002 | Supply tab must include product cards and MT status visualization. | Each product line shows contracted, shipped, in-transit, open MT, revenue, and service level. |
| FR-003 | Trading tab must include an open contracts table and shipment pipeline. | Each trade shows stage, P&L, exposure, cost center, incoterm, ETA, and risk. |
| FR-004 | CRM tab must include RFQ funnel, counterparty top 10, destination heatmap, and product conversion. | User can compare RFQ progression, channel volume, destination demand, and product-level conversion. |
| FR-005 | Architecture tab must show Trade CRM, trading ops, SAP, ETL, Supabase, and Power BI flow. | User can understand source systems, transformation layer, controls, and BI target. |
| FR-006 | Seed SQL must create product, trade, cost center, RFQ funnel, counterparty channel, and destination market tables. | `supabase/seed.sql` can be reviewed as a Postgres-compatible data model. |

## Non-Functional Requirements

| ID | Requirement | Rationale |
| --- | --- | --- |
| NFR-001 | Use Next.js rather than Vite or static HTML. | Aligns with requested implementation stack and Vercel deployment. |
| NFR-002 | Use synthetic data only. | Keeps the portfolio professional and safe to publish. |
| NFR-003 | Keep the first screen as the actual dashboard. | Recruiters should see the product immediately. |
| NFR-004 | Keep dashboard language business-facing. | The repo should read as a BA case study, not only a developer exercise. |
| NFR-005 | Build must pass lint, production build, and audit checks. | Supports a reliable deployable portfolio link. |
