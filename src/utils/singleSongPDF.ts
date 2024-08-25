import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { SongData } from './types';
import { generateQRCode } from './qrCodeGenerator';
import NotoSansRegular from '../assets/NotoSans-Regular.ttf';
import * as unorm from 'unorm';

export async function embedNotoSansFont(pdfDoc: PDFDocument): Promise<PDFFont> {
  const fontBytes = await fetch(NotoSansRegular).then(res => res.arrayBuffer());
  pdfDoc.registerFontkit(fontkit);
  return await pdfDoc.embedFont(fontBytes);
}

export async function generateSingleSongPage(pdfDoc: PDFDocument, song: SongData): Promise<PDFPage> {
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await embedNotoSansFont(pdfDoc);

  let y = height - 50;

  // Add centered title
  const titleWidth = font.widthOfTextAtSize(unorm.nfc(song.title), 24);
  page.drawText(unorm.nfc(song.title), {
    x: (width - titleWidth) / 2,
    y,
    size: 24,
    font,
    color: rgb(0, 0, 0),
    
  });
  y -= 40;

  // Draw lyrics
  y = drawSection(page, 'Lyrics:', song.lyrics, font, y, width);

  // Draw translation if available
  if (song.translation && song.translation.length > 0) {
    y = drawSection(page, 'Translation:', song.translation, font, y, width);
  }

  // Add centered YouTube link if available
  /*
  if (song.youtubeLink) {
    const linkText = 'Watch on YouTube';
    const linkWidth = font.widthOfTextAtSize(linkText, 12);
    
    page.drawText(linkText, {
      x: (width - linkWidth) / 2,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 1),
      
    });

    page.drawLink({
      url: song.youtubeLink,
      x: (width - linkWidth) / 2,
      y: y - 2,
      width: linkWidth,
      height: 14,
    });

    y -= 20;
  }
  */

  // Add centered QR code if available
  if (song.youtubeLink) {
    const qrCodeDataUrl = await generateQRCode(song.youtubeLink);
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrCodeSize = 50;
    page.drawImage(qrCodeImage, {
      x: (width - qrCodeSize) / 2,
      y: y - qrCodeSize,
      width: qrCodeSize,
      height: qrCodeSize,
    });
  }

  return page;
}

function drawSection(page: PDFPage, title: string, content: string[][], font: PDFFont, startY: number, width: number): number {
  let currentY = startY;

  // Draw centered section title
  const titleWidth = font.widthOfTextAtSize(unorm.nfc( title), 14);
  page.drawText(unorm.nfc(title), {
    x: (width - titleWidth) / 2,
    y: currentY,
    size: 14,
    font,
    color: rgb(0, 0, 0),
    
  });
  currentY -= 30;

  // Draw centered content
  content.forEach((stanza) => {
    stanza.forEach(line => {
      const lineWidth = font.widthOfTextAtSize(unorm.nfc(line), 12);
      page.drawText(unorm.nfc(line), {
        x: (width - lineWidth) / 2,
        y: currentY,
        size: 12,
        font,
        color: rgb(0, 0, 0),
        
      });
      currentY -= 14;
    });
    currentY -= 20;
  });

  return currentY;
}

export function estimateSongContentHeight(font: PDFFont, song: SongData, pageWidth: number): number {
  let height = 100;
  const fontSize = 12;

  height += song.lyrics.reduce((acc, stanza) => {
    const stanzaText = stanza.join('\n');
    const lines = splitTextToSize(unorm.nfc(stanzaText), pageWidth - 40, font, fontSize);
    return acc + lines.length * fontSize * 1.2 + 10;
  }, 0);

  if (song.translation) {
    height += song.translation.reduce((acc, stanza) => {
      const stanzaText = stanza.join('\n');
      const lines = splitTextToSize(unorm.nfc(stanzaText), pageWidth - 40, font, fontSize);
      return acc + lines.length * fontSize * 1.2 + 10;
    }, 0);
  }

  height += 100;
  return height;
}

function splitTextToSize(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(unorm.nfc(testLine), fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}