import jsPDF from 'jspdf';
import { SongData } from './songProcessor';
import { font } from './font';
import { generateQRCode } from './qrCodeGenerator';

jsPDF.API.events.push(['addFonts', function() {
  this.addFileToVFS('DejaVuSans.ttf', font);
  this.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
}]);

export function generateSingleSongPDF(song: SongData, qrCodeDataUrl: string): void {
  const doc = new jsPDF();
  doc.setFont('DejaVuSans');

  doc.setFontSize(16);
  doc.text(song.title, 20, 20);

  doc.setFontSize(12);
  doc.text('Lyrics:', 20, 30);
  doc.setFontSize(10);
  const lyricsText = song.lyrics.map(stanza => stanza.join('\n')).join('\n\n');
  const lyricsLines = doc.splitTextToSize(lyricsText, 170);
  doc.text(lyricsLines, 20, 40);

  let currentY = 40 + (lyricsLines.length * 5);

  if (song.translation && song.translation.length > 0) {
    currentY += 10;
    doc.setFontSize(12);
    doc.text('Translation:', 20, currentY);
    doc.setFontSize(10);
    const translationText = song.translation.map(stanza => stanza.join('\n')).join('\n\n');
    const translationLines = doc.splitTextToSize(translationText, 170);
    doc.text(translationLines, 20, currentY + 10);
    currentY += 10 + (translationLines.length * 5);
  }

  if (song.youtubeLink) {
    currentY += 10;
    doc.setFontSize(12);
    doc.textWithLink('Watch on YouTube', 20, currentY, { url: song.youtubeLink });
  }

  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', 20, currentY + 10, 50, 50);
  }

  doc.setFontSize(10);
  doc.text('This is published by the AQRT. You may donate on the official website for all the work behind:', 20, doc.internal.pageSize.height - 30);
  doc.textWithLink('aqrtsufi.org', 20, doc.internal.pageSize.height - 20, { url: 'https://aqrtsufi.org' });
  doc.save(`${song.title}.pdf`);
}


export async function generateFullBookPDF(songs: SongData[]): Promise<void> {
  const doc = new jsPDF();
  doc.setFont('DejaVuSans');
  let pageNumber = 1;
  
  // Add cover page
  doc.setFontSize(22);
  doc.text('Ilahi Book', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  doc.addPage();
  pageNumber++;

  // Calculate page numbers for each song
  const songPageNumbers: number[] = [];
  let currentPage = pageNumber + 1; // Start after cover and estimated TOC pages

  // Estimate TOC pages
  const tocPagesEstimate = Math.ceil(songs.length / 30); // Assume 30 entries per page
  currentPage += tocPagesEstimate;

  // Calculate song page numbers
  for (const song of songs) {
    songPageNumbers.push(currentPage);
    const contentHeight = estimateSongContentHeight(doc, song);
    const pagesNeeded = Math.ceil(contentHeight / (doc.internal.pageSize.height - 40));
    currentPage += pagesNeeded;
  }

  // Generate Table of Contents
  doc.setFontSize(16);
  doc.text('Table of Contents', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  let tocY = 40;
  songs.forEach((song, index) => {
    const pageNum = songPageNumbers[index];
    doc.setFontSize(12);
    const title = `${index + 1}. ${song.title}`;
    const titleWidth = doc.getStringUnitWidth(title) * 12 / doc.internal.scaleFactor;
    doc.text(title, 20, tocY);
    doc.text(`${pageNum}`, doc.internal.pageSize.width - 20, tocY, { align: 'right' });
    doc.line(20 + titleWidth + 5, tocY + 2, doc.internal.pageSize.width - 25, tocY + 2);
    tocY += 10;
    if (tocY > doc.internal.pageSize.height - 20) {
      doc.addPage();
      pageNumber++;
      tocY = 20;
    }
  });
  doc.addPage();
  pageNumber++;

  // Add song pages
  for (const song of songs) {
    doc.setFontSize(16);
    doc.text(song.title, doc.internal.pageSize.width / 2, 20, { align: 'center' });
    
    let currentY = 40;

    // Add lyrics
    doc.setFontSize(12);
    doc.text('Lyrics:', 20, currentY);
    currentY += 10;
    doc.setFontSize(10);
    const lyricsText = song.lyrics.map(stanza => stanza.join('\n')).join('\n\n');
    const lyricsLines = doc.splitTextToSize(lyricsText, doc.internal.pageSize.width - 40);
    doc.text(lyricsLines, 20, currentY);
    currentY += lyricsLines.length * 5 + 10;

    // Add translation if available
    if (song.translation && song.translation.length > 0) {
      doc.setFontSize(12);
      doc.text('Translation:', 20, currentY);
      currentY += 10;
      doc.setFontSize(10);
      const translationText = song.translation.map(stanza => stanza.join('\n')).join('\n\n');
      const translationLines = doc.splitTextToSize(translationText, doc.internal.pageSize.width - 40);
      doc.text(translationLines, 20, currentY);
      currentY += translationLines.length * 5 + 10;
    }

    // Add YouTube link if available
    if (song.youtubeLink) {
      doc.setFontSize(10);
      doc.textWithLink('Watch on YouTube', 20, currentY, { url: song.youtubeLink });
      currentY += 10;
    }

    // Add QR code if available
    if (song.youtubeLink) {
      const qrCodeDataUrl = await generateQRCode(song.youtubeLink);
      doc.addImage(qrCodeDataUrl, 'PNG', 20, currentY, 30, 30);
    }

    doc.setFontSize(10);
    doc.text(`Page ${pageNumber}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    pageNumber++;
    
    if (currentY > doc.internal.pageSize.height - 40 || songs.indexOf(song) < songs.length - 1) {
      doc.addPage();
    }
  }
  
  doc.save('ilahiBook.pdf');
}

function estimateSongContentHeight(doc: jsPDF, song: SongData): number {
  let height = 60; // Title and initial spacing
  height += song.lyrics.flat().length * 5;
  if (song.translation) {
    height += song.translation.flat().length * 5;
  }
  height += 50; // Additional space for YouTube link and QR code
  return height;
}