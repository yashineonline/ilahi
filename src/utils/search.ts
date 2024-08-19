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
      song.lyrics.some(stanza => 
        stanza.some(line => normalizeText(line).includes(normalizedQuery))
      )
    );
  }
  