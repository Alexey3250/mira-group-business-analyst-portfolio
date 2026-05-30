"use client";

import { ExternalLink, RadioTower } from "lucide-react";
import { useI18n } from "@/i18n";

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

export default function CommodityPredictionSignal() {
  const { t } = useI18n();

  return (
    <section className="panel prediction-signal overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketSchema) }}
      />

      <div className="prediction-signal-grid">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill-info">
              <RadioTower className="h-3 w-3" aria-hidden="true" />
              {t.trading.prediction.badge}
            </span>
            <span className="pill-neutral">{t.trading.prediction.embed}</span>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-ink">{t.trading.prediction.title}</h2>
          <p className="mt-1 max-w-2xl text-[13px] leading-6 text-sub">
            {t.trading.prediction.description}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <SignalMetric label={t.trading.prediction.market} value={t.trading.prediction.marketValue} />
            <SignalMetric label={t.trading.prediction.yes} value="71%" />
            <SignalMetric label={t.trading.prediction.no} value="30%" />
          </div>

          <a
            href={marketUrl}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-2xs font-semibold text-white transition hover:bg-ink/90"
          >
            {t.trading.prediction.view}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <figure
          className="prediction-signal-figure relative m-0 hidden h-[350px] overflow-hidden bg-[#111820] sm:block"
          aria-label="Polymarket prediction market: US x Iran permanent peace deal by December 31, 2026?"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          <iframe
            title="US x Iran permanent peace deal by December 31, 2026? - Polymarket Prediction Market"
            src={`https://embed.polymarket.com/market?market=${marketSlug}&theme=dark&width=450&height=350`}
            width="100%"
            height="350"
            loading="lazy"
            className="h-[350px] w-full border-0"
          />
          <a
            href={marketUrl}
            aria-label="View on Polymarket"
            target="_blank"
            rel="noopener"
            className="absolute right-5 top-4 z-10 h-6 w-[120px]"
          />
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
    <div className="rounded-md bg-panel p-3">
      <p className="text-2xs uppercase tracking-wider text-sub">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-ink">{value}</p>
    </div>
  );
}
