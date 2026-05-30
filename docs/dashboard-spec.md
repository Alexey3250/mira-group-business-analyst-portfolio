# Dashboard Specification

## Users

| User | Primary Need |
| --- | --- |
| Executive leadership | Quick view of contracted volume, open exposure, landed margin, and priority exceptions. |
| Commercial operations | RFQ pipeline, counterparty channels, product demand, and offer conversion. |
| Trading operations | Open contract status, shipment stage, counterparty exposure, and settlement workflow. |
| Finance | Cost center rollup, P&L, margin, invoice alignment, and SAP-aligned reporting. |
| Business analyst | Requirements traceability, source-to-target mapping, and data-quality controls. |

## Page Layout

The first screen is the working dashboard, not a landing page. It opens with executive KPIs, live market signals, integration controls, and four operational tabs.

## Tab Requirements

| Tab | Required Views | Acceptance Criteria |
| --- | --- | --- |
| Bulk Supply Portfolio | Product cards, MT status chart, revenue chart, coverage mix chart. | User can compare contracted, shipped, in-transit, open MT, revenue, service level, and commercial coverage by product line. |
| Trade Execution Desk | Open trades table, shipment pipeline, exposure chart, cost center rollup. | User can identify stage, risk, P&L, exposure, incoterm, ETA, and cost center per trade. |
| RFQ / CRM Pipeline | RFQ funnel, product conversion chart, counterparty channel ranking, destination heatmap. | User can see RFQ leakage, channel contribution, destination demand, and product-level conversion. |
| Data Architecture | System nodes, ETL flow, documentation pack. | User can understand how Trade CRM, trading ops, SAP, Supabase, and Power BI fit together. |

## Cross-Dashboard Control Sections

| Section | Purpose | Acceptance Criteria |
| --- | --- | --- |
| Live Market Signals | Convert public FX and commodity proxies into bulk-trade watch points. | User can see USD/AED, CIS FX exposure, natural gas, agri futures, copper, crude, and risk interpretation. |
| Deal Margin Analyzer | Demonstrate automated extraction and processing from multiple external sources. | User can run a mock CRM trade through commodity pricing, FX, EU sourcing, port weather, margin scoring, and a SAP-style JSON payload. |
| Bulk Trade CRM to SAP Control Center | Show integration health, exception queues, and source-to-target mapping quality. | User can identify sync health, unmatched records, severity, owner, SLA, and mapping quality. |

## Filters For Future Version

- date range
- product family
- product
- counterparty
- supplier region
- destination market
- cost center
- shipment stage

## Drilldowns For Future Version

- product family detail page
- trade lifecycle timeline
- counterparty exposure ledger
- landed-cost bridge
- data-quality exception queue
- refresh history and failed-record analysis
