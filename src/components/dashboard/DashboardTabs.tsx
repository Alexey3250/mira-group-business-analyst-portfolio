"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import type { LucideIcon } from "lucide-react";
import { Building2, GitBranch, Handshake, Ship } from "lucide-react";

type TabKey = "realEstate" | "trading" | "crm" | "architecture";

type Tab = {
  id: TabKey;
  label: string;
  icon: LucideIcon;
};

const tabs: Tab[] = [
  { id: "realEstate", label: "Real Estate Pipeline", icon: Building2 },
  { id: "trading", label: "Commodities Desk", icon: Ship },
  { id: "crm", label: "CRM Funnel", icon: Handshake },
  { id: "architecture", label: "Data Architecture", icon: GitBranch },
];

const tabImporters = {
  realEstate: () => import("./RealEstateTab"),
  trading: () => import("./TradingTab"),
  crm: () => import("./CrmTab"),
  architecture: () => import("./ArchitectureTab"),
};

const RealEstateTab = dynamic(tabImporters.realEstate, {
  loading: TabSkeleton,
  ssr: false,
});
const TradingTab = dynamic(tabImporters.trading, {
  loading: TabSkeleton,
  ssr: false,
});
const CrmTab = dynamic(tabImporters.crm, {
  loading: TabSkeleton,
  ssr: false,
});
const ArchitectureTab = dynamic(tabImporters.architecture, {
  loading: TabSkeleton,
  ssr: false,
});

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("realEstate");
  const [isPending, startTransition] = useTransition();
  const prefetchedTabs = useRef(new Set<TabKey>(["realEstate"]));

  const prefetchTab = useCallback((tabId: TabKey) => {
    if (prefetchedTabs.current.has(tabId)) return;
    prefetchedTabs.current.add(tabId);
    void tabImporters[tabId]();
  }, []);

  useEffect(() => {
    const prefetchRemainingTabs = () => {
      tabs.forEach((tab) => {
        if (tab.id !== activeTab) prefetchTab(tab.id);
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(prefetchRemainingTabs, {
        timeout: 2500,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timer = globalThis.setTimeout(prefetchRemainingTabs, 1200);

    return () => globalThis.clearTimeout(timer);
  }, [activeTab, prefetchTab]);

  const ActiveTab = {
    realEstate: RealEstateTab,
    trading: TradingTab,
    crm: CrmTab,
    architecture: ArchitectureTab,
  }[activeTab];

  return (
    <>
      <nav
        aria-label="Dashboard sections"
        className="grid gap-2 rounded-lg bg-white p-2 shadow-panel ring-1 ring-slate-200 md:grid-cols-4"
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            onActivate={() => {
              prefetchTab(tab.id);
              startTransition(() => setActiveTab(tab.id));
            }}
            onIntent={() => prefetchTab(tab.id)}
          />
        ))}
      </nav>

      <section aria-busy={isPending} aria-live="polite">
        <ActiveTab />
      </section>
    </>
  );
}

function TabButton({
  tab,
  active,
  onActivate,
  onIntent,
}: {
  tab: Tab;
  active: boolean;
  onActivate: () => void;
  onIntent: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      aria-selected={active}
      onClick={onActivate}
      onFocus={onIntent}
      onMouseEnter={onIntent}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{tab.label}</span>
    </button>
  );
}

function TabSkeleton() {
  return (
    <div className="grid gap-5" role="status" aria-label="Loading dashboard section">
      <div className="grid project-grid gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-lg bg-white shadow-panel ring-1 ring-slate-200"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-lg bg-white shadow-panel ring-1 ring-slate-200" />
        <div className="h-80 animate-pulse rounded-lg bg-white shadow-panel ring-1 ring-slate-200" />
      </div>
    </div>
  );
}
