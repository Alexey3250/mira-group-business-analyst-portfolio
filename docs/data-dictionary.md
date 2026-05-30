# Data Dictionary

## `dim_project`

| Field | Definition |
| --- | --- |
| `project_code` | Unique project identifier used across CRM and sales reports. |
| `project_name` | Public project or portfolio display name. |
| `location` | Project location. |
| `brand_partner` | Brand or design partner. |
| `handover_quarter` | Public or modelled handover period. |
| `starting_price_aed` | Public starting-price context where available. |

## `fact_project_inventory`

| Field | Definition |
| --- | --- |
| `project_code` | Project key. |
| `total_units` | Synthetic total units in portfolio model. |
| `sold_units` | Synthetic sold inventory. |
| `reserved_units` | Synthetic reserved inventory. |
| `available_units` | Synthetic available inventory. |
| `revenue_aed_m` | Synthetic recognized or booked revenue in AED millions. |
| `broker_channel_pct` | Share attributed to broker channel. |
| `direct_channel_pct` | Share attributed to direct sales. |

## `fact_trade_position`

| Field | Definition |
| --- | --- |
| `trade_id` | Trade reference. |
| `commodity_group` | Fertilizers, metals, or grains. |
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
| `project_code` | Project interest. |
| `stage_name` | Inquiry, qualified, site visit, offer, or closed. |
| `lead_count` | Count of leads at stage. |
| `conversion_pct` | Conversion rate from total inquiry base. |

## `fact_broker_performance`

| Field | Definition |
| --- | --- |
| `broker_name` | Broker or agency display name. |
| `volume_aed_m` | Synthetic transaction volume in AED millions. |
| `lead_count` | Leads attributed to broker. |
| `conversion_pct` | Broker conversion rate. |

## `fact_investor_geography`

| Field | Definition |
| --- | --- |
| `market` | Investor country or market. |
| `region` | Region grouping such as CIS, GCC, MENA, Europe, South Asia, or APAC. |
| `lead_count` | Lead volume. |
| `conversion_pct` | Conversion rate. |
| `pipeline_value_aed_m` | Synthetic weighted pipeline value. |

## Data Handling Rule

All values are synthetic. No private client, broker, counterparty, or applicant data should be added to the repository.
