import { SongData } from './types'; // Add this import

function normalizeText(text: string): string {
  const map: { [key: string]: string } = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'I','Î':'I' , 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C',
    'â': 'a', 'î': 'i', 'û': 'u'
  };
  return text.toLowerCase()
    .replace(/[ıİÎğĞüÜşŞöÖçÇâîû]/g, char => map[char] || char);
}

export function slugify(text: string): string {
  return normalizeText(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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