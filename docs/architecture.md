# Data Architecture

## Target Architecture

```text
CRM
  leads, brokers, follow-ups, site visits, offers
        |
        v
ETL validation layer
  required fields, duplicate leads, owner mapping, project codes
        |
        +---- SAP ERP
        |       cost centers, invoices, approvals, settlements
        |
        +---- Trading operations tracker
                contracts, shipments, BL, COA, demurrage, settlement status
        |
        v
Supabase Postgres analytical mart
  dimensions, facts, refresh logs, data-quality exceptions
        |
        v
Power BI semantic model
  KPI definitions, row-level views, executive dashboard
```

## Integration Objectives

- Create one reporting layer for real estate, CRM, and trading operations.
- Preserve source-system ownership while standardizing shared keys.
- Give finance a SAP-compatible view of cost centers, revenue, costs, and margin.
- Give sales leadership a CRM funnel and broker performance view.
- Give trading operations visibility over shipment stage, counterparty exposure, and settlement status.

## Key Integration Keys

| Domain | Key | Purpose |
| --- | --- | --- |
| Project | `project_code` | Links inventory, leads, broker sales, and revenue. |
| Broker | `broker_id` | Links CRM leads to broker-channel performance. |
| Counterparty | `counterparty_id` | Links trades, exposure, reconciliation, and settlement. |
| Cost center | `cost_center_code` | Aligns trading desk activity to SAP-style finance rollups. |
| Geography | `market_code` | Supports investor geography analysis and CIS reporting. |
| Refresh | `batch_id` | Tracks ETL loads, validation results, and exception handling. |

## Controls

- Required field checks for lead owner, project, source, next action, and stage.
- Duplicate lead matching by phone, email, and project interest.
- Trade validation for quantity, incoterm, shipment stage, cost center, and settlement status.
- Reconciliation checks between logistics cost, invoice value, and expected accrual.
- Exception queue for records blocked from dashboard refresh.

## BA Deliverables

- data flow diagram
- source-to-target mapping
- data dictionary
- KPI definition catalogue
- dashboard wireframes
- user guidelines
- test scenarios for ETL and reporting validation
