import { PDFDocument, PageSizes, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  brokers,
  commodityExposure,
  crmFunnel,
  groupKpis,
  investorGeography,
  priceFeed,
  projects,
  realEstateKpis,
  sapStatus,
  tradeBlotter,
  tradingKpis,
} from "@/data/miraData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExportSection = "overview" | "commodities" | "real-estate" | "crm" | "analyzer" | "architecture";

type Report = {
  pdf: PDFDocument;
  page: PDFPage;
  regular: PDFFont;
  bold: PDFFont;
  y: number;
};

const margin = 38;
const pageWidth = PageSizes.A4[0];
const pageHeight = PageSizes.A4[1];
const contentWidth = pageWidth - margin * 2;

const sectionLabels: Record<ExportSection, string> = {
  overview: "Group Overview",
  commodities: "Commodities Desk",
  "real-estate": "Real Estate Pipeline",
  crm: "CRM Investor Funnel",
  analyzer: "Deal Margin Analyzer",
  architecture: "Data Architecture",
};

const colors = {
  ink: hex("#111111"),
  muted: hex("#6f6f68"),
  faint: hex("#9a978f"),
  line: hex("#dedbd4"),
  panel: hex("#f5f3ee"),
  green: hex("#1d9e75"),
  blue: hex("#378add"),
  amber: hex("#ef9f27"),
  red: hex("#d85a30"),
  violet: hex("#7f77dd"),
  white: rgb(1, 1, 1),
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const focus = normalizeSection(url.searchParams.get("section"));
  const preview = url.searchParams.get("preview") === "1";
  const pdfBytes = await buildPdf(focus);

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${preview ? "inline" : "attachment"}; filename="mira-${focus}-business-analyst-portfolio.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

async function buildPdf(focus: ExportSection) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`MIRA Business Analyst Portfolio - ${sectionLabels[focus]}`);
  pdf.setAuthor("Alexey Efimik");
  pdf.setSubject("MIRA Group LLC Business Analyst application portfolio");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const report: Report = { pdf, page: pdf.addPage(PageSizes.A4), regular, bold, y: pageHeight - margin };

  drawCover(report, focus);
  drawExecutiveFit(report);
  drawCommodities(report);
  drawRealEstate(report);
  drawCrm(report);
  drawArchitecture(report);
  addPageNumbers(report);

  return pdf.save();
}

function drawCover(report: Report, focus: ExportSection) {
  drawRect(report, margin, report.y - 176, contentWidth, 176, colors.ink);
  drawMiraLogo(report, margin + 20, report.y - 82, 62);

  drawText(report, "Operations Intelligence Portfolio", margin + 102, report.y - 52, 25, report.bold, colors.white, contentWidth - 130);
  drawText(
    report,
    "Business Analyst application prototype for MIRA L.L.C. Dubai",
    margin + 104,
    report.y - 88,
    10.5,
    report.regular,
    hex("#cfcfc8"),
    contentWidth - 130,
  );

  drawRect(report, margin + 104, report.y - 130, 208, 27, colors.white);
  drawText(report, `FOCUS: ${sectionLabels[focus].toUpperCase()}`, margin + 118, report.y - 121, 8.8, report.bold, colors.ink, 180);
  drawText(
    report,
    `Generated ${new Intl.DateTimeFormat("en", { month: "long", day: "2-digit", year: "numeric" }).format(new Date())}`,
    margin + 104,
    report.y - 156,
    9,
    report.regular,
    hex("#d7d7d1"),
    240,
  );

  report.y -= 214;
  drawText(report, "Alexey Efimik", margin, report.y, 18, report.bold, colors.ink, contentWidth);
  report.y -= 24;
  drawText(
    report,
    "Business Analyst candidate | Dubai-based | CRM, SAP, ETL, analytics, and workflow automation",
    margin,
    report.y,
    10.5,
    report.regular,
    colors.muted,
    contentWidth,
  );

  report.y -= 48;
  drawKpiCards(report, groupKpis, 4);
  report.y -= 30;
  drawSectionTitle(report, "Portfolio Snapshot");
  drawBullets(report, [
    "Built as a working Next.js App Router prototype, not a static CV page.",
    "Connects real estate operations with commodity trading, CRM, SAP-style payloads, and live public APIs.",
    "Shows automated extraction, transformation, risk scoring, and executive reporting workflows.",
    "Designed for an HR manager to understand the business context quickly, then inspect the analyst depth.",
  ]);
}

