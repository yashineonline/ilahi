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
    y -= 20;
    y = drawUnicodeText(page, 'Translation', {
      x: width / 2,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0),
      align: 'center'
    });
    y -= 20;

    result = drawSection(page, song.translation, font, y, width, pdfDoc);
    y = result.currentY;
    page = result.page;
  }

  // Generate and draw QR code
  const qrCodeDataUrl = await generateQRCode(`https://ilahiapp.com/songs/${song.slug}`);
  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
  const qrCodeDims = qrCodeImage.scale(0.5);

  if (y - qrCodeDims.height - 50 < 50) {
    page = pdfDoc.addPage();
    y = height - 50;
  }

  page.drawImage(qrCodeImage, {
    x: 50,
    y: y - qrCodeDims.height,
    width: qrCodeDims.width,
    height: qrCodeDims.height,
  });

  // Add "Link to the App" text next to QR code
  drawUnicodeText(page, 'Link to the App', {
    x: 50 + qrCodeDims.width + 10,
    y: y - qrCodeDims.height / 2,
    size: 14,
    font,
    color: rgb(0, 0, 0),
    align: 'left'
  });

  y -= qrCodeDims.height + 20;

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
  const margin = 50; // Add a margin

  content.forEach((stanza) => {
    const stanzaHeight = stanza.length * lineSpacing + 20; // 20 for stanza spacing
    if (currentY - stanzaHeight < margin) {
      page = pdfDoc.addPage();
      currentY = height - margin;
    }

    stanza.forEach(line => {
      const textWidth = font.widthOfTextAtSize(line, fontSize);
      const x = (width - textWidth) / 2;
      
      if (x < margin) {
        // If the text is too wide, we need to wrap it
        const words = line.split(' ');
        let currentLine = '';
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);
          if (testWidth > width - 2 * margin) {
            drawUnicodeText(page, currentLine, {
              x: width / 2,
              y: currentY,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
              align: 'center'
            });
            currentY -= lineSpacing;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        if (currentLine) {
          drawUnicodeText(page, currentLine, {
            x: width / 2,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            align: 'center'
          });
          currentY -= lineSpacing;
        }
      } else {
        currentY = drawUnicodeText(page, line, {
          x: width / 2,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          align: 'center'
        });
        currentY -= lineSpacing;
      }
    });
    currentY -= 20; // Space between stanzas
  });

  return { currentY, page };
}