-- MIRA L.L.C. Bulk Trading Operations Cockpit
-- Supabase/Postgres-compatible schema and seed data.
-- Data is synthetic and candidate-generated for portfolio demonstration only.

drop view if exists vw_executive_kpis;
drop table if exists fact_destination_market;
drop table if exists fact_counterparty_channel;
drop table if exists fact_crm_funnel;
drop table if exists fact_cost_center_rollup;
drop table if exists fact_trade_position;
drop table if exists fact_supply_portfolio;
drop table if exists dim_product;

create table dim_product (
  product_code text primary key,
  product_name text not null,
  product_family text not null check (product_family in ('Fertilizers', 'Agricultural bulk products', 'Industrial bulk materials')),
  supply_route text not null,
  primary_use text not null,
  planning_window text not null
);

create table fact_supply_portfolio (
  product_code text references dim_product(product_code),
  contracted_mt numeric(14, 2) not null,
  shipped_mt numeric(14, 2) not null,
  in_transit_mt numeric(14, 2) not null,
  open_mt numeric(14, 2) not null,
  revenue_aed_m numeric(12, 2) not null,
  supplier_backed_pct numeric(5, 2) not null,
  customer_backed_pct numeric(5, 2) not null,
  service_level_pct numeric(5, 2) not null,
  snapshot_date date not null default current_date,
  primary key (product_code, snapshot_date)
);

create table fact_trade_position (
  trade_id text primary key,
  commodity_group text not null check (commodity_group in ('Fertilizers', 'Agricultural bulk products', 'Industrial bulk materials')),
  product text not null,
  counterparty text not null,
  region text not null,
  shipment_stage text not null check (shipment_stage in ('Contract', 'Shipment', 'Delivery', 'Settled')),
  quantity_mt numeric(14, 2) not null,
  pnl_aed_k numeric(12, 2) not null,
  exposure_aed_m numeric(12, 2) not null,
  cost_center_code text not null,
  incoterm text not null,
  eta date,
  risk_rating text not null check (risk_rating in ('Low', 'Watch', 'High'))
);

create table fact_cost_center_rollup (
  cost_center_code text primary key,
  commodity_group text not null,
  revenue_aed_m numeric(12, 2) not null,
  cost_aed_m numeric(12, 2) not null,
  margin_pct numeric(6, 2) not null
);

create table fact_crm_funnel (
  product_code text references dim_product(product_code),
  stage_name text not null,
  rfq_count integer not null,
  conversion_pct numeric(6, 2) not null,
  snapshot_date date not null default current_date,
  primary key (product_code, stage_name, snapshot_date)
);

create table fact_counterparty_channel (
  channel_name text primary key,
  volume_aed_m numeric(12, 2) not null,
  rfq_count integer not null,
  conversion_pct numeric(6, 2) not null
);

create table fact_destination_market (
  market text primary key,
  region text not null,
  rfq_count integer not null,
  conversion_pct numeric(6, 2) not null,
  pipeline_value_aed_m numeric(12, 2) not null
);

insert into dim_product (
  product_code,
  product_name,
  product_family,
  supply_route,
  primary_use,
  planning_window
) values
  ('UREA', 'Granular urea', 'Fertilizers', 'CIS / GCC -> East Africa', 'Nitrogen fertilizer programs', 'Jun-Aug 2026'),
  ('DAPMAP', 'DAP / MAP phosphates', 'Fertilizers', 'GCC / North Africa -> South Asia', 'Row-crop nutrient blends', 'Jul-Sep 2026'),
  ('NPK', 'NPK blends', 'Fertilizers', 'UAE blending -> MENA distributors', 'Distributor replenishment', 'Jun-Jul 2026'),
  ('WHEAT', 'Milling wheat', 'Agricultural bulk products', 'Black Sea -> MENA mills', 'Food-grade flour supply', 'Jun-Oct 2026'),
  ('FEED', 'Feed corn and barley', 'Agricultural bulk products', 'CIS / LatAm -> GCC feed mills', 'Livestock and poultry feed', 'Jul-Nov 2026'),
  ('INDLOTS', 'Aluminum, copper, steel lots', 'Industrial bulk materials', 'GCC / CIS -> industrial buyers', 'Fabrication and infrastructure inputs', 'Jun-Sep 2026');

insert into fact_supply_portfolio (
  product_code,
  contracted_mt,
  shipped_mt,
  in_transit_mt,
  open_mt,
  revenue_aed_m,
  supplier_backed_pct,
  customer_backed_pct,
  service_level_pct
) values
  ('UREA', 42000, 27500, 8200, 6300, 62, 72, 28, 94),
  ('DAPMAP', 28600, 16200, 7400, 5000, 48, 68, 32, 91),
  ('NPK', 18400, 13100, 2600, 2700, 34, 61, 39, 96),
  ('WHEAT', 58200, 33400, 14900, 9900, 71, 76, 24, 89),
  ('FEED', 39100, 21800, 9300, 8000, 43, 64, 36, 92),
  ('INDLOTS', 19100, 9800, 5100, 4200, 82, 58, 42, 88);

