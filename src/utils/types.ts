export interface SongData {
  title: string;
  lyrics: string[][];
  translation: string[][];
  audioLink?: string;
  mainLinks: string[];
  alternateTunes: string[];
  categories: string[];
  tags: string[];
  isUnderEdit: boolean;
  slug: string;
}

export interface ZikrItem {
  zikrTitle: string;  // Changed from 'title' to 'zikrTitle' to avoid confusion
  zikrLink: string;
  zikrLyrics?: string[][];  // Add optional lyrics property
}