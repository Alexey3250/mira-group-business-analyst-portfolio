"use client";

import { Download } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n";

type ExportSection = "overview" | "commodities" | "real-estate" | "crm" | "analyzer" | "architecture";

type ExportPdfButtonProps = {
  section?: ExportSection;
  className?: string;
};

export default function ExportPdfButton({ section, className = "ghost-btn" }: ExportPdfButtonProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const exportSection = section ?? sectionFromPath(pathname);

  return (
    <a
      className={className}
      href="/mira-group-business-analyst-portfolio.pdf"
      download={`mira-${exportSection}-business-analyst-portfolio.pdf`}
      aria-label="Download portfolio PDF"
    >
      <Download className="h-3.5 w-3.5" />
      {t.nav.export}
    </a>
  );
}

function sectionFromPath(pathname: string): ExportSection {
  if (pathname.startsWith("/commodities") || pathname.startsWith("/trading")) return "commodities";
  if (pathname.startsWith("/real-estate")) return "real-estate";
  if (pathname.startsWith("/crm")) return "crm";
  if (pathname.startsWith("/analyzer")) return "analyzer";
  if (pathname.startsWith("/architecture")) return "architecture";
  return "overview";
}
