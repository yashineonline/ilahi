export interface SongData {
  title: string;
  lyrics: string[][];
  translation: string[][];
  youtubeLink: string;
  isUnderEdit: boolean;
}

export function processSongsFile(fileContent: string): SongData[] {
  const songSections = fileContent.split('Y:').filter(section => section.trim().length > 0);

  const splitStanzas = (text: string): string[][] => {
    return text.split('\n\n').map(stanza => stanza.trim().split('\n'));
  };

  const songs = songSections.map(section => {
    const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Find the title (first non-empty line)
    const titleIndex = lines.findIndex(line => line.length > 0);
    const title = lines[titleIndex];

    // Find where the lyrics start (first non-empty line after the title)
    const lyricsStartIndex = lines.slice(titleIndex + 1).findIndex(line => line.length > 0) + titleIndex + 1;

    // Find where the translation starts
    const translationStart = lines.findIndex(line => line === 'T:');

    // Extract lyrics
    const lyricsText = lines.slice(lyricsStartIndex, translationStart !== -1 ? translationStart : undefined).join('\n');
    const lyrics = splitStanzas(lyricsText);
    // Extract translation if it exists
    const translationText = translationStart !== -1
    ? lines.slice(translationStart + 1).join('\n')
    : '';
    const translation = translationStart !== -1 ? splitStanzas(translationText) : [];
    // Extract YouTube link if present
    const youtubeLink = lines.find(line => line.toLowerCase().includes('youtube'))?.split(':')[1]?.trim() || '';
return { title, lyrics, translation, youtubeLink, isUnderEdit: false };
});
return songs.sort((a, b) => a.title.localeCompare(b.title));
}