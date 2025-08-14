import { PDFDocument, rgb } from 'pdf-lib';
import { SongData } from './types';
import { generateSingleSongPage, embedFont } from './singleSongPDF';
import { createCoverPage, createTableOfContents, addPageNumbersAndFooters, updateTableOfContents, embedImage } from './pdfBookUtils';
import { FONT_PATH } from './fontConfig';
import type { SingleSongPdfOptions } from './singleSongPDF';



export async function generateFullBookPDF(
  songs: SongData[], 
  isCustom: boolean = false, 
  onProgress?:(progress: number)=>void,
  pageOptions?: SingleSongPdfOptions
): Promise<{ pdfBytes: Uint8Array, logs: string[] }> {
  const logs: string[] = [];
  const totalSteps = songs.length *2; // Adjust this number based on your total steps, instead of adding 10 or 15, i made it 2 steps for each song
  let currentStep = 0;
  const log = (message: string) => {
    // console.log(message);
    logs.push(message);
    currentStep++;
    if (onProgress) {
      onProgress(Math.min(99, (currentStep / totalSteps) * 100)); // Cap at 95% to leave room for final steps
    }
  };

  log('Generating full book PDF');
  const pdfDoc = await PDFDocument.create();
  const font = await embedFont(pdfDoc, FONT_PATH);

    // Cover image (Page 1)
  log('Creating cover image');
  const coverImage = await embedImage(pdfDoc, 'https://raw.githubusercontent.com/yashineonline/ilahiRepository/main/cover.png');
  const coverPage = pdfDoc.addPage();
  const { width, height } = coverPage.getSize();
  coverPage.drawImage(coverImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  // Original cover content (Page 2)
  log('Creating original cover content');
  const originalCoverPage = await createCoverPage(pdfDoc, font, 'ilahi Book', isCustom);

  // Second image (Page 3)
  log('Creating second image');
  const secondImage = await embedImage(pdfDoc, 'https://raw.githubusercontent.com/yashineonline/ilahiRepository/main/poem.png');
  const secondImagePage = pdfDoc.addPage();
  secondImagePage.drawImage(secondImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  // Zikr quote (Page 4)
  log('Creating Zikr quote page');
  const zikrQuotePage = pdfDoc.addPage();
  const zikrQuote = `
    Now when you do the Zikr:
    empty your mind,
    connect yourself to the Energy
    and live some ecstasy.
    Live the Energy of Allah.
    - Es-Seyyid Es-Shaykh Taner Vargonen el Ansari
  `;
  zikrQuotePage.drawText(zikrQuote, {
    x: 50,
    y: height - 100,
    size: 14,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Second image (Page 5)
  log('Creating third image');
  const thirdImage = await embedImage(pdfDoc, 'https://raw.githubusercontent.com/yashineonline/ilahiRepository/main/names.png');
  const thirdImagePage = pdfDoc.addPage();
  thirdImagePage.drawImage(thirdImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });



  log('Creating table of contents');
  const tocPages = await createTableOfContents(pdfDoc, font, songs);

  let currentPage = 1;
  const songPageNumbers: number[] = [];
  const allPages = [coverPage, originalCoverPage, secondImagePage, zikrQuotePage, thirdImagePage, ...tocPages];

  for (const song of songs) {
    log(`Processing song: ${song.title}`);
    songPageNumbers.push(currentPage);
    const songPages = await generateSingleSongPage(pdfDoc, song, pageOptions);
    
    log(`Generated ${songPages.length} pages for song: ${song.title}`);
    allPages.push(...songPages);
    currentPage += songPages.length;
  }

  log('Updating table of contents');
  await updateTableOfContents(tocPages, songPageNumbers, font);

  // const pagesToSkip = 1 + poemPages.length + explanationPages.
  // length + tocPages.length;
  // const pagesToSkip = 1 + placeholderPages.length + tocPages.length;
  const pagesToSkip = 5 + tocPages.length; 

  log('Adding page numbers and draft statement');
  // compute once from options you pass into generateFullBookPDF
const bottomOffset = pageOptions?.border?.enabled ? ((pageOptions?.border?.imageUrl ? (pageOptions?.border?.imageInset ?? 18) : 36) + 6) : 0;
addPageNumbersAndFooters(allPages, font, 1, pagesToSkip, bottomOffset);


  log('Saving PDF');
  const pdfBytes = await pdfDoc.save();
  if (onProgress) {
    onProgress(100); // Set to 100% when PDF is fully generated
  }
  return { pdfBytes, logs };
}