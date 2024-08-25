import { PDFDocument as PDFLib, PDFPage, PDFFont, rgb } from 'pdf-lib';
import { SongData } from './types';

export async function createCoverPage(pdfDoc: PDFLib, font: PDFFont, title: string): Promise<PDFPage> {
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const titleWidth = font.widthOfTextAtSize(title, 40);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: height - 100,
    size: 40,
    font: font,
    color: rgb(0, 0, 0),
  });
  return page;
}

export async function createTableOfContents(pdfDoc: PDFLib, font: PDFFont, songs: SongData[], songPageNumbers: number[]): Promise<PDFPage[]> {
  const pages: PDFPage[] = [];
  let currentPage = pdfDoc.addPage();
  pages.push(currentPage);
  let currentY = currentPage.getHeight() - 50;

  currentPage.drawText('Table of Contents', {
    x: 50,
    y: currentY,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });
  currentY -= 40;

  for (let i = 0; i < songs.length; i++) {
    if (currentY < 50) {
      currentPage = pdfDoc.addPage();
      pages.push(currentPage);
      currentY = currentPage.getHeight() - 50;
    }

    const title = `${i + 1}. ${songs[i].title}`;
    currentPage.drawText(title, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentPage.drawText(`${songPageNumbers[i]}`, {
      x: currentPage.getWidth() - 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    currentY -= 20;
  }

  return pages;
}

export function addPageNumbers(pages: PDFPage[], font: PDFFont, startNumber: number = 1): void {
  pages.forEach((page, index) => {
    page.drawText(`${startNumber + index}`, {
      x: page.getWidth() / 2,
      y: 30,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
  });
}

export async function downloadPDF(pdfBytes: Uint8Array, fileName: string): Promise<void> {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}