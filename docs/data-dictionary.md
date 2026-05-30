# Data Dictionary

## `dim_product`

| Field | Definition |
| --- | --- |
| `product_code` | Unique product identifier used across CRM/RFQ, trading, and SAP reports. |
| `product_name` | Product display name. |
| `product_family` | Fertilizers, agricultural bulk products, or industrial bulk materials. |
| `supply_route` | Synthetic source-to-destination supply corridor. |
| `primary_use` | Primary business use or buyer segment. |

## `fact_supply_portfolio`

| Field | Definition |
| --- | --- |
| `product_code` | Product key. |
| `contracted_mt` | Synthetic contracted metric tons. |
| `shipped_mt` | Synthetic shipped metric tons. |
| `in_transit_mt` | Synthetic in-transit metric tons. |
| `open_mt` | Synthetic open metric tons. |
| `revenue_aed_m` | Synthetic booked or expected revenue in AED millions. |
| `supplier_backed_pct` | Share covered by supplier commitments. |
| `customer_backed_pct` | Share covered by customer commitments. |
| `service_level_pct` | Synthetic on-time or accepted shipment service level. |

## `fact_trade_position`

| Field | Definition |
| --- | --- |
| `trade_id` | Trade reference. |
| `commodity_group` | Fertilizers, agricultural bulk products, or industrial bulk materials. |
| `product` | Product description. |
| `counterparty` | Counterparty display name. |
| `shipment_stage` | Contract, shipment, delivery, or settled. |
| `quantity_mt` | Metric tons. |
| `pnl_aed_k` | Synthetic P&L in AED thousands. |
| `exposure_aed_m` | Synthetic counterparty exposure in AED millions. |
| `cost_center_code` | SAP-style cost center. |
| `incoterm` | Trade incoterm. |
| `risk_rating` | Low, watch, or high. |

## `fact_crm_funnel`

| Field | Definition |
| --- | --- |
| `product_code` | Product interest. |
| `stage_name` | RFQ received, qualified counterparty, spec/credit approved, offer issued, or contracted. |
| `lead_count` | Count of RFQs at stage. |
| `conversion_pct` | Conversion rate from total RFQ base. |

## `fact_counterparty_channel`

| Field | Definition |
| --- | --- |
| `channel_name` | Counterparty segment or acquisition channel. |
| `volume_aed_m` | Synthetic transaction volume in AED millions. |
| `rfq_count` | RFQs attributed to the channel. |
| `conversion_pct` | Channel conversion rate. |

## `fact_destination_market`

| Field | Definition |
| --- | --- |
| `market` | Destination country or market. |
| `region` | Region grouping such as GCC, MENA, East Africa, South Asia, CIS, or APAC. |
| `rfq_count` | RFQ volume. |
| `conversion_pct` | Conversion rate. |
| `pipeline_value_aed_m` | Synthetic weighted pipeline value. |

## Data Handling Rule

All values are synthetic. No private client, supplier, counterparty, employee, or applicant data should be added to the repository.
