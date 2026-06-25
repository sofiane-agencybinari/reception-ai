import PDFDocument from "pdfkit";

import {
  CATEGORY_ORDER,
  CATEGORY_TITLES,
  type MenuCategory,
  type MenuItemRow,
  formatMenuPrice,
  groupMenuItems,
} from "@/lib/menu-categories";

export type MenuPdfInput = {
  restaurantName: string;
  restaurantPhone?: string | null;
  restaurantAddress?: string | null;
  items: MenuItemRow[];
};

const BRAND = {
  paper: "#FAF8F5",
  ink: "#14151A",
  muted: "#5C5F6B",
  accent: "#D97706",
  accentSoft: "#FEF3C7",
  line: "#E8E4DC",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function drawHeader(doc: PDFKit.PDFDocument, input: MenuPdfInput) {
  const pageWidth = doc.page.width;
  const margin = doc.page.margins.left;

  doc.rect(0, 0, pageWidth, 118).fill(BRAND.ink);
  doc.rect(0, 114, pageWidth, 4).fill(BRAND.accent);

  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(26);
  doc.text(input.restaurantName, margin, 34, {
    width: pageWidth - margin * 2,
    align: "center",
  });

  doc.fillColor(BRAND.accentSoft).font("Helvetica").fontSize(11);
  doc.text("CARTE DES PRODUITS", margin, 68, {
    width: pageWidth - margin * 2,
    align: "center",
    characterSpacing: 2.4,
  });

  const meta = [input.restaurantAddress, input.restaurantPhone].filter(Boolean).join("  ·  ");
  if (meta) {
    doc.fillColor("#D4D4D8").font("Helvetica").fontSize(9);
    doc.text(meta, margin, 88, {
      width: pageWidth - margin * 2,
      align: "center",
    });
  }

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8);
  doc.text(
    `Genere le ${new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    margin,
    96,
    { width: pageWidth - margin * 2, align: "center" },
  );

  doc.y = 138;
}

function ensureSpace(doc: PDFKit.PDFDocument, height: number) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + height > bottom) {
    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(BRAND.paper);
    doc.fillColor(BRAND.ink);
    doc.y = doc.page.margins.top;
  }
}

function drawCategory(
  doc: PDFKit.PDFDocument,
  category: MenuCategory,
  items: MenuItemRow[],
) {
  if (items.length === 0) return;

  ensureSpace(doc, 56);

  const margin = doc.page.margins.left;
  const contentWidth = doc.page.width - margin * 2;

  doc.fillColor(BRAND.accent).font("Helvetica-Bold").fontSize(13);
  doc.text(CATEGORY_TITLES[category].toUpperCase(), margin, doc.y, {
    width: contentWidth,
    characterSpacing: 1.2,
  });

  doc.moveDown(0.35);
  const lineY = doc.y;
  doc.strokeColor(BRAND.line).lineWidth(1);
  doc.moveTo(margin, lineY).lineTo(margin + contentWidth, lineY).stroke();
  doc.moveDown(0.65);

  for (const item of items) {
    ensureSpace(doc, 28);

    const rowY = doc.y;
    const price = formatMenuPrice(Number(item.price));
    doc.font("Helvetica-Bold").fontSize(10.5);
    const priceWidth = doc.widthOfString(price);
    const nameWidth = contentWidth - priceWidth - 16;

    doc.fillColor(item.is_available ? BRAND.ink : BRAND.muted)
      .font(item.is_available ? "Helvetica" : "Helvetica-Oblique")
      .fontSize(10.5)
      .text(item.name, margin, rowY, { width: nameWidth, continued: false });

    doc.fillColor(item.is_available ? BRAND.accent : BRAND.muted)
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .text(price, margin + contentWidth - priceWidth, rowY, {
        width: priceWidth,
        align: "right",
      });

    if (!item.is_available) {
      doc.fillColor(BRAND.muted).font("Helvetica-Oblique").fontSize(8);
      doc.text("Indisponible", margin, rowY + 13);
      doc.moveDown(0.85);
    } else {
      doc.moveDown(0.55);
    }
  }

  doc.moveDown(0.8);
}

function drawFooter(doc: PDFKit.PDFDocument) {
  const margin = doc.page.margins.left;
  const pageWidth = doc.page.width;
  const footerY = doc.page.height - doc.page.margins.bottom - 18;

  doc.strokeColor(BRAND.line).lineWidth(0.8);
  doc.moveTo(margin, footerY - 8).lineTo(pageWidth - margin, footerY - 8).stroke();

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8);
  doc.text("Propulse par ASTOR — Reception IA", margin, footerY, {
    width: pageWidth - margin * 2,
    align: "center",
  });
}

export function buildMenuPdfFilename(restaurantName: string): string {
  return `menu-${slugify(restaurantName) || "restaurant"}.pdf`;
}

export async function buildMenuPdfBuffer(input: MenuPdfInput): Promise<Buffer> {
  const groups = groupMenuItems(input.items);
  const hasItems = input.items.length > 0;

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 48, bottom: 56, left: 48, right: 48 },
    info: {
      Title: `Menu — ${input.restaurantName}`,
      Author: "ASTOR",
      Subject: "Carte restaurant",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.rect(0, 0, doc.page.width, doc.page.height).fill(BRAND.paper);
  doc.fillColor(BRAND.ink);

  drawHeader(doc, input);

  if (!hasItems) {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(11);
    doc.text("Aucun produit dans le menu pour le moment.", { align: "center" });
  } else {
    for (const category of CATEGORY_ORDER) {
      drawCategory(doc, category, groups[category]);
    }
  }

  drawFooter(doc);
  doc.end();

  return finished;
}
