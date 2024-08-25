import { SongData } from './types'; // Add this import

function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c');
}

export function searchSongs(songs: SongData[], query: string): SongData[] {
  const normalizedQuery = normalizeText(query);
  return songs.filter(song => 
    normalizeText(song.title).includes(normalizedQuery) ||
    (Array.isArray(song.lyrics) && song.lyrics.some(stanza => 
      Array.isArray(stanza) && stanza.some(line => 
        typeof line === 'string' && normalizeText(line).includes(normalizedQuery)
      )
    ))
  );
}