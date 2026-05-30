# MIRA L.L.C. Bulk Trading Operations Cockpit

Business analyst portfolio project for a Dubai-based Business Analyst role at M I R A L.L.C.

This is a targeted operations intelligence concept, not a generic coding sample. It models a specialized bulk trading arm under corporate operations, focused on fertilizers, agricultural bulk products, and industrial bulk materials. The app translates BA responsibilities into a working Next.js dashboard with CRM/RFQ flow, SAP-style controls, shipment execution, Power BI-style reporting, SQL-backed mock data, and documentation suitable for stakeholder review.

## Business Case

Bulk trading visibility can fragment quickly when RFQs, supplier offers, customer commitments, logistics documents, SAP cost centers, and management reporting sit in separate tools. A Business Analyst should be able to define requirements, map data flows, monitor exceptions, and give management a clear view of operating risk.

This project shows how those requirements can become a practical management platform:

- consolidate fertilizer, agricultural bulk, and industrial material activity into one reporting layer
- make RFQ, contract, shipment, SAP, and Power BI handoffs visible to management
- monitor open trade exposure, landed margin, shipment status, and counterparty risk
- track source-to-target mapping quality before numbers reach leadership dashboards
- document the integration architecture behind the operating cockpit

All figures are synthetic and candidate-generated. The repo avoids private client, counterparty, employee, and confidential company data.

## Live Product Scope

### Tab 1: Bulk Supply Portfolio

- product cards for granular urea, DAP/MAP phosphates, NPK blends, milling wheat, feed corn/barley, and industrial material lots
- contracted, shipped, in-transit, and open MT
- revenue by product line
- service reliability by product family
- supplier-backed versus customer-backed coverage

### Tab 2: Trade Execution Desk

- open bulk contracts tracker for fertilizers, agricultural bulk products, and industrial bulk materials
- P&L by trade
- counterparty exposure
- shipment pipeline from contract to shipment to delivery to settlement
- SAP-style cost center rollup

### Tab 3: RFQ / CRM Pipeline

- RFQ stages from received to qualified, spec/credit approved, offer issued, and contracted
- top counterparty channels by volume
- destination market heatmap
- conversion rates by product family

### Tab 4: Data Architecture Diagram

- Trade CRM to SAP to Power BI flow
- ETL steps for extraction, transformation, validation, load, and reporting
- multi-owner data model across commercial, logistics, finance, and BI
- BA documentation pack: requirements matrix, data dictionary, data flow diagram, user guidelines, and ETL rules

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS
- Recharts
- Supabase/Postgres-compatible seed SQL
- Vercel-ready deployment configuration

## Live Data Layer

The dashboard supplements the seeded case-study data with no-key public feeds through server-side Next.js route handlers.

- Frankfurter: USD exchange-rate exposure for AED, RUB, KZT, and EUR.
- Stooq public CSV quotes: bulk trading proxies for natural gas, wheat, corn, soybeans, copper, and WTI crude.
- EU Agri-food Data Portal: regional cereal and fertiliser price references.
- Open-Meteo: live port weather for logistics and demurrage risk.

`src/app/api/live-market/route.ts` converts raw FX and commodity values into watch points for fertilizer input costs, agricultural bulk margin, industrial material exposure, freight assumptions, and CIS settlement exposure. The UI reads only from `/api/live-market`, not directly from third-party services, which keeps browser-side CORS and reliability issues away from the recruiter-facing dashboard and allows server-side caching with `s-maxage=300`.

`src/app/api/process-trade/route.ts` demonstrates automated extraction and processing from multiple systems. A mock CRM RFQ is enriched with live market data, FX conversion, EU sourcing prices, and port weather, then transformed into a simulated SAP ERP JSON payload. The page displays a terminal-style processing log so reviewers can see the ETL flow rather than just the final numbers.

## Deal Processing Prototype

The dashboard includes a working deal margin analyzer:

- user-adjustable mock CRM trade inputs for product, quantity, price, currency, and port
- live benchmark conversion to USD/MT
- EU regional sourcing comparison and cheapest-market highlight
- live port weather risk for Jebel Ali, Rotterdam, or Santos
- gross and landed margin calculation
- simulated SAP ERP payload with cost center, material group, FX, value, margin, and risk status
- visible processing log showing extraction, transformation, and load-style steps

## Integration Control Center

The dashboard includes a bulk-trading CRM to SAP control center aligned to Business Analyst responsibilities:

- counterparty CRM sync health
- product master and specification mapping health
- SAP cost center mapping health
- trade settlement ETL health
- exception queue by rule, source, severity, owner, and SLA
- source-to-target mapping quality checks

This section is intentionally operational: it shows how a BA would monitor the data exchange layer before reports reach Power BI.

## Performance Notes

The dashboard is structured to keep the first screen quick:

- server-rendered App Router page for the static shell, headline, KPI cards, and source notes
- client JavaScript isolated to the interactive tab controller and tab content
- lazy-loaded tab chunks for Supply Portfolio, Trade Execution, RFQ/CRM, and Architecture views
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
|   |-- components/
|   `-- data/
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

Public references and user-provided framing used for this case study:

- User-provided scope that MIRA L.L.C. corporate operations maintain a specialized bulk trading arm focused on fertilizers, agricultural bulk products, and industrial bulk materials.
- M I R A L.L.C Business Analyst job posting signals for CRM, SAP, Power BI, SQL, ETL, documentation, and trading/export lifecycle requirements.
- M I R A L.L.C trading-related role signals for fertilizers trading, shipment documentation, contract execution, reconciliation, and logistics-cost workflow.

The repo avoids scraped client records, private company systems, and confidential commercial information.
