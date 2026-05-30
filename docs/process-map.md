# Process Map

## RFQ / CRM Process

```text
RFQ received
  -> counterparty qualification
  -> product specification and credit check
  -> supplier/customer coverage check
  -> offer issued
  -> contract or close-lost
  -> SAP/customer finance handoff
  -> management reporting refresh
```

## Bulk Trade Process

```text
Trade request
  -> contract creation
  -> price, specification, and quantity validation
  -> logistics booking
  -> shipment documentation
  -> delivery confirmation
  -> invoice and cost reconciliation
  -> settlement
  -> SAP cost center reporting
```

## ETL Process

```text
Extract
  Trade CRM, SAP, trade tracker, shipment files
Transform
  standardize product, stage, cost center, shipment, and counterparty keys
Validate
  required specs, duplicates, unmatched cost centers, expired offers
Load
  Supabase/Postgres analytical tables
Report
  Power BI semantic model and management dashboard
```

## Pain Points Addressed

- RFQ, contract, and SAP data may not share the same product naming.
- Counterparty performance requires clean attribution across RFQ source, owner, product, and destination.
- Trading operations need shipment and settlement status tied back to finance.
- SAP cost center rollups require consistent mapping from trade records.
- Management reporting needs stable KPI definitions and refresh rules.

## BA Intervention Points

- Facilitate stakeholder workshops with commercial, trading, logistics, finance, and IT.
- Document requirements and acceptance criteria.
- Define source-to-target field mapping.
- Validate KPI formulas and edge cases.
- Create user guidelines and escalation rules for data-quality exceptions.
