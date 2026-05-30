"use client";

import Image from "next/image";
import { MapPin, Linkedin, Github } from "lucide-react";
import { useI18n } from "@/i18n";

export const LINKEDIN_URL = "https://www.linkedin.com/in/efimik/";
export const GITHUB_URL = "https://github.com/efimik";
export const ANALYST_NAME = "Alexey Efimik";

const skills = ["Business Economics", "Google Data Analytics", "SQL", "Power BI", "CRM / SAP", "Next.js"];

export default function AnalystCard({ className = "" }: { className?: string }) {
  const { t, tr } = useI18n();
  const rootClass = className ? `overflow-hidden rounded-lg border border-line ${className}` : "overflow-hidden rounded-lg border border-line";

  return (
    <div className={rootClass}>
      <div className="flex gap-3 p-3">
        <Image
          src="/analyst-avatar.jpg"
          alt={ANALYST_NAME}
          width={68}
          height={68}
          sizes="68px"
          unoptimized
          className="h-[68px] w-[68px] shrink-0 rounded-md object-cover object-top"
        />
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-ink">{ANALYST_NAME}</div>
          <div className="text-2xs text-sub">{t.profile.role}</div>
          <div className="mt-0.5 flex items-center gap-1 text-2xs text-faint">
            <MapPin className="h-3 w-3" strokeWidth={1.75} />
            {t.profile.location}
          </div>
          <div className="mt-2 flex gap-1.5">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-2xs font-medium text-white transition hover:bg-ink/90"
            >
              <Linkedin className="h-3 w-3" strokeWidth={1.75} />
              {t.profile.linkedin}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-2xs font-medium text-sub transition hover:bg-panel hover:text-ink"
            >
              <Github className="h-3 w-3" strokeWidth={1.75} />
              {t.profile.github}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line px-3 py-2.5">
        <p className="text-2xs leading-relaxed text-sub">{t.profile.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {skills.map((s) => (
            <span key={s} className="rounded-md bg-panel px-2 py-0.5 text-2xs font-medium text-sub">
              {tr(s)}
            </span>
          ))}
        </div>
        <p className="mt-2.5 flex items-start gap-1.5 rounded-md bg-pos-bg px-2.5 py-1.5 text-2xs leading-relaxed text-pos">
          {t.profile.relocation}
        </p>
        <p className="mt-2 text-2xs text-faint">
          <span className="font-medium text-sub">{t.profile.languagesLabel}:</span> {t.profile.languages}
        </p>
      </div>
    </div>
  );
}
