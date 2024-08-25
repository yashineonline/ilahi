import { SongData } from './types';
import * as unorm from 'unorm';

export function processStanzas(stanzas: string[][]): string[][] {
  return stanzas.map(stanza => 
    stanza.filter(line => line.trim() !== '')
  ).filter(stanza => stanza.length > 0);
}

export function processSong(song: SongData): SongData {
  return {
    ...song,
    lyrics: processStanzas(song.lyrics),
    translation: song.translation ? processStanzas(song.translation) : undefined
  };
}

export function renderSong(song: SongData, options: { fontSize: number, showTranslation: boolean, theme: 'light' | 'dark' }): string {
  const { fontSize = 16, showTranslation = true, theme = 'light' } = options;
  
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  
  let html = `<section class="lyrics mb-6" style="font-size: ${fontSize}px;">
    ${renderStanzas(song.lyrics, textColor)}
  </section>`;

  if (showTranslation && song.translation && song.translation.length > 0) {
    html += `<section class="translation mb-6" style="font-size: ${fontSize}px;">
      <h2 class="text-2xl font-semibold mb-4 ${textColor}">Translation</h2>
      ${renderStanzas(song.translation, textColor)}
    </section>`;
  }

  if (song.youtubeLink) {
    html += `<section class="youtube-link mb-6 text-center">
      <h2 class="text-2xl font-semibold mb-4 ${textColor}">YouTube</h2>
      <a href="${unorm.nfc(song.youtubeLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Watch on YouTube
      </a>
    </section>`;
  }

  return html;
}

function renderStanzas(stanzas: string[][], textColor: string): string {
  console.log('Rendering stanzas:');
  return stanzas.map((stanza, index) => {
    console.log(`Stanza ${index}:`, JSON.stringify(stanza, null, 2));
    return `
      <div class="mb-8 pb-4 border-b border-gray-300" data-stanza-index="${index}">
        ${stanza.map((line, lineIndex) => `<p class="mb-1 ${textColor}" data-line-index="${lineIndex}">${unorm.nfc(line)}</p>`).join('')}
      </div>
    `;
  }).join('');
}

export function processSongsFile(fileContent: string): SongData[] {
  const songSections = fileContent.split('Y:').filter(section => section.trim().length > 0);

  const splitStanzas = (text: string): string[][] => {
    const lines = unorm.nfc(text).split('\n');
    const result: string[][] = [];
    let currentStanza: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '') {
        if (currentStanza.length > 0) {
          result.push(currentStanza);
          currentStanza = [];
        }
      } else {
        currentStanza.push(trimmedLine);
      }
    }

    if (currentStanza.length > 0) {
      result.push(currentStanza);
    }

    console.log('Split stanzas result:', JSON.stringify(result, null, 2));
    return result;
  };

  const songs = songSections.map(section => {
    const lines = unorm.nfc(section).split('\n').map(line => line.trim());

    const titleIndex = lines.findIndex(line => line.length > 0);
    const title = lines[titleIndex];

    const lyricsStartIndex = lines.slice(titleIndex + 1).findIndex(line => line.length > 0) + titleIndex + 1;

    const translationStart = lines.findIndex(line => line === 'T:');

    const lyricsText = lines.slice(lyricsStartIndex, translationStart !== -1 ? translationStart : undefined).join('\n');
    const lyrics = splitStanzas(lyricsText);
    console.log('Processed lyrics:', lyrics);

    const translationText = translationStart !== -1
      ? lines.slice(translationStart + 1).join('\n')
      : '';
    const translation = translationStart !== -1 ? splitStanzas(translationText) : [];
    console.log('Processed translation:', translation);

    const youtubeLink = lines.find(line => line.toLowerCase().includes('youtube'))?.split(':')[1]?.trim() || '';
    return { title, lyrics, translation, youtubeLink, isUnderEdit: false };
  });

  console.log('Processed songs:', songs);
  return songs.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
}

export function getProcessedSongsCount(fileContent: string): number {
  const songs = processSongsFile(fileContent);
  return songs.length;
}

