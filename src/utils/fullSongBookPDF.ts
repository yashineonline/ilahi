import { PDFDocument, rgb } from 'pdf-lib';
import { SongData } from './types';
import { generateSingleSongPage, estimateSongContentHeight, embedNotoSansFont } from './singleSongPDF';
import { createCoverPage, createTableOfContents, addPageNumbers } from './pdfBookUtils';

export async function generateFullBookPDF(songs: SongData[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await embedNotoSansFont(pdfDoc);

  const coverPage = await createCoverPage(pdfDoc, font, 'Ilahi Book');

  let currentPage = 2;
  const songPageNumbers: number[] = [];

  for (const song of songs) {
    songPageNumbers.push(currentPage);
    const contentHeight = estimateSongContentHeight(font, song, pdfDoc.getPage(0).getWidth() - 100);
    const pagesNeeded = Math.ceil(contentHeight / (pdfDoc.getPage(0).getHeight() - 100));
    currentPage += pagesNeeded;
  }

  const tocPages = await createTableOfContents(pdfDoc, font, songs, songPageNumbers);
  const songPages = await Promise.all(songs.map(song => generateSingleSongPage(pdfDoc, song)));

  addPageNumbers([coverPage, ...tocPages, ...songPages], font);

  return pdfDoc.save();
}