# Mira Group Operations Intelligence Platform

Business analyst portfolio project for a Dubai-based Business Analyst role at M I R A L.L.C.

This is a targeted operations intelligence concept, not a generic coding sample. It translates the role requirements into a working dashboard and supporting analysis pack: CRM to SAP integration, commodity trading controls, Power BI-style reporting, SQL-backed mock data, and documentation suitable for stakeholder review.

## Business Case

Mira's public footprint combines real estate development, broker-led sales, international trade, and multi-country operations. The Business Analyst job posting asks for CRM support, SAP ERP integration understanding, Power BI dashboards, SQL, ETL, data flow diagrams, and trading/export lifecycle awareness.

This project shows how those requirements can be turned into a practical management platform:

- consolidate multi-entity commercial activity into one reporting layer
- make CRM, SAP, and operational handoffs visible to management
- track branded real estate project sales and broker performance
- monitor commodity trade exposure, P&L, shipment status, and cost centers
- document the integration architecture behind the dashboard

All figures are synthetic and candidate-generated. Public company/project names are used only as portfolio context.

## Live Product Scope

### Tab 1: Real Estate Pipeline

- project cards for public Mira Developments projects including Richmond District, Trussardi Residences Phase II, Trussardi Residences, Mira Villas designed by Bentley Home, Gianfranco Ferre Residences, and POST Hotel & Residences by ELIE SAAB
- units sold, reserved, and available
- revenue by project
- handover timeline
- broker channel versus direct sales breakdown

### Tab 2: Commodities Trading Desk

- open positions tracker for fertilizers, metals, and grains
- P&L by trade
- counterparty exposure
- shipment pipeline from contract to shipment to delivery to settlement
- SAP-style cost center rollup

### Tab 3: CRM Funnel

- lead stages from Inquiry to Qualified to Site Visit to Offer to Closed
- top 10 broker performance by volume
- investor geography heatmap with CIS demand signal
- conversion rates by project

### Tab 4: Data Architecture Diagram

- CRM to SAP to Power BI flow
- ETL steps for extraction, transformation, validation, load, and reporting
- multi-entity data ownership model
- BA documentation pack: requirements matrix, data dictionary, data flow diagram, user guidelines, and ETL rules

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS
- Recharts
- Supabase/Postgres-compatible seed SQL
- Vercel-ready deployment configuration

## Live Data Layer

The dashboard supplements the seeded case-study data with no-key public feeds through a cached Next.js route handler at `src/app/api/live-market/route.ts`.

- Frankfurter: USD exchange-rate exposure for AED, RUB, KZT, and EUR.
- Stooq public CSV quotes: commodity market proxies for gold, silver, copper, wheat, corn, and WTI crude.

The route converts raw FX and commodity values into trade-risk watch points for metals, grains, logistics-cost assumptions, and CIS settlement exposure. The UI reads only from `/api/live-market`, not directly from third-party services. This keeps browser-side CORS and reliability issues out of the recruiter-facing dashboard and allows server-side caching with `s-maxage=300`.

## Integration Control Center

The dashboard now includes a CRM to SAP control center designed to align directly with the Business Analyst job requirements:

- CRM lead sync health
- SAP cost center mapping health
- trade settlement ETL health
- broker attribution controls
- exception queue by rule, source, severity, owner, and SLA
- source-to-target mapping quality checks

This section is intentionally operational: it shows how a BA would monitor the data exchange layer before reports reach Power BI.

## Performance Notes

The dashboard is structured to keep the first screen quick:

- server-rendered App Router page for the static shell, headline, KPI cards, and source notes
- client JavaScript isolated to the interactive tab controller and tab content
- lazy-loaded tab chunks for Real Estate, Commodities, CRM, and Architecture views
- idle prefetch for inactive tabs after the first paint, plus hover/focus prefetch for fast tab switching
- `force-static` page generation with a one-day revalidation window
- Next.js package import optimization for `lucide-react` and `recharts`
- `next/font` Geist loading through the root layout
- lightweight skeletons while chart-heavy chunks load

## Repository Map

```text
.
|-- docs/
|   |-- architecture.md
|   |-- dashboard-spec.md
|   |-- data-dictionary.md
|   |-- kpi-framework.md
|   |-- process-map.md
|   |-- project-brief.md
|   `-- requirements.md
|-- src/
|   |-- app/
|   |-- data/
|   `-- App.tsx
|-- supabase/
|   `-- seed.sql
|-- package.json
`-- README.md
```

## Run Locally

```bash
npm install
npm run dev
```

The app runs as a local Next.js project. The included Supabase SQL is a seedable backend model; the deployed dashboard currently uses the same mock data embedded in `src/data/operationsData.ts` so no live API keys are required.

## Verification

Current automated checks:

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

For bundle inspection:

```bash
npm run analyze
```

## Evidence Sources

Public references used for framing:

- Mira Developments public project catalogue for real estate project names, locations, public handover windows, and starting-price context.
- M I R A L.L.C Business Analyst job posting for CRM, SAP, Power BI, SQL, ETL, documentation, and trading/export lifecycle requirements.
- M I R A L.L.C trading-related job postings for fertilizers trading, shipment documentation, contract execution, reconciliation, and logistics-cost workflow signals.
- Mira Group public site for trade, real estate, business consultation, travel, and Dubai/global operations context.

The repo avoids private data, scraped client records, and confidential company information.
