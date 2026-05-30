# Data Architecture

## Target Architecture

```text
Trade CRM
  RFQs, counterparties, product interest, offers, approvals
        |
        v
ETL validation layer
  required specs, duplicate RFQs, owner mapping, product and cost center codes
        |
        +---- SAP ERP
        |       cost centers, invoices, approvals, settlements, inventory groups
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

- Create one reporting layer for fertilizers, agricultural bulk products, industrial bulk materials, RFQ activity, and trading operations.
- Preserve source-system ownership while standardizing shared keys.
- Give finance a SAP-compatible view of cost centers, revenue, costs, and margin.
- Give commercial leadership an RFQ funnel and counterparty channel view.
- Give trading operations visibility over shipment stage, counterparty exposure, and settlement status.

## Key Integration Keys

| Domain | Key | Purpose |
| --- | --- | --- |
| Product | `product_code` | Links RFQs, trade positions, product family, and revenue. |
| Product family | `family_code` | Groups fertilizers, agricultural bulk products, and industrial bulk materials. |
| Counterparty | `counterparty_id` | Links RFQs, trades, exposure, reconciliation, and settlement. |
| Cost center | `cost_center_code` | Aligns trading desk activity to SAP-style finance rollups. |
| Destination market | `market_code` | Supports demand and regional reporting. |
| Refresh | `batch_id` | Tracks ETL loads, validation results, and exception handling. |

## Controls

- Required field checks for product spec, counterparty, RFQ owner, destination, and stage.
- Duplicate RFQ matching by counterparty, product, volume, date, and destination.
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
