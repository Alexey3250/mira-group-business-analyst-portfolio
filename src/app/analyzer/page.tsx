"use client";

import { useI18n } from "@/i18n";
import { DeskTitle } from "@/components/desk";
import TradeWorkbench from "@/components/dashboard/TradeWorkbench";
import ExportPdfButton from "@/components/ExportPdfButton";

export default function AnalyzerPage() {
  const { t } = useI18n();
  return (
    <div className="animate-fade-in">
      <DeskTitle title={t.workbench.title} sub={t.workbench.sub} right={<ExportPdfButton section="analyzer" />} />
      <div className="px-5 py-5 sm:px-7">
        <TradeWorkbench />
      </div>
    </div>
  );
}
