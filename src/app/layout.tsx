import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const uiSans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const uiMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mira Group - Operations Intelligence",
  description:
    "Business Analyst portfolio: an operations intelligence platform for Mira Group - real estate pipeline, commodities desk, CRM funnel, and SAP/ETL integration.",
  icons: {
    icon: "/mira-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${uiSans.variable} ${uiMono.variable}`}>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
