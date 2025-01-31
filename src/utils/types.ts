export interface SongData {
  title: string;
  lyrics: string[][];
  translation?: string[][];
  pronunciation?: string[][];
  // history?: string[][];  // Add this line
  audioLink?: string;
  mainLinks: string[];
  alternateTunes: string[];
  categories: string[];
  order?: number; // Add this line
  tags: string[];
  isUnderEdit: boolean;
  slug: string;
}

export interface ZikrItem {
  zikrTitle: string;  // Changed from 'title' to 'zikrTitle' to avoid confusion
  zikrLink: string;
  zikrLyrics?: string[][];  // Add optional lyrics property
}