function drawExecutiveFit(report: Report) {
  addPage(report);
  drawPageHeader(report, "Business Analyst Value", "How this prototype maps to the role requirements");
  drawTwoColumnCards(report, [
    {
      title: "API and ETL Thinking",
      body: "Live public sources are normalized through Next.js API routes before the UI consumes them. The trade analyzer transforms a CRM-like deal into an ERP-ready payload.",
    },
    {
      title: "Operational Controls",
      body: "Commodity exposure, shipment stages, CRM funnel health, and SAP sync status are displayed as exceptions-first control surfaces.",
    },
    {
      title: "Stakeholder Clarity",
      body: "The homepage stays simple for HR and leadership, while specialist pages provide deeper operational and technical evidence.",
    },
    {
      title: "MIRA Context",
      body: "The project connects MIRA Developments, MIRA International broker workflows, and MIRA General Trading commodity operations.",
    },
  ]);

  report.y -= 24;
  drawSectionTitle(report, "Role Evidence");
  drawBullets(report, [
    "Automates data extraction and processing from multiple systems and sources.",
    "Documents CRM-to-SAP field mapping and operational exception handling.",
    "Uses live market, FX, logistics, and sourcing inputs for business risk decisions.",
    "Turns ambiguous public business information into structured dashboards and reports.",
  ]);
}

function drawCommodities(report: Report) {
  addPage(report);
  drawPageHeader(report, "Commodities Desk", "Fertilizers, agricultural bulk products, and industrial materials");
  drawKpiCards(report, tradingKpis, 5);

  report.y -= 28;
  drawSectionTitle(report, "Market Price Feed");
  drawTable(
    report,
    ["Commodity", "Price", "Basis", "Move"],
    priceFeed.map((item) => [clean(item.name), item.price, clean(item.unit), `${item.changePct >= 0 ? "+" : ""}${item.changePct}%`]),
    [180, 78, 170, 65],
  );

  report.y -= 24;
  drawSectionTitle(report, "Open Trade Blotter");
  drawTable(
    report,
    ["Contract", "Commodity", "Side", "Volume", "Status", "P&L"],
    tradeBlotter.slice(0, 7).map((item) => [item.id, item.commodity, item.direction, item.volume, clean(item.statusLabel), clean(item.pnl)]),
    [74, 86, 54, 78, 102, 76],
  );

  report.y -= 24;
  drawSectionTitle(report, "SAP and Exposure Signals");
  drawTwoColumnCards(
    report,
    [
      ...commodityExposure.map((item) => ({
        title: `${item.name}: ${item.value}`,
        body: `Exposure index ${item.bar}/100 across active trading positions.`,
      })),
      ...sapStatus.slice(0, 2).map((item) => ({
        title: clean(item.label),
        body: clean(`Status: ${item.value}`),
      })),
    ],
    2,
  );
}

function drawRealEstate(report: Report) {
  addPage(report);
  drawPageHeader(report, "Real Estate Pipeline", "MIRA Developments portfolio view");
  drawKpiCards(report, realEstateKpis, 5);

  report.y -= 28;
  drawSectionTitle(report, "Development Projects");
  drawTable(
    report,
    ["Project", "Location", "Handover", "Progress", "Entry"],
    projects.map((project) => [clean(project.name), clean(project.location), project.handover, `${project.progress}%`, clean(project.entry)]),
    [160, 122, 74, 68, 72],
  );

  report.y -= 24;
  drawSectionTitle(report, "Broker and Geography Signals");
  drawTwoColumnCards(report, [
    {
      title: "Top broker volume",
      body: brokers.slice(0, 3).map((broker) => `${broker.name}: ${broker.volume}`).join(" | "),
    },
    {
      title: "Investor geography",
      body: investorGeography.map((geo) => `${clean(geo.label)} ${geo.pct}%`).join(" | "),
    },
  ]);
}

function drawCrm(report: Report) {
  addPage(report);
  drawPageHeader(report, "CRM Investor Funnel", "Lead-to-close pipeline and conversion monitoring");
  drawTable(
    report,
    ["Stage", "Count", "Share"],
    crmFunnel.map((stage) => [stage.stage, String(stage.count), `${stage.pct}%`]),
    [230, 120, 120],
  );

  report.y -= 28;
  drawSectionTitle(report, "CRM Controls");
  drawBullets(report, [
    "Broker and investor club leads are separated from digital and event channels.",
    "Conversion rates are reviewed by branded product, not only by total pipeline volume.",
    "Geography is tracked because CIS, UAE, Europe, and South Asia buyers require different sales and compliance workflows.",
  ]);
}

