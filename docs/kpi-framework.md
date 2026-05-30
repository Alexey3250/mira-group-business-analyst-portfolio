# KPI Framework

## Executive KPIs

| KPI | Formula | Business Use |
| --- | --- | --- |
| Contracted volume | Sum of contracted MT across product lines | Shows commercial scale across the bulk trading arm. |
| Open trade exposure | Sum of exposure for non-settled trades | Indicates counterparty and execution risk. |
| Weighted margin | Weighted average margin by cost center or trade value | Tracks profitability after product and logistics cost. |
| Priority exceptions | Count of high-severity data, SAP, and shipment exceptions | Highlights records requiring BA or owner intervention. |

## Supply Portfolio KPIs

| KPI | Formula |
| --- | --- |
| Shipped rate | Shipped MT / contracted MT |
| In-transit rate | In-transit MT / contracted MT |
| Open volume rate | Open MT / contracted MT |
| Supplier-backed coverage | Supplier-backed volume / contracted volume |
| Customer-backed coverage | Customer-backed volume / contracted volume |
| Service level | On-time or accepted shipment lines / total shipment lines |

## Trading KPIs

| KPI | Formula |
| --- | --- |
| Trade P&L | Revenue less costs by trade |
| Exposure | Open counterparty value by trade |
| Shipment value by stage | Sum of trade value grouped by contract, shipment, delivery, settled |
| Cost center margin | (Revenue - cost) / revenue |
| Risk count | Count of trades marked watch or high risk |

## RFQ / CRM KPIs

| KPI | Formula |
| --- | --- |
| Qualified rate | Qualified RFQs / received RFQs |
| Spec approval rate | Spec and credit approved RFQs / received RFQs |
| Offer rate | Offers issued / received RFQs |
| Contracted rate | Contracted RFQs / received RFQs |
| Counterparty channel conversion | Contracted RFQs / RFQs by channel |
| Destination pipeline value | Weighted pipeline value by destination market |

## Governance Rules

- Each KPI must have one owner and one approved definition.
- Dashboard filters must not change the meaning of formulas.
- Time-based measures must define calendar-day versus working-day logic.
- SAP cost centers must be mapped before trade records enter management reporting.
- Data-quality exceptions should be visible, not silently dropped.