insert into fact_trade_position (
  trade_id,
  commodity_group,
  product,
  counterparty,
  region,
  shipment_stage,
  quantity_mt,
  pnl_aed_k,
  exposure_aed_m,
  cost_center_code,
  incoterm,
  eta,
  risk_rating
) values
  ('MTR-2606-118', 'Fertilizers', 'Granular urea', 'CIS Agri Export', 'Black Sea', 'Shipment', 18500, 842, 23.6, 'TRD-FERT-DXB', 'CFR', '2026-06-18', 'Watch'),
  ('MTR-2606-121', 'Industrial bulk materials', 'Aluminum billets', 'Gulf Industrial Materials', 'GCC', 'Delivery', 4200, 515, 18.2, 'TRD-IND-DXB', 'FOB', '2026-06-09', 'Low'),
  ('MTR-2606-127', 'Agricultural bulk products', 'Milling wheat', 'Black Sea Grain Co.', 'CIS', 'Contract', 27000, 366, 31.4, 'TRD-AGRI-DXB', 'CIF', '2026-07-03', 'High'),
  ('MTR-2606-132', 'Fertilizers', 'NPK 15-15-15', 'East Africa Inputs', 'Africa', 'Settled', 11200, 610, 9.7, 'TRD-FERT-DXB', 'CIP', '2026-05-24', 'Low'),
  ('MTR-2606-135', 'Industrial bulk materials', 'Copper cathodes', 'Caspian Industrial Supply', 'CIS', 'Shipment', 1600, -124, 26.8, 'TRD-IND-DXB', 'DAP', '2026-06-27', 'Watch'),
  ('MTR-2606-141', 'Agricultural bulk products', 'Feed barley', 'Levant Grain Partners', 'MENA', 'Delivery', 21800, 294, 15.1, 'TRD-AGRI-DXB', 'CFR', '2026-06-12', 'Low');

insert into fact_cost_center_rollup (
  cost_center_code,
  commodity_group,
  revenue_aed_m,
  cost_aed_m,
  margin_pct
) values
  ('TRD-FERT-DXB', 'Fertilizers', 144, 131, 9.0),
  ('TRD-AGRI-DXB', 'Agricultural bulk products', 114, 108, 5.3),
  ('TRD-IND-DXB', 'Industrial bulk materials', 118, 110, 6.8),
  ('OPS-LOG-DXB', 'Freight and documentation', 21, 18, 14.3);

insert into fact_crm_funnel (
  product_code,
  stage_name,
  rfq_count,
  conversion_pct
) values
  ('UREA', 'RFQ received', 286, 100),
  ('UREA', 'Qualified counterparty', 181, 63.3),
  ('UREA', 'Contracted', 42, 14.7),
  ('DAPMAP', 'RFQ received', 216, 100),
  ('DAPMAP', 'Qualified counterparty', 144, 66.7),
  ('DAPMAP', 'Contracted', 29, 13.4),
  ('NPK', 'RFQ received', 184, 100),
  ('NPK', 'Qualified counterparty', 119, 64.7),
  ('NPK', 'Contracted', 27, 14.7),
  ('WHEAT', 'RFQ received', 238, 100),
  ('WHEAT', 'Qualified counterparty', 151, 63.4),
  ('WHEAT', 'Contracted', 31, 13.0),
  ('FEED', 'RFQ received', 196, 100),
  ('FEED', 'Qualified counterparty', 124, 63.3),
  ('FEED', 'Contracted', 24, 12.2),
  ('INDLOTS', 'RFQ received', 140, 100),
  ('INDLOTS', 'Qualified counterparty', 86, 61.4),
  ('INDLOTS', 'Contracted', 18, 12.9);

insert into fact_counterparty_channel (
  channel_name,
  volume_aed_m,
  rfq_count,
  conversion_pct
) values
  ('Fertilizer distributors', 186, 164, 16.5),
  ('Agri co-ops', 154, 139, 18.1),
  ('Feed mill buyers', 141, 122, 14.8),
  ('Industrial fabricators', 128, 118, 13.6),
  ('Government tenders', 104, 96, 12.9),
  ('Trading houses', 92, 88, 11.4),
  ('Logistics partners', 76, 74, 10.8),
  ('Regional importers', 68, 61, 9.9),
  ('Food processors', 61, 58, 9.2),
  ('Construction suppliers', 55, 53, 8.7);

insert into fact_destination_market (
  market,
  region,
  rfq_count,
  conversion_pct,
  pipeline_value_aed_m
) values
  ('UAE', 'GCC', 318, 11.5, 215),
  ('Saudi Arabia', 'GCC', 206, 9.4, 192),
  ('Kenya', 'East Africa', 188, 14.8, 174),
  ('India', 'South Asia', 247, 9.8, 142),
  ('Kazakhstan', 'CIS', 136, 13.9, 118),
  ('Turkey', 'MENA', 118, 8.7, 84),
  ('Egypt', 'North Africa', 106, 9.4, 92),
  ('China', 'APAC', 88, 7.2, 57);

create or replace view vw_executive_kpis as
select
  (select sum(contracted_mt) from fact_supply_portfolio) as contracted_volume_mt,
  (select sum(exposure_aed_m) from fact_trade_position where shipment_stage <> 'Settled') as open_trade_exposure_aed_m,
  (select round(avg(margin_pct), 2) from fact_cost_center_rollup where cost_center_code like 'TRD-%') as weighted_margin_pct,
  (select count(*) from fact_trade_position where risk_rating in ('Watch', 'High')) as priority_trade_count;
