import { PDFDocument, PDFFont, PDFPage, rgb, RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { SongData } from './types';
import { generateQRCode } from './qrCodeGenerator';
import { FONT_PATH } from './fontConfig';
import * as unorm from 'unorm';
import { addDraftFooter, addPageNumber } from './pdfBookUtils';

export async function embedFont(pdfDoc: PDFDocument, fontPath: string): Promise<PDFFont> {
  const fontBytes = await fetch(fontPath).then(res => res.arrayBuffer());
  pdfDoc.registerFontkit(fontkit);
  return await pdfDoc.embedFont(fontBytes, { subset: false });
}

export async function generateSingleSongPage(pdfDoc: PDFDocument, song: SongData): Promise<PDFPage[]> {
  const pages: PDFPage[] = [];
  let page = pdfDoc.addPage();
  pages.push(page);
  const { width, height } = page.getSize();
  const font = await embedFont(pdfDoc, FONT_PATH);

  let y = height - 50;

  // Add centered title
  y = drawUnicodeText(page, song.title, {
    x: width / 2,
    y,
    size: 24,
    font,
    color: rgb(0, 0, 0),
    align: 'center'
  });
  y -= 40;

  // Draw lyrics
  let result = drawSection(page, song.lyrics, font, y, width, pdfDoc);
  y = result.currentY;
  page = result.page;
  if (!pages.includes(page)) pages.push(page);

  // Draw translation if available
  if (song.translation && song.translation.length > 0) {
    result = drawSection(page, song.translation, font, y, width, pdfDoc);
    y = result.currentY;
    page = result.page;
    if (!pages.includes(page)) pages.push(page);
  }

  // Add centered QR code if available
  if (song.youtubeLink) {
    const qrCodeDataUrl = await generateQRCode(song.youtubeLink);
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrCodeSize = 50;
    if (y - qrCodeSize < 50) {
      page = pdfDoc.addPage();
      pages.push(page);
      y = height - 50;
    }
    page.drawImage(qrCodeImage, {
      x: (width - qrCodeSize) / 2,
      y: y - qrCodeSize,
      width: qrCodeSize,
      height: qrCodeSize,
    });
  }

  // Add draft footer to all pages
  pages.forEach((p) => {
    addDraftFooter(p, font);
  });

  return pages;
}

function drawUnicodeText(page: PDFPage, text: string, options: {
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color: RGB,
  align?: 'left' | 'center' | 'right'
}): number {
  const { x, y, size, font, color, align = 'left' } = options;
  const normalizedText = unorm.nfc(text);
  let currentX = x;
  const textWidth = font.widthOfTextAtSize(normalizedText, size);

  if (align === 'center') {
    currentX -= textWidth / 2;
  } else if (align === 'right') {
    currentX -= textWidth;
  }

  page.drawText(normalizedText, { x: currentX, y, size, font, color });

  return y;
}

function drawSection(page: PDFPage, content: string[][], font: PDFFont, startY: number, width: number, pdfDoc: PDFDocument): { currentY: number, page: PDFPage } {
  let currentY = startY;
  const { height } = page.getSize();
  const fontSize = 14;
  const lineSpacing = 16;

  content.forEach((stanza) => {
    const stanzaHeight = stanza.length * lineSpacing + 20; // 20 for stanza spacing
    if (currentY - stanzaHeight < 50) {
      page = pdfDoc.addPage();
      currentY = height - 50;
    }

    stanza.forEach(line => {
      currentY = drawUnicodeText(page, line, {
        x: width / 2,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        align: 'center'
      });
      currentY -= lineSpacing;
    });
    currentY -= 20; // Space between stanzas
  });

  return { currentY, page };
}