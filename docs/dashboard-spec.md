# Dashboard Specification

## Users

| User | Primary Need |
| --- | --- |
| Executive leadership | Quick view of portfolio revenue, trading exposure, CRM conversion, and market demand. |
| Sales management | Project pipeline, broker contribution, direct sales mix, and lead conversion. |
| Trading operations | Open position status, shipment stage, counterparty exposure, and settlement workflow. |
| Finance | Cost center rollup, P&L, margin, and SAP-aligned reporting. |
| Business analyst | Requirements traceability, data quality, and integration mapping. |

## Page Layout

The first screen is the working dashboard, not a landing page. It opens with executive KPIs and four operational tabs.

## Tab Requirements

| Tab | Required Views | Acceptance Criteria |
| --- | --- | --- |
| Real Estate Pipeline | Project cards, unit mix chart, revenue chart, channel mix chart. | User can compare sold, reserved, available, revenue, handover, and channel mix by project. |
| Commodities Trading Desk | Open trades table, shipment pipeline, exposure chart, cost center rollup. | User can identify stage, risk, P&L, exposure, incoterm, and cost center per trade. |
| CRM Funnel | Lead funnel, project conversion chart, broker ranking, investor heatmap. | User can see lead leakage, broker contribution, CIS-heavy demand, and project-level conversion. |
| Data Architecture | System nodes, ETL flow, documentation pack. | User can understand how CRM, SAP, Supabase, and Power BI fit together. |

## Cross-Dashboard Control Sections

| Section | Purpose | Acceptance Criteria |
| --- | --- | --- |
| Live Market Signals | Convert public FX and commodity feeds into trade-risk watch points. | User can see USD/AED, CIS FX exposure, commodity proxy movement, and risk interpretation. |
| CRM to SAP Control Center | Show integration health, exception queues, and source-to-target mapping quality. | User can identify sync health, unmatched records, severity, owner, SLA, and mapping quality. |

## Filters For Future Version

- date range
- business entity
- project
- broker
- commodity
- counterparty
- cost center
- investor geography

## Drilldowns For Future Version

- project detail page
- broker profile
- trade lifecycle timeline
- counterparty exposure ledger
- data-quality exception queue
- refresh history and failed-record analysis
