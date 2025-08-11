import { PDFDocument as PDFLib, PDFPage, PDFFont, rgb, RGB, PDFImage } from 'pdf-lib';
import { SongData } from './types';
import { EXPLANATION_TEXT } from './contentConfig';
import { fetchAllQuotes } from '@/utils/quoteFetcher';
import { generateSingleSongPage } from '../utils/singleSongPDF'

export async function createCoverPage(pdfDoc: PDFLib, font: PDFFont, title: string, isCustom: boolean = false): Promise<PDFPage> {
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const currentDate = new Date().toISOString().split('T')[0];

  const lines = [
    'Ansari Qadiri Rifai Tariqa',
    'ilahi Book',
    isCustom ? 'Customized Version' : '',
    'Generated and Downloaded from ilahi Book App',
    `Draft Copy of ${currentDate}`,
    'For any queries, email aqrtsufi@gmail.com'
  ].filter(line => line !== '');

  lines.forEach((line, index) => {
    const fontSize = index === 1 ? 40 : 20;
    const lineWidth = font.widthOfTextAtSize(line, fontSize);
    page.drawText(line, {
      x: (width - lineWidth) / 2,
      y: height - 100 - index * 50,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  });

  return page;
}

export async function createTableOfContents(pdfDoc: PDFLib, font: PDFFont, songs: SongData[]): Promise<PDFPage[]> {
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
    currentY -= 20;
  }

  return pages;
}

export function addDraftFooter(page: PDFPage, font: PDFFont): void {
  const currentDate = new Date().toISOString().split('T')[0];
  page.drawText(`DRAFT COPY - Copyright AQRT ${currentDate}`, {
    x: 50,
    y: 20,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText('Visit aqrtsufi.org for more info', {
    x: page.getWidth() - 200,
    y: 20,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
}

export function addPageNumber(page: PDFPage, font: PDFFont, pageNumber: number | null): void {
  if (pageNumber !== null) {
    page.drawText(pageNumber.toString(), {
      x: page.getWidth() / 2,
      y: 30,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
  }
}

export function addPageNumbersAndFooters(pages: PDFPage[], font: PDFFont, startNumber: number = 1, skipPages: number = 0): void {
  pages.forEach((page, index) => {
    addDraftFooter(page, font);
    if (index >= skipPages) {
      addPageNumber(page, font, startNumber + index - skipPages);
    }
  });
}

export async function updateTableOfContents(tocPages: PDFPage[], adjustedPageNumbers: number[], font: PDFFont): Promise<void> {
  let songIndex = 0;
  tocPages.forEach((page, pageIndex) => {
    const { width, height } = page.getSize();
    let currentY = pageIndex === 0 ? height - 90 : height - 50;

    while (currentY > 50 && songIndex < adjustedPageNumbers.length) {
      const pageNumber = adjustedPageNumbers[songIndex].toString();
      const pageNumberWidth = font.widthOfTextAtSize(pageNumber, 12);
      page.drawText(pageNumber, {
        x: width - 50 - pageNumberWidth,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= 20;
      songIndex++;
    }
  });
}

export async function downloadPDF(pdfBytes: Uint8Array, fileName: string): Promise<void> {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function drawMultilineText(pdfDoc: PDFLib, page: PDFPage, text: string, options: {
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  lineHeight: number,
  font: PDFFont,
  color: RGB
}): PDFPage[] {
  const words = text.split(' ');
  let line = '';
  let yPosition = options.y;
  const newPages: PDFPage[] = [];

  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = options.font.widthOfTextAtSize(testLine, options.fontSize);

    if (testWidth > options.maxWidth && line !== '') {
      page.drawText(line.trim(), {
        x: options.x,
        y: yPosition,
        size: options.fontSize,
        font: options.font,
        color: options.color,
      });
      line = word + ' ';
      yPosition -= options.lineHeight;

      if (yPosition < 50) {
        const newPage = pdfDoc.addPage();
        newPages.push(newPage);
        yPosition = newPage.getSize().height - 50;
        page = newPage;
      }
    } else {
      line = testLine;
    }
  }

  if (line.trim() !== '') {
    if (yPosition < 50) {
      const newPage = pdfDoc.addPage();
      newPages.push(newPage);
      yPosition = newPage.getSize().height - 50;
      page = newPage;
    }
    page.drawText(line.trim(), {
      x: options.x,
      y: yPosition,
      size: options.fontSize,
      font: options.font,
      color: options.color,
    });
  }

  return newPages;
}

export async function createExplanationPage(pdfDoc: PDFLib, font: PDFFont): Promise<PDFPage[]> {
  const pages: PDFPage[] = [];
  let page = pdfDoc.addPage();
  pages.push(page);
  const { width, height } = page.getSize();
  let yPosition = height - 50;

  // console.log('Creating explanation page');
  // console.log(`Initial yPosition: ${yPosition}`);

  // Draw the title
  page.drawText(EXPLANATION_TEXT.title, {
    x: 50,
    y: yPosition,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;
  // console.log(`After title, yPosition: ${yPosition}`);

  // Iterate through sections
  for (const section of EXPLANATION_TEXT.sections) {
    // console.log(`Processing section: ${section.title}`);
    if (yPosition < 100) {
      // console.log('Creating new page for section');
      page = pdfDoc.addPage();
      pages.push(page);
      yPosition = height - 50;
    }

    // Draw section title
    page.drawText(section.title, {
      x: 50,
      y: yPosition,
      size: 18,
      font: font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;
    // console.log(`After section title, yPosition: ${yPosition}`);

    // Draw section content
    for (const content of section.content) {
      // console.log(`Processing content type: ${content.type}`);
      const newPages = drawMultilineText(pdfDoc, page, content.text, {
        x: 50,
        y: yPosition,
        maxWidth: width - 100,
        fontSize: content.type === 'quote' ? 10 : 12,
        lineHeight: 16,
        font: font,
        color: rgb(0, 0, 0),
      });

      pages.push(...newPages);
      page = pages[pages.length - 1];
      yPosition = page.getSize().height - 50;
      // console.log(`After content, yPosition: ${yPosition}`);
    }

    // Add author if present
    if (section.author) {
      if (yPosition < 50) {
        // console.log('Creating new page for author');
        page = pdfDoc.addPage();
        pages.push(page);
        yPosition = height - 50;
      }
      page.drawText(`- ${section.author}`, {
        x: width - 200,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 40;
      // console.log(`After author, yPosition: ${yPosition}`);
    }

    yPosition -= 20; // Add some space between sections
    // console.log(`After section spacing, yPosition: ${yPosition}`);
  }

  // console.log(`Total explanation pages created: ${pages.length}`);
  return pages;
}

export async function createPoemPage(pdfDoc: PDFLib, font: PDFFont): Promise<PDFPage[]> {
  const pages: PDFPage[] = [];
  let page = pdfDoc.addPage();
  pages.push(page);
  const { width, height } = page.getSize();
  
  try {
    const authors = await fetchAllQuotes();
    const allQuotes = authors.flatMap(author => author.quotes.map(quote => `${quote.text}\n\n`)).join('');


  const newPages = drawMultilineText(pdfDoc, page, allQuotes, {
    x: 50,
    y: height - 50,
    maxWidth: width - 100,
    fontSize: 12,
    lineHeight: 16,
    font: font,
    color: rgb(0, 0, 0),
  });

  pages.push(...newPages);
} catch (error) {
  console.error('Error fetching quotes:', error);
  // Handle error appropriately, e.g., show a message or use fallback content
}

  return pages;
}

export async function createTemporaryPlaceholderPages(pdfDoc: PDFLib, font: PDFFont): Promise<PDFPage[]> {
  const pages: PDFPage[] = [];
  const page = pdfDoc.addPage();
  pages.push(page);
  const { width, height } = page.getSize();

  // About ilahi
  page.drawText('About ilahi', {
    x: 50,
    y: height - 100,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText('Coming soon...', {
    x: 50,
    y: height - 150,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Poem Page
  page.drawText('Poem Page', {
    x: 50,
    y: height - 250,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText('Coming soon...', {
    x: 50,
    y: height - 300,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });

  return pages;
}

export async function embedImage(pdfDoc: PDFLib, imageUrl: string): Promise<PDFImage> {
  const response = await fetch(imageUrl);
  const imageData = await response.arrayBuffer();
  return await pdfDoc.embedPng(imageData);
}

// Add to pdfBookUtils.ts from SongDisplay on Aug 10, 2025
export async function generateSongPDF(song: any): Promise<void> {
  try {
    const pdfDoc = await PDFLib.create();
    await generateSingleSongPage(pdfDoc, song);
    const pdfBytes = await pdfDoc.save();
    await downloadPDF(pdfBytes, `${song.title}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again later.');
  }
}

