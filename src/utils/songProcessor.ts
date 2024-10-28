import { SongData, ZikrItem } from './types';
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
  
  // Filter out the history stanza from lyrics
  const lyricsWithoutHistory = song.lyrics.filter(stanza => !stanza.some(line => line.includes('History:')));

  let html = `<section class="lyrics mb-6" style="font-size: ${fontSize}px;">
    ${renderStanzas(lyricsWithoutHistory, textColor)}
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

    // Add a section for history if it exists
    const historyStanza = song.lyrics.find(stanza => stanza.some(line => line.includes('History:')));
    if (historyStanza) {
      html += `<section id="history" class="history mb-6" style="font-size: ${fontSize}px;">
        <h2 class="text-2xl font-semibold mb-4 ${textColor}">Tarih</h2>
        ${renderStanzas([historyStanza], textColor)}
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

import { slugify } from '../utils/search';

export function processSongsFile(fileContent: string): { songs: SongData[], subcategories: Record<string, string[]>,  zikrItems: ZikrItem[]} {
  const lines = fileContent.split('\n');
  const subcategories: Record<string, string[]> = {};
  let songSections: string[] = [];
  let zikrItems: ZikrItem[] = [];

  let isParsingNotes = true;
  let isParsingZikr = false;
  let isParsingSubcategories = false;
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'ZIKRPRACTICE:') {
      isParsingZikr = true;
      continue;
    }

    if (line === 'ENDOFZIKRPRACTICE') {
      isParsingZikr = false;
      continue;
    }

    if (isParsingZikr && line) {
      // Skip empty lines between zikr entries
      if (line.includes('drive.google.com')) {
        const link = line;
        let i = lines.indexOf(line) + 1;
        const title = lines[i]?.trim();
        const lyricsStanzas: string[][] = [];
        let currentStanza: string[] = [];
        
        i++; // Move to the first potential lyrics line

    // Keep reading until we hit another link or end of zikr section
    while (i < lines.length && !lines[i].includes('drive.google.com') && lines[i].trim() !== 'ENDOFZIKRPRACTICE') {
          const lyricLine = lines[i].trim();
          
          if (lyricLine === '') {
            if (currentStanza.length > 0) {
              lyricsStanzas.push([...currentStanza]);
              currentStanza = [];
            }
          } else {
            currentStanza.push(lyricLine);
          }
        i++;
        }
        
        // Add final stanza if exists
        if (currentStanza.length > 0) {
          lyricsStanzas.push([...currentStanza]);
        }
        
        if (title && link) {
          zikrItems.push({
            zikrTitle: title,
            zikrLink: link,
            zikrLyrics: lyricsStanzas.length > 0 ? lyricsStanzas : undefined
          });
        }
        i--; // Step back one line since we'll increment in the loop
      }
    }  

    if (isParsingNotes) {
      if (line === 'SUBCATEGORIES:') {
        isParsingNotes = false;
        isParsingSubcategories = true;
        continue;
      }
      // Ignore notes
      continue;
    }
    
    if (isParsingSubcategories) {
      if (line === 'Y:') {
        isParsingSubcategories = false;
        continue;
      }
      if (line.includes(':')) {
        const [category, items] = line.split(':').map(s => s.trim());
        subcategories[category] = items.split(',').map(item => item.trim());
      }
    } else {
      if (line === 'Y:') {
        if (currentSection.trim()) {
          songSections.push(currentSection.trim());
        }
        currentSection = '';
      } else {
        currentSection += line + '\n';
      }
    }
  }

  if (currentSection.trim()) {
    songSections.push(currentSection.trim());
  }

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

    let mainLinks: string[] = [];
    let alternateTunes: string[] = [];
    let title = '';
    let categories: string[] = [];
    let tags: string[] = [];
    let titleIndex = -1;

    // Find the links, categories, and title
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();
      if (trimmedLine.startsWith('L:')) {
        mainLinks.push(trimmedLine.substring(2).trim());
      } else if (trimmedLine.startsWith('A:')) {
        alternateTunes.push(trimmedLine.substring(2).trim());
      } else if (trimmedLine.startsWith('C:')) {
        const [categoriesStr, tagsStr] = trimmedLine.substring(2).split('|').map(s => s.trim());
        categories = categoriesStr.split(',').map(cat => cat.trim());
        tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()) : [];
      } else if (trimmedLine !== '' && !title) {
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
      mainLinks,
      alternateTunes,
      categories, 
      tags, 
      isUnderEdit: false,
      slug  // Add the slug property
    };
  }).filter(song => song !== null);

  return { songs: songs.sort((a, b) => a.title.localeCompare(b.title, 'tr')), subcategories, zikrItems };
}

export function getProcessedSongsCount(fileContent: string): number {
  const { songs } = processSongsFile(fileContent);
  return songs.length;
}

export function extractZikrPracticeFolderLink(fileContent: string): string {
  const zikrSection = fileContent.split('ZIKRPRACTICE:')[1]?.split('\n\n')[0]?.trim();
  return zikrSection || '';
}