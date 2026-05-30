"use client";

import { useI18n } from "@/i18n";
import { DeskTitle } from "@/components/desk";
import SystemArchitecture from "@/components/dashboard/SystemArchitecture";
import ExportPdfButton from "@/components/ExportPdfButton";

export default function ArchitecturePage() {
  const { t } = useI18n();
  return (
    <div className="animate-fade-in">
      <DeskTitle title={t.architecture.title} sub={t.architecture.sub} right={<ExportPdfButton section="architecture" />} />
      <div className="px-5 py-5 sm:px-7">
        <SystemArchitecture />
      </div>
    </div>
  );
}