function drawArchitecture(report: Report) {
  addPage(report);
  drawPageHeader(report, "Data Architecture", "CRM capture -> API enrichment -> SAP payload -> BI reporting");
  drawTimeline(report, [
    ["Extract", "CRM snapshots, trade trackers, SAP cost centers, live market APIs"],
    ["Transform", "Normalize product, counterparty, currency, port, and shipment keys"],
    ["Validate", "Flag missing documents, stale syncs, duplicate RFQs, and margin risk"],
    ["Load", "Prepare SAP-style sales document and material master payloads"],
    ["Report", "Expose KPI definitions and executive dashboards for management review"],
  ]);
}

function drawPageHeader(report: Report, title: string, subtitle: string) {
  drawMiraLogo(report, margin, pageHeight - 72, 34);
  drawText(report, title, margin + 48, pageHeight - 48, 17, report.bold, colors.ink, contentWidth - 48);
  drawText(report, subtitle, margin + 48, pageHeight - 70, 9.5, report.regular, colors.muted, contentWidth - 48);
  drawLine(report, margin, pageHeight - 90, margin + contentWidth, pageHeight - 90, colors.line);
  report.y = pageHeight - 112;
}

function drawMiraLogo(report: Report, x: number, y: number, size: number) {
  drawRect(report, x, y, size, size, rgb(0.02, 0.02, 0.02));
  drawText(report, "MI", x + size * 0.24, y + size * 0.6, size * 0.24, report.regular, colors.white, size * 0.55);
  drawText(report, "RA", x + size * 0.22, y + size * 0.25, size * 0.24, report.regular, colors.white, size * 0.6);
}

function drawKpiCards(report: Report, kpis: Array<{ label: string; value: string; sub: string; tone?: string }>, columns: number) {
  const gap = 8;
  const width = (contentWidth - gap * (columns - 1)) / columns;
  const height = 70;
  const startY = report.y;

  kpis.forEach((kpi, index) => {
    const x = margin + (index % columns) * (width + gap);
    const y = startY - Math.floor(index / columns) * (height + gap) - height;
    drawRect(report, x, y, width, height, colors.panel);
    drawText(report, clean(kpi.label).toUpperCase(), x + 10, y + height - 20, 7, report.bold, colors.muted, width - 20);
    drawText(report, clean(kpi.value), x + 10, y + height - 43, 15, report.bold, kpi.tone === "pos" ? colors.green : kpi.tone === "warn" ? colors.amber : colors.ink, width - 20);
    drawText(report, clean(kpi.sub), x + 10, y + 12, 7.5, report.regular, colors.muted, width - 20);
  });

  report.y = startY - Math.ceil(kpis.length / columns) * (height + gap) + gap;
}

function drawSectionTitle(report: Report, title: string) {
  ensureSpace(report, 30);
  drawText(report, title, margin, report.y, 12, report.bold, colors.ink, contentWidth);
  report.y -= 20;
}

function drawBullets(report: Report, items: string[]) {
  items.forEach((item) => {
    const lines = wrapText(clean(item), report.regular, 9.5, contentWidth - 18);
    ensureSpace(report, lines.length * 13 + 8);
    report.page.drawCircle({ x: margin + 4, y: report.y - 6, size: 2.2, color: colors.green });
    lines.forEach((line, index) => {
      drawText(report, line, margin + 16, report.y - index * 13, 9.5, report.regular, colors.ink, contentWidth - 16);
    });
    report.y -= lines.length * 13 + 8;
  });
}

function drawTwoColumnCards(report: Report, cards: Array<{ title: string; body: string }>, columns = 2) {
  const gap = 12;
  const width = (contentWidth - gap * (columns - 1)) / columns;
  const height = 88;
  let x = margin;
  let y = report.y - height;

  cards.forEach((card, index) => {
    if (index > 0 && index % columns === 0) {
      x = margin;
      y -= height + gap;
    }
    ensureSpace(report, height + gap);
    drawRect(report, x, y, width, height, colors.panel);
    drawText(report, clean(card.title), x + 12, y + height - 24, 10, report.bold, colors.ink, width - 24);
    drawWrappedText(report, clean(card.body), x + 12, y + height - 42, 8.8, report.regular, colors.muted, width - 24, 4);
    x += width + gap;
  });

  report.y = y - 4;
}

