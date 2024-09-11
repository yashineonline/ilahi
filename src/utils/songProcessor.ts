import { SongData } from './types';
import * as unorm from 'unorm';

export function processStanzas(stanzas: string[][]): string[][] {
  return stanzas;
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

  if (song.audioLink) {
    if (song.audioLink.includes('youtube.com') || song.audioLink.includes('youtu.be')) {
      html += `<section class="youtube-link mb-6 text-center">
        <a href="${unorm.nfc(song.audioLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Watch on YouTube
        </a>
      </section>`;
    }
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

import { slugify } from '../utils/search';

export function processSongsFile(fileContent: string): SongData[] {
  const songSections = fileContent.split('Y:')
    .map(section => section.trim())
    .filter(section => section.length > 0);

const splitStanzas = (text: string): string[][] => {
    const lines = text.split('\n');
    const result: string[][] = [];
    let currentStanza: string[] = [];

    for (const line of lines) {
      if (line.trim() === '') {
        if (currentStanza.length > 0) {
          result.push(currentStanza);
          currentStanza = [];
        }
      } else {
        currentStanza.push(line.trim());
      }
    }

    if (currentStanza.length > 0) {
      result.push(currentStanza);
    }

    return result;
  };

  const songs = songSections.map(section => {
    const lines = section.split('\n');

    let audioLink = '';
    let title = '';
    let categories: string[] = [];
    let titleIndex = -1;

    // Find the audio link, categories, and title
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (trimmedLine.startsWith('http')) {
        audioLink = trimmedLine;
      } else if (trimmedLine.startsWith('C:')) {
        categories = trimmedLine.substring(2).split(',').map(cat => cat.trim());
      } else if (trimmedLine !== '') {
        title = trimmedLine;
        titleIndex = i;
        break;
      }
    }

    // If no title is found, skip this section
    if (titleIndex === -1) {
      return null;
    }

    const lyricsStartIndex = titleIndex + 1;
    const translationStart = lines.findIndex((line, index) => index > lyricsStartIndex && line.trim() === 'T:');

    const lyricsText = lines.slice(lyricsStartIndex, translationStart !== -1 ? translationStart : undefined).join('\n');
    const lyrics = splitStanzas(lyricsText);

    const translationText = translationStart !== -1
      ? lines.slice(translationStart + 1).join('\n')
      : '';
    const translation = translationStart !== -1 ? splitStanzas(translationText) : [];

    const slug = slugify(title);  // Generate a slug from the title

    return { 
      title, 
      lyrics, 
      translation, 
      audioLink: audioLink,
      categories, 
      isUnderEdit: false,
      slug  // Add the slug property
    };
  }).filter(song => song !== null);

  return songs.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
}

export function getProcessedSongsCount(fileContent: string): number {
  const songs = processSongsFile(fileContent);
  return songs.length;
}