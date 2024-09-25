import { generateFullBookPDF } from './fullSongBookPDF';
import { SongData } from './types';

self.onmessage = async (event: MessageEvent) => {
  const { songs, isCustom } = event.data;
  try {
    const { pdfBytes, logs } = await generateFullBookPDF(songs, isCustom);
    self.postMessage({ pdfBytes, logs, success: true });
  } catch (error) {
    self.postMessage({ error: error.message, success: false });
  }
};