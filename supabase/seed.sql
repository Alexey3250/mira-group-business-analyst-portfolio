-- Mira Group Operations Intelligence Platform
-- Supabase/Postgres-compatible schema and seed data.
-- Data is synthetic and candidate-generated for portfolio demonstration only.

drop table if exists fact_investor_geography;
drop table if exists fact_broker_performance;
drop table if exists fact_crm_funnel;
drop table if exists fact_cost_center_rollup;
drop table if exists fact_trade_position;
drop table if exists fact_project_inventory;
drop table if exists dim_project;

create table dim_project (
  project_code text primary key,
  project_name text not null,
  location text not null,
  brand_partner text not null,
  handover_quarter text not null,
  starting_price_aed numeric(14, 2) not null
);

create table fact_project_inventory (
  project_code text references dim_project(project_code),
  total_units integer not null,
  sold_units integer not null,
  reserved_units integer not null,
  available_units integer not null,
  revenue_aed_m numeric(12, 2) not null,
  broker_channel_pct numeric(5, 2) not null,
  direct_channel_pct numeric(5, 2) not null,
  construction_pct numeric(5, 2) not null,
  snapshot_date date not null default current_date,
  primary key (project_code, snapshot_date)
);

create table fact_trade_position (
  trade_id text primary key,
  commodity_group text not null check (commodity_group in ('Fertilizers', 'Metals', 'Grains')),
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
  project_code text references dim_project(project_code),
  stage_name text not null,
  lead_count integer not null,
  conversion_pct numeric(6, 2) not null,
  snapshot_date date not null default current_date,
  primary key (project_code, stage_name, snapshot_date)
);

create table fact_broker_performance (
  broker_name text primary key,
  volume_aed_m numeric(12, 2) not null,
  lead_count integer not null,
  conversion_pct numeric(6, 2) not null
);

create table fact_investor_geography (
  market text primary key,
  region text not null,
  lead_count integer not null,
  conversion_pct numeric(6, 2) not null,
  pipeline_value_aed_m numeric(12, 2) not null
);

insert into dim_project (
  project_code,
  project_name,
  location,
  brand_partner,
  handover_quarter,
  starting_price_aed
) values
  ('RICHMOND', 'Richmond District', 'Discovery Gardens, Al Furjan', 'John Richmond', 'Q1 2029', 880000),
  ('TRUSSARDI2', 'Trussardi Residences Phase II', 'Discovery Gardens, Al Furjan', 'Trussardi Casa', 'Q2 2027', 1100000),
  ('TRUSSARDI1', 'Trussardi Residences', 'Al Furjan, Dubai', 'Trussardi Casa', 'Q4 2026', 3400000),
  ('BENTLEY', 'Mira Villas designed by Bentley Home', 'District 11, Meydan', 'Bentley Home', 'Q4 2026', 27200000),
  ('FERRE', 'Gianfranco Ferre Residences', 'Al Marjan Island, Ras Al Khaimah', 'Gianfranco Ferre Home', 'Q1 2028', 1600000),
  ('ELIESAAB', 'POST Hotel & Residences by ELIE SAAB', 'Andermatt, Switzerland', 'ELIE SAAB Maison', 'Q3 2027', 20500000);

insert into fact_project_inventory (
  project_code,
  total_units,
  sold_units,
  reserved_units,
  available_units,
  revenue_aed_m,
  broker_channel_pct,
  direct_channel_pct,
  construction_pct
) values
  ('RICHMOND', 1420, 418, 136, 866, 746, 68, 32, 9),
  ('TRUSSARDI2', 366, 213, 41, 112, 472, 61, 39, 31),
  ('TRUSSARDI1', 165, 139, 12, 14, 586, 54, 46, 72),
  ('BENTLEY', 36, 28, 3, 5, 912, 47, 53, 67),
  ('FERRE', 485, 162, 58, 265, 391, 72, 28, 18),
  ('ELIESAAB', 52, 21, 7, 24, 648, 39, 61, 38);

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
  ('MTR-2406-118', 'Fertilizers', 'Granular urea', 'CIS Agri Export', 'Black Sea', 'Shipment', 18500, 842, 23.6, 'TRD-FERT-DXB', 'CFR', '2026-06-18', 'Watch'),
  ('MTR-2406-121', 'Metals', 'Aluminum billets', 'Gulf Metals DMCC', 'GCC', 'Delivery', 4200, 515, 18.2, 'TRD-MET-DXB', 'FOB', '2026-06-09', 'Low'),
  ('MTR-2406-127', 'Grains', 'Milling wheat', 'Black Sea Grain Co.', 'CIS', 'Contract', 27000, 366, 31.4, 'TRD-AGR-DXB', 'CIF', '2026-07-03', 'High'),
  ('MTR-2406-132', 'Fertilizers', 'NPK blend', 'East Africa Inputs', 'Africa', 'Settled', 11200, 610, 9.7, 'TRD-FERT-DXB', 'CIP', '2026-05-24', 'Low'),
  ('MTR-2406-135', 'Metals', 'Copper cathodes', 'Caspian Industrial Supply', 'CIS', 'Shipment', 1600, -124, 26.8, 'TRD-MET-DXB', 'DAP', '2026-06-27', 'Watch'),
  ('MTR-2406-141', 'Grains', 'Feed barley', 'Levant Grain Partners', 'MENA', 'Delivery', 21800, 294, 15.1, 'TRD-AGR-DXB', 'CFR', '2026-06-12', 'Low');

