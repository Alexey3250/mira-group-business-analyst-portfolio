"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CandlestickChart,
  Users,
  Zap,
  GitBranch,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { I18nProvider, useI18n } from "@/i18n";
import { ANALYST_NAME, GITHUB_URL, TELEGRAM_URL, WHATSAPP_URL } from "@/components/AnalystCard";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ShellFrame>{children}</ShellFrame>
    </I18nProvider>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/report")) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f2ed]">
      <Header />
      <main className="mx-auto w-full max-w-[1360px] flex-1 border-x border-line bg-[#fdfdfb] shadow-[0_0_30px_rgba(17,17,17,0.035)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}

const routes: { href: string; key: "overview" | "realEstate" | "trading" | "crm" | "analyzer" | "architecture"; icon: LucideIcon }[] = [
  { href: "/", key: "overview", icon: LayoutDashboard },
  { href: "/commodities", key: "trading", icon: CandlestickChart },
  { href: "/real-estate", key: "realEstate", icon: Building2 },
  { href: "/crm", key: "crm", icon: Users },
  { href: "/analyzer", key: "analyzer", icon: Zap },
  { href: "/architecture", key: "architecture", icon: GitBranch },
];

function LogoMark() {
  return (
    <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-[3px] bg-black ring-1 ring-black/10" aria-hidden>
      <Image
        src="/mira-logo.svg"
        alt=""
        fill
        sizes="32px"
        priority
        className="object-cover"
      />
    </span>
  );
}

function Header() {
  const { t, toggle } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between border-x border-line bg-white/90 px-5 py-3 sm:px-7">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-wide text-ink">{t.brand.name}</span>
            <span className="block text-2xs font-medium uppercase tracking-wider2 text-faint">{t.brand.sub}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {routes.map((r) => {
            const active = r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
            const Icon = r.icon;
            return (
              <Link key={r.href} href={r.href} className={active ? "nav-item-active" : "nav-item"}>
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                {t.nav[r.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <span className="pill-pos hidden sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#639922]" />
            {t.nav.live}
          </span>
          <button onClick={toggle} className="ghost-btn">
            {t.nav.lang}
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            title={`${ANALYST_NAME} - GitHub`}
            className="hidden sm:block"
          >
            <Image
              src="/analyst-avatar.jpg"
              alt={ANALYST_NAME}
              width={28}
              height={28}
              sizes="28px"
              unoptimized
              className="h-7 w-7 rounded-full object-cover object-top ring-1 ring-line transition hover:ring-ink/40"
            />
          </a>
          <button onClick={() => setOpen((v) => !v)} className="text-ink lg:hidden" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-3 py-2 lg:hidden">
          {routes.map((r) => {
            const active = r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
            const Icon = r.icon;
            return (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-[13px] ${active ? "bg-panel font-medium text-ink" : "text-sub"}`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {t.nav[r.key]}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line bg-white/70">
      <div className="mx-auto w-full max-w-[1360px] border-x border-line px-5 py-5 sm:px-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="max-w-3xl text-2xs leading-relaxed text-faint">{t.footer.note}</p>
          <p className="text-2xs text-faint">{t.footer.candidate}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Image
            src="/analyst-avatar.jpg"
            alt={ANALYST_NAME}
            width={36}
            height={36}
            sizes="36px"
            unoptimized
            className="h-9 w-9 rounded-full object-cover object-top ring-1 ring-line"
          />
          <div className="leading-tight">
            <p className="text-2xs text-faint">{t.profile.builtBy}</p>
            <p className="text-[13px] font-semibold text-ink">{ANALYST_NAME}</p>
            <p className="text-2xs">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-c-blue hover:underline">
                {t.profile.github}
              </a>
              <span className="text-faint"> / </span>
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="text-c-blue hover:underline">
                {t.profile.telegram}
              </a>
              <span className="text-faint"> / </span>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-c-blue hover:underline">
                {t.profile.whatsapp}
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