function drawTable(report: Report, headers: string[], rows: string[][], widths: number[]) {
  const rowHeight = 24;
  const tableWidth = widths.reduce((sum, value) => sum + value, 0);
  ensureSpace(report, rowHeight * 2);

  let y = report.y - rowHeight;
  drawRect(report, margin, y, tableWidth, rowHeight, colors.ink);
  let x = margin;
  headers.forEach((header, index) => {
    drawText(report, header.toUpperCase(), x + 7, y + 8, 7.5, report.bold, colors.white, widths[index] - 12);
    x += widths[index];
  });

  rows.forEach((row, rowIndex) => {
    ensureSpace(report, rowHeight + 4);
    y -= rowHeight;
    if (y < 58) {
      addPage(report);
      y = report.y - rowHeight;
    }
    drawRect(report, margin, y, tableWidth, rowHeight, rowIndex % 2 === 0 ? colors.white : colors.panel);
    x = margin;
    row.forEach((cell, index) => {
      drawText(report, clean(cell), x + 7, y + 8, 8, index === 0 ? report.bold : report.regular, index === 0 ? colors.ink : colors.muted, widths[index] - 12);
      x += widths[index];
    });
  });

  report.y = y - 12;
}

function drawTimeline(report: Report, items: Array<[string, string]>) {
  items.forEach(([title, body], index) => {
    ensureSpace(report, 64);
    const y = report.y;
    report.page.drawCircle({ x: margin + 8, y: y - 8, size: 6, color: index % 2 === 0 ? colors.blue : colors.green });
    if (index < items.length - 1) {
      drawLine(report, margin + 8, y - 20, margin + 8, y - 56, colors.line);
    }
    drawText(report, title, margin + 26, y, 11, report.bold, colors.ink, contentWidth - 26);
    drawWrappedText(report, clean(body), margin + 26, y - 20, 9, report.regular, colors.muted, contentWidth - 26, 3);
    report.y -= 62;
  });
}

function addPage(report: Report) {
  report.page = report.pdf.addPage(PageSizes.A4);
  report.y = pageHeight - margin;
}

function ensureSpace(report: Report, height: number) {
  if (report.y - height < 54) addPage(report);
}

function addPageNumbers(report: Report) {
  const pages = report.pdf.getPages();
  pages.forEach((page, index) => {
    page.drawText(`MIRA Business Analyst Portfolio | ${index + 1} / ${pages.length}`, {
      x: margin,
      y: 28,
      size: 7.5,
      font: report.regular,
      color: colors.faint,
      maxWidth: contentWidth,
    });
  });
}

function drawText(report: Report, text: string, x: number, y: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>, maxWidth: number) {
  report.page.drawText(clean(text), { x, y, size, font, color, maxWidth });
}

function drawWrappedText(report: Report, text: string, x: number, y: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>, maxWidth: number, maxLines = 5) {
  wrapText(text, font, size, maxWidth)
    .slice(0, maxLines)
    .forEach((line, index) => drawText(report, line, x, y - index * (size + 3), size, font, color, maxWidth));
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = clean(text).split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  return lines;
}

function drawRect(report: Report, x: number, y: number, width: number, height: number, color: ReturnType<typeof rgb>) {
  report.page.drawRectangle({ x, y, width, height, color });
}

function drawLine(report: Report, startX: number, startY: number, endX: number, endY: number, color: ReturnType<typeof rgb>) {
  report.page.drawLine({ start: { x: startX, y: startY }, end: { x: endX, y: endY }, color, thickness: 1 });
}

function normalizeSection(value: string | null): ExportSection {
  if (
    value === "commodities" ||
    value === "real-estate" ||
    value === "crm" ||
    value === "analyzer" ||
    value === "architecture"
  ) {
    return value;
  }
  return "overview";
}

function clean(value: string | number) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[↑]/g, "up ")
    .replace(/[↓]/g, "down ")
    .replace(/[−]/g, "-")
    .replace(/[–—]/g, "-")
    .replace(/[·]/g, "/")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hex(value: string) {
  const normalized = value.replace("#", "");
  const red = parseInt(normalized.slice(0, 2), 16) / 255;
  const green = parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = parseInt(normalized.slice(4, 6), 16) / 255;
  return rgb(red, green, blue);
}