insert into fact_cost_center_rollup (
  cost_center_code,
  commodity_group,
  revenue_aed_m,
  cost_aed_m,
  margin_pct
) values
  ('TRD-FERT-DXB', 'Fertilizers', 138, 126, 8.7),
  ('TRD-MET-DXB', 'Metals', 111, 104, 6.3),
  ('TRD-AGR-DXB', 'Grains', 96, 91, 5.2),
  ('OPS-LOG-DXB', 'Logistics', 18, 15, 16.1);

insert into fact_crm_funnel (
  project_code,
  stage_name,
  lead_count,
  conversion_pct
) values
  ('RICHMOND', 'Inquiry', 472, 100),
  ('RICHMOND', 'Qualified', 281, 59.5),
  ('RICHMOND', 'Closed', 49, 10.4),
  ('TRUSSARDI2', 'Inquiry', 396, 100),
  ('TRUSSARDI2', 'Qualified', 244, 61.6),
  ('TRUSSARDI2', 'Closed', 57, 14.4),
  ('TRUSSARDI1', 'Inquiry', 218, 100),
  ('TRUSSARDI1', 'Qualified', 141, 64.7),
  ('TRUSSARDI1', 'Closed', 38, 17.4),
  ('BENTLEY', 'Inquiry', 84, 100),
  ('BENTLEY', 'Qualified', 67, 79.8),
  ('BENTLEY', 'Closed', 18, 21.4),
  ('FERRE', 'Inquiry', 264, 100),
  ('FERRE', 'Qualified', 139, 52.7),
  ('FERRE', 'Closed', 26, 9.8),
  ('ELIESAAB', 'Inquiry', 78, 100),
  ('ELIESAAB', 'Qualified', 52, 66.7),
  ('ELIESAAB', 'Closed', 11, 14.1);

insert into fact_broker_performance (
  broker_name,
  volume_aed_m,
  lead_count,
  conversion_pct
) values
  ('Driven Properties', 186, 164, 16.5),
  ('Seven Luxury Real Estate', 154, 139, 18.1),
  ('Aeon & Trisl', 141, 122, 14.8),
  ('Metropolitan Premium', 128, 118, 13.6),
  ('Fam Properties', 104, 96, 12.9),
  ('Betterhomes', 92, 88, 11.4),
  ('D&B Properties', 76, 74, 10.8),
  ('Allsopp & Allsopp', 68, 61, 9.9),
  ('Provident Estate', 61, 58, 9.2),
  ('Haus & Haus', 55, 53, 8.7);

insert into fact_investor_geography (
  market,
  region,
  lead_count,
  conversion_pct,
  pipeline_value_aed_m
) values
  ('Russia', 'CIS', 428, 14.8, 374),
  ('Kazakhstan', 'CIS', 236, 13.9, 188),
  ('UAE', 'GCC', 318, 11.5, 215),
  ('India', 'South Asia', 247, 9.8, 142),
  ('UK', 'Europe', 142, 10.2, 131),
  ('Turkey', 'MENA', 118, 8.7, 84),
  ('Saudi Arabia', 'GCC', 106, 9.4, 92),
  ('China', 'APAC', 88, 7.2, 57);

create or replace view vw_executive_kpis as
select
  (select sum(revenue_aed_m) from fact_project_inventory) as portfolio_revenue_aed_m,
  (select sum(exposure_aed_m) from fact_trade_position where shipment_stage <> 'Settled') as open_trade_exposure_aed_m,
  (select round(sum(case when stage_name = 'Closed' then lead_count else 0 end)::numeric / nullif(sum(case when stage_name = 'Inquiry' then lead_count else 0 end), 0) * 100, 2) from fact_crm_funnel) as crm_conversion_pct,
  (select round(sum(case when region = 'CIS' then lead_count else 0 end)::numeric / nullif(sum(lead_count), 0) * 100, 2) from fact_investor_geography) as cis_lead_share_pct;
