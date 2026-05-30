import { ExternalLink, RadioTower } from "lucide-react";

const marketUrl = "https://polymarket.com/event/us-x-iran-permanent-peace-deal-by";
const marketSlug = "us-x-iran-permanent-peace-deal-by-december-31-2026-961-587-341-574-555";
const marketName = "US x Iran permanent peace deal by December 31, 2026?";

const marketSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: marketName,
  description: "Prediction market: Yes 71% / No 30% on Polymarket.",
  url: marketUrl,
  publisher: {
    "@type": "Organization",
    name: "Polymarket",
    url: "https://polymarket.com",
  },
};

export default function PredictionMarketSignal() {
  return (
    <section className="rounded-lg bg-slate-950 p-4 text-white shadow-panel ring-1 ring-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketSchema) }}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md bg-sky-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-sky-200 ring-1 ring-sky-400/20">
              <RadioTower className="h-3.5 w-3.5" aria-hidden="true" />
              Geopolitical freight signal
            </span>
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-normal text-slate-200 ring-1 ring-white/10">
              Prediction market embed
            </span>
          </div>

          <h2 className="mt-3 text-lg font-semibold">
            Hormuz and Gulf-region risk monitor
          </h2>
          <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-300">
            A bulk trading desk would watch geopolitical signals alongside crude,
            freight, FX, and port conditions. This embed adds a market-implied view
            of regional peace-deal expectations as a qualitative logistics risk input.
          </p>

          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <SignalMetric label="Market" value="US x Iran peace deal" />
            <SignalMetric label="Yes probability" value="71%" />
            <SignalMetric label="No probability" value="30%" />
          </div>

          <a
            href={marketUrl}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 transition hover:bg-white/15"
          >
            View on Polymarket
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <figure
          className="polymarket-embed relative m-0 w-full overflow-hidden rounded-lg bg-[#111820] ring-1 ring-white/10 xl:w-[450px]"
          id="polymarket-us-x-iran-permanent-peace-deal-by-december-31-2026-961-587-341-574-555"
          aria-label="Polymarket prediction market: US x Iran permanent peace deal by December 31, 2026?"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          <div className="relative h-[350px] w-full">
            <iframe
              title="US x Iran permanent peace deal by December 31, 2026? - Polymarket Prediction Market"
              src={`https://embed.polymarket.com/market?market=${marketSlug}&theme=dark&width=450&height=350`}
              width="450"
              height="350"
              className="h-[350px] w-full border-0"
              allowTransparency
            />
            <a
              href={marketUrl}
              aria-label="View on Polymarket"
              target="_blank"
              rel="noopener"
              className="absolute right-5 top-4 z-10 h-6 w-[120px]"
            />
          </div>
          <figcaption className="sr-only">
            <strong>{marketName}</strong>
            <br />
            Yes 71% / No 30%
            <br />
            <a href={marketUrl}>View full market and trade on Polymarket</a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function SignalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
