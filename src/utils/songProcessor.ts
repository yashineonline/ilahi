export interface SongData {
  title: string;
  lyrics: string[][];
  translation: string[][];
  youtubeLink: string;
  isUnderEdit: boolean;
}

export function processSongsFile(fileContent: string): SongData[] {
  const songSections = fileContent.split(/\n\s*\n\s*\n/).filter(section => section.trim().length > 0);

  const splitStanzas = (text: string): string[][] => {
    return text.split('\n\n').map(stanza => stanza.trim().split('\n'));
  };

  const songs = songSections.map(section => {
    const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const title = lines[0];
    const youtubeLink = lines.find(line => line.startsWith('Y:'))?.replace('Y:', '').trim() || 'Coming soon!';

    const lyricsStart = lines.findIndex(line => line === 'L:') + 1;
    const translationStart = lines.findIndex(line => line === 'T:') + 1;

    const lyricsText = lines.slice(lyricsStart, translationStart > 0 ? translationStart - 1 : undefined)
      .filter(line => line !== 'L:')
      .join('\n');

    const translationText = translationStart > 0
      ? lines.slice(translationStart).filter(line => line !== 'T:').join('\n')
      : '';

    const lyrics = splitStanzas(lyricsText);
    const translation = translationStart !== -1 ? splitStanzas(translationText) : [];

    return { title, lyrics, translation, youtubeLink, isUnderEdit: false };
  });

  return songs.sort((a, b) => a.title.localeCompare(b.title));
}