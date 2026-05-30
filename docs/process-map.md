# Process Map

## CRM Sales Process

```text
Inquiry
  -> lead qualification
  -> broker or direct owner assignment
  -> site visit or investor consultation
  -> offer
  -> reservation or close-lost
  -> SAP/customer finance handoff
  -> management reporting refresh
```

## Commodity Trade Process

```text
Trade request
  -> contract creation
  -> pricing and quantity validation
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
  CRM, SAP, trade tracker, broker files
Transform
  standardize project codes, stages, cost centers, counterparties
Validate
  required fields, duplicates, unmatched cost centers, late follow-ups
Load
  Supabase/Postgres analytical tables
Report
  Power BI semantic model and management dashboard
```

## Pain Points Addressed

- Project sales and CRM funnel data may not share the same project naming.
- Broker performance requires clean attribution across lead source, owner, and project.
- Trading operations need shipment and settlement status tied back to finance.
- SAP cost center rollups require consistent mapping from trade records.
- Management reporting needs stable KPI definitions and refresh rules.

## BA Intervention Points

- Facilitate stakeholder workshops with sales, trading, risk, operations, finance, and IT.
- Document requirements and acceptance criteria.
- Define source-to-target field mapping.
- Validate KPI formulas and edge cases.
- Create user guidelines and escalation rules for data-quality exceptions.